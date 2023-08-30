import {Test, TestingModule} from '@nestjs/testing';
import {UserRolesController} from './user-roles.controller';
import {UserRolesService} from './user-roles.service';
import {UserRoles} from './enums/user-roles.enum';
import {UserRoleDto} from './dtos/user-role.dto';
import {BasicDto} from '../../shared/dto/basic.dto';
import {UserPermissions} from './enums/user-permissions.enum';
import {UUIDDto} from '../../shared/dto/uui.dto';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {UserRoleEntity} from './entities/user-role.entity';
import {UserRoleUpdateDto} from './dtos/user-role.update.dto';
import {UserDto} from '../users/dtos/user.dto';
import {NotFoundException} from '@nestjs/common';
import {BasicEntity} from '../../shared/entities/basic.entity';

describe('UserRolesController', () => {
    let controller: UserRolesController;
    let service: UserRolesService;
    const userRoleEntities: UserRoleEntity[] = [];

    const mockUserRolesService = {
        addUserRole: jest.fn(dto => {
            return {
                id: expect.any(String),
                // created: expect.any(Date),
                // updated: expect.any(Date),
                created: expect.any(Date),
                updated: expect.any(Date),
                status: BasicStatuses.Active,
                type: dto.type,
                permissions: dto.permissions,
            }
        }),
        getAllUserRoles: jest.fn().mockResolvedValue(userRoleEntities),
        updateUserRole: jest.fn((id, dto) => {
            return {
                id,
                ...dto
            }
        }),
        getUserRoleById: jest.fn((userId) => {
            return {
                userId,
                ...UserRoleDto
            }
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserRolesController],
            providers: [UserRolesService],
        })
            .overrideProvider(UserRolesService)
            .useValue(mockUserRolesService)
            .compile();

        controller = module.get<UserRolesController>(UserRolesController);
        service = module.get<UserRolesService>(UserRolesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    const mockedBasicFields = {
        id: expect.any(String),
        created: expect.any(Date),
        updated: expect.any(Date),
        status: BasicStatuses.Active,
    }

    describe('POST/user-roles', () => {
        it('should create user role', async () => {

            const userRoleDto: UserRoleDto = {
                type: UserRoles.Admin,
                permissions: [UserPermissions.All],
                id: expect.any(String),
                created: expect.any(Number),
                updated: expect.any(Number),
                status: BasicStatuses.Active,
            };

            const expectedResponse = {
                id: expect.any(String),
                created: expect.any(Date),
                updated: expect.any(Date),
                status: 'active',
                type: 'admin',
                permissions: ['permissions.all']

            };

            const result = await controller.addUserRole(userRoleDto);
            expect(result).toEqual(expectedResponse);

            expect(mockUserRolesService.addUserRole).toHaveBeenCalledWith(userRoleDto);
        });
    });

    describe('GET/user-roles', () => {
        it('should return array of user roles', async () => {
          const result = await controller.getAllUserRoles();
          expect(result).toBeInstanceOf(Array);
        });
    });

    describe('GET/user-roles/:userRoleId', () => {
        it('should return user role by role id', async () => {
            const userRoleDto: UserRoleDto = {
                id: "90366a15-0176-4581-a124-357d479fe824",
                created: expect.any(Number),
                updated: expect.any(Number),
                type: UserRoles.Admin,
                status: BasicStatuses.Active,
                permissions: [UserPermissions.All],
            };
            // const userRoleDto: UserRoleDto = {
            //     type: UserRoles.Admin,
            //     permissions: [UserPermissions.All],
            //     ...mockedBasicFields,
            // };
            // const mockUserRole: UserRoleEntity = {
            //     id: '90366a15-0176-4581-a124-357d479fe824',
            //     status: BasicStatuses.Active,
            //     created: new Date(),
            //     updated: new Date(),
            //     type: UserRoles.Admin,
            //     permissions: [UserPermissions.All],
            // };
            // const dto = UserRoleDto.fromEntity(mockUserRole);
            // console.log(dto);
            const res = await controller.addUserRole(userRoleDto);
            console.log(res);
            let result = await controller.getUserRoleById(res.id);
            console.log(result);

            expect(result).toEqual(res);
            expect(mockUserRolesService.getUserRoleById).toHaveBeenCalledWith(userRoleDto.id);
        });
    });

    describe('POST/:userRoleId', () => {
        it('should edit user role', async () => {
            const userRoleDto: UserRoleDto = {
                type: UserRoles.User,
                permissions: [UserPermissions.All],
                ...mockedBasicFields,
            };
            const data: UserRoleUpdateDto = {
                type: UserRoles.Admin,
            }
            const res = await controller.updateUserRole(userRoleDto.id, data);
            expect(res.type).toEqual('admin');

            expect(mockUserRolesService.updateUserRole).toHaveBeenCalledWith(userRoleDto.id, data);
        });


    });




});
