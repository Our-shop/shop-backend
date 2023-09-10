import { TestingModule, Test } from '@nestjs/testing';
import { UserRolesService } from './user-roles.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { UserRoleEntity } from './entities/user-role.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserRoleDto } from './dtos/user-role.dto';
import { UserRoles } from './enums/user-roles.enum';
import { BasicStatuses } from '../../shared/enums/basic-statuses.enum';
import { UserPermissions } from './enums/user-permissions.enum';
import { NotFoundException } from '@nestjs/common';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';

describe('UserRolesService', () => {
    let service: UserRolesService;
    const userRoleEntities: UserRoleEntity[] = [];
    let userRoleEntity: UserRoleEntity;

    const mockEntityManager = {
        findAll: jest.fn().mockResolvedValue(userRoleEntities),
        findOne: jest.fn().mockResolvedValue(userRoleEntity),
        persistAndFlush: jest.fn(),
        flush: jest.fn(),
    };

    const mockUserRoleRepo = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getAllUserRoles: jest.fn().mockResolvedValue(userRoleEntities),
        getList: jest.fn(),
        addUserRole: jest.fn(dto => {
            return {
                id: dto.id,
                created: new Date(dto.created),
                updated: new Date(dto.updated),
                status: BasicStatuses.Active,
                type: dto.type,
                permissions: dto.permissions,
            }
        }),
        create: jest.fn().mockImplementation(dto => dto),
        getUserRoleById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(ErrorCodes.NotFound_User_Role);
            }
            return {
                id: id,
                ...userRoleMockedDto,
            }
        }),
        updateUserRole: jest.fn((id, dto) => {
            return {
                id,
                ...dto
            }
        }),
        deleteUserRole: jest.fn((id) => {
            const found = mockUserRoleRepo.getUserRoleById(id);
            if (!found) {
                throw new NotFoundException(ErrorCodes.NotFound_User_Role);
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    }

    const userRoleMockedDto: UserRoleDto = {
        id: "90366a15-0176-4581-a124-357d479fe824",
        created: 1693305565000,
        updated: 1693305565000,
        type: UserRoles.Admin,
        status: BasicStatuses.Active,
        permissions: [UserPermissions.All],
    };

    const mockedBasicFields = {
        id: expect.any(String),
        created: expect.any(Date),
        updated: expect.any(Date),
        status: BasicStatuses.Active,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRolesService,
                {
                    provide: getRepositoryToken(UserRoleEntity),
                    useValue: mockUserRoleRepo,
                },
                {
                    provide: EntityManager,
                    useValue: mockEntityManager,
                },
            ],
        })
            .overrideProvider(UserRolesService)
            .useValue(mockUserRoleRepo)
            .compile();

        service = module.get<UserRolesService>(UserRolesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllUserRoles()', () => {
        it('should return array',async () => {
          const result = await service.getAllUserRoles();
          expect(result).toBeInstanceOf(Array);
          expect(mockUserRoleRepo.getAllUserRoles).toHaveBeenCalled();
        })

    })

    describe('getUserRole()', () => {
        it('should return user role by id',async () => {
            const res = await service.addUserRole(userRoleMockedDto);
            const entity = await service.getUserRoleById(res.id);
            const dto = UserRoleDto.fromEntity(entity);

            expect(dto).toEqual(userRoleMockedDto);
            expect(mockUserRoleRepo.getUserRoleById).toHaveBeenCalledWith(userRoleMockedDto.id);

        })

        it('should return NotFoundException if user role not found', async () => {

            try {
                await service.getUserRoleById(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockUserRoleRepo.getUserRoleById).toHaveBeenCalledWith(null);
        });
    })

    describe('addUserRole()', () => {
        it('should create new user role',async () => {
            const entity = await service.addUserRole(userRoleMockedDto);
            const dto = UserRoleDto.fromEntity(entity)

            expect(dto).toEqual(userRoleMockedDto);
            expect(mockUserRoleRepo.addUserRole).toHaveBeenCalledWith(userRoleMockedDto);
        })
    });



    describe('updateUserRole()', () => {
        it('should update user role by id',async () => {
            const userRoleDto: UserRoleDto = {
                type: UserRoles.User,
                permissions: [UserPermissions.All],
                ...mockedBasicFields,
            };
            const data: Partial<UserRoleDto> = {
                type: UserRoles.Admin,
            }
            const res = await service.updateUserRole(userRoleDto.id, data);
            expect(res.type).toEqual('admin');

            expect(mockUserRoleRepo.updateUserRole).toHaveBeenCalledWith(userRoleDto.id, data);
        })
    });

    describe('deleteUserRole()', () => {
        it('should archive user role', async () => {
            const res = await service.addUserRole(userRoleMockedDto);
            const deleted = await service.deleteUserRole(res.id);

            expect(deleted.status).toEqual('archived');
            expect(mockUserRoleRepo.deleteUserRole).toHaveBeenCalledWith(res.id);
        });

        it('should return NotFoundException if user role not found', async () => {

            try {
                await service.deleteUserRole(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockUserRoleRepo.deleteUserRole).toHaveBeenCalledWith(null);
        });
    });

});

