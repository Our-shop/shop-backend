import {UsersService} from './users.service';
import {UserEntity} from './entities/user.entity';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {UserDto} from './dtos/user.dto';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@mikro-orm/nestjs';
import {EntityManager} from '@mikro-orm/postgresql';
import {UserRoleDto} from '../user-roles/dtos/user-role.dto';
import {UserRoles} from '../user-roles/enums/user-roles.enum';
import {UserPermissions} from '../user-roles/enums/user-permissions.enum';

describe('UsersService', () => {
    let service: UsersService;
    const userEntities: UserEntity[] = [];
    let userEntity: UserEntity;

    const mockEntityManager = {
        findAll: jest.fn().mockResolvedValue(userEntities),
        findOne: jest.fn().mockResolvedValue(userEntity),
        persistAndFlush: jest.fn(),
        flush: jest.fn(),
    };

    const mockUserRepo = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getAllUsers: jest.fn().mockResolvedValue(userEntities),
        getList: jest.fn(),
        addUser: jest.fn(dto => {
            return {
              ...dto
            }
        }),
        create: jest.fn().mockImplementation(dto => dto),
        getUserById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(ErrorCodes.NotExists_User);
            }
            return {
                id: id,
                ...userMockedDto,
            }
        }),
        updateUser: jest.fn((id, data) => {
            return Object.assign(userMockedDto, data);
        }),
        deleteUser: jest.fn((id) => {
            const found = mockUserRepo.getUserById(id);
            if (!found) {
                throw new NotFoundException(ErrorCodes.NotExists_User);
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    }

    const userMockedDto: UserDto = {
        id: "90366a15-0176-4581-a124-357d479fe824",
        created: 1693305565000,
        updated: 1693305565000,
        status: BasicStatuses.Active,
        roleId: "42e9c2ad-f6b3-4d20-a941-171bdce109bb",
        userName: "Denis",
        password: "123!Qwerty",
        email: "test@mail.ru"
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
                UsersService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockUserRepo,
                },
                {
                    provide: EntityManager,
                    useValue: mockEntityManager,
                },
            ],
        })
            .overrideProvider(UsersService)
            .useValue(mockUserRepo)
            .compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllUserRoles()', () => {
        it('should return array',async () => {
            const result = await service.getAllUsers();
            expect(result).toBeInstanceOf(Array);
            expect(mockUserRepo.getAllUsers).toHaveBeenCalled();
        })
    })

    describe('getUserById()', () => {
        it('should return user by id',async () => {
            const res = await service.addUser(userMockedDto);
            const entity = await service.getUserById(res.id);
            const dto = UserDto.fromEntity(entity);

            expect(dto).toEqual(userMockedDto);
            expect(mockUserRepo.getUserById).toHaveBeenCalledWith(userMockedDto.id);

        })

        it('should return NotFoundException if user not found', async () => {

            try {
                await service.getUserById(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockUserRepo.getUserById).toHaveBeenCalledWith(null);
        });
    });

    describe('addUser()', () => {
        it('should create new user',async () => {
            const entity = await service.addUser(userMockedDto);
            const dto = UserDto.fromEntity(entity)

            expect(dto).toEqual(userMockedDto);
            expect(mockUserRepo.addUser).toHaveBeenCalledWith(userMockedDto);
        })
    });

    describe('updateUser()', () => {
        it('should update user by id',async () => {
            const data: Partial<UserDto> = {
                userName: 'Svetlana',
            }
            const res = await service.updateUser(userMockedDto.id, data);
            const dto = UserDto.fromEntity(res);

            expect(dto.userName).toEqual('Svetlana');
            expect(mockUserRepo.updateUser).toHaveBeenCalledWith(userMockedDto.id, data);
        })
    });

    describe('deleteUser()', () => {
        it('should archive user', async () => {
            const res = await service.addUser(userMockedDto);
            const deleted = await service.deleteUser(res.id);

            expect(deleted.status).toEqual('archived');
            expect(mockUserRepo.deleteUser).toHaveBeenCalledWith(res.id);
        });

        it('should return NotFoundException if user not found', async () => {
            try {
                await service.deleteUser(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockUserRepo.deleteUser).toHaveBeenCalledWith(null);
        });
    });


});

