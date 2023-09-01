import {Test, TestingModule} from '@nestjs/testing';
import {UserRolesController} from './user-roles.controller';
import {UserRolesService} from './user-roles.service';
import {UserRoles} from './enums/user-roles.enum';
import {UserRoleDto} from './dtos/user-role.dto';
import {UserPermissions} from './enums/user-permissions.enum';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {UserRoleEntity} from './entities/user-role.entity';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {I18nContext, I18nService} from 'nestjs-i18n';


describe('UserRolesController', () => {
    let controller: UserRolesController;
    let service: UserRolesService;
    const userRoleEntities: UserRoleEntity[] = [];
    let i18n: I18nContext;

    const userRoleMockedDto: UserRoleDto = {
        id: "90366a15-0176-4581-a124-357d479fe824",
        created: 1693305565000,
        updated: 1693305565000,
        type: UserRoles.Admin,
        status: BasicStatuses.Active,
        permissions: [UserPermissions.All],
    };

    const mockUserRolesService = {
        addUserRole: jest.fn(dto => {
            return {
               ...dto
            }
        }),
        getAllUserRoles: jest.fn().mockResolvedValue(userRoleEntities),
        getUserRoleById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_User_Role)
                );
            }
            return {
                id: id,
                ...userRoleMockedDto,
            }
        }),
        updateUserRole: jest.fn((id, dto) => {
            const found = mockUserRolesService.getUserRoleById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_User_Role)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteUserRole: jest.fn((id) => {
            const found = mockUserRolesService.getUserRoleById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_User_Role)
                );
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserRolesController],
            providers: [
                UserRolesService,
                {
                    provide: I18nService,
                    useValue: i18n,
                },
            ],
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

    describe('GET/user-roles', () => {
        it('should return array of user roles', async () => {
          const result = await controller.getAllUserRoles();
          expect(result).toBeInstanceOf(Array);
        });
    });

    describe('GET/user-roles/:userRoleId', () => {
        it('should return user role dto by role id', async () => {
            const res = await controller.addUserRole(userRoleMockedDto);
            let result = await controller.getUserRoleById(res.id, i18n);

            expect(result).toEqual(userRoleMockedDto);
            expect(mockUserRolesService.getUserRoleById).toHaveBeenCalledWith(userRoleMockedDto.id);
        });

        it('should return error if user role not found', async () => {

            try {
                await controller.getUserRoleById(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockUserRolesService.getUserRoleById).toHaveBeenCalledWith(null);
        });
    });

    describe('POST/user-roles', () => {
        it('should create user role', async () => {
            const result = await controller.addUserRole(userRoleMockedDto);

            expect(result).toEqual(userRoleMockedDto);
            expect(mockUserRolesService.addUserRole).toHaveBeenCalledWith(userRoleMockedDto);
        });
    });

    describe('POST/:userRoleId', () => {
        it('should edit user role', async () => {

            const data: Partial<UserRoleDto> = {
                type: UserRoles.Admin,
            }
            const res = await controller.updateUserRole(userRoleMockedDto.id, data);
            expect(res.type).toEqual('admin');

            expect(mockUserRolesService.updateUserRole).toHaveBeenCalledWith(userRoleMockedDto.id, data);
        });
    });

    describe('DELETE/:id', () => {
        it('should archive user role', async () => {
            const res = await controller.addUserRole(userRoleMockedDto);
            const deleted = await controller.deleteUserRole(res.id, i18n);

            expect(deleted.status).toEqual('archived');
            expect(mockUserRolesService.deleteUserRole).toHaveBeenCalledWith(res.id);
        });

        it('should return error if user role not found', async () => {

            try {
                await controller.deleteUserRole(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockUserRolesService.deleteUserRole).toHaveBeenCalledWith(null);
        });
    });


});
