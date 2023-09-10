import {Test, TestingModule} from '@nestjs/testing';
import {I18nContext, I18nService} from 'nestjs-i18n';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {UserEntity} from './entities/user.entity';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {UserDto} from './dtos/user.dto';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;
    const userEntities: UserEntity[] = [];
    let i18n: I18nContext;

    const mockUsersService = {
        getAllUsers: jest.fn().mockResolvedValue(userEntities),
        getUserById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotExists_User)
                );
            }
            return {
                id: id,
                ...userMockedDto,
            }
        }),
        addUser: jest.fn(dto => {
            return {
                ...dto
            }
        }),
        updateUser: jest.fn((id, dto) => {
            const found = mockUsersService.getUserById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotExists_User)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteUser: jest.fn((id) => {
            const found = mockUsersService.getUserById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotExists_User)
                );
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    };

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: I18nService,
                    useValue: i18n,
                },
            ],
        })
            .overrideProvider(UsersService)
            .useValue(mockUsersService)
            .compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('GET/users', () => {
        it('should return array of users', async () => {
            const result = await controller.getAllUsers();
            expect(result).toBeInstanceOf(Array);
            expect(mockUsersService.getAllUsers).toHaveBeenCalled();
        });
    });

    describe('GET/users/:id', () => {
        it('should return user by user id', async () => {
            const res = await controller.addUser(userMockedDto);
            let result = await controller.getUserById(res.id, i18n);

            expect(result).toEqual(userMockedDto);
            expect(mockUsersService.getUserById).toHaveBeenCalledWith(userMockedDto.id);
        });

        it('should return error if user not found', async () => {

            try {
                await controller.getUserById(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockUsersService.getUserById).toHaveBeenCalledWith(null);
        });
    });

    describe('POST/user', () => {
        it('should create user', async () => {
            const result = await controller.addUser(userMockedDto);

            expect(result).toEqual(userMockedDto);
            expect(mockUsersService.addUser).toHaveBeenCalledWith(userMockedDto);
        });
    });

    describe('POST/:id', () => {
        it('should edit user', async () => {
            const data: Partial<UserDto> = {
                userName: 'Svetlana',
            }
            const res = await controller.updateUser(userMockedDto.id, data);

            expect(res.userName).toEqual('Svetlana');
            expect(mockUsersService.updateUser).toHaveBeenCalledWith(userMockedDto.id, data);
        });
    });

    describe('DELETE/:id', () => {
        it('should archive user', async () => {
            const res = await controller.addUser(userMockedDto);
            const deleted = await controller.deleteUser(res.id, i18n);

            expect(deleted.status).toEqual('archived');
            expect(mockUsersService.deleteUser).toHaveBeenCalledWith(res.id);
        });

        it('should return error if user not found', async () => {

            try {
                await controller.deleteUser(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockUsersService.deleteUser).toHaveBeenCalledWith(null);
        });
    });

})
