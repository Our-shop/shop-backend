import { TestingModule, Test } from '@nestjs/testing';
import { UserRolesService } from './user-roles.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { UserRoleEntity } from './entities/user-role.entity';

describe('UserRolesService', () => {
    let service: UserRolesService;
    const mockUserRoleRepo = {
        addUserRole: jest.fn().mockImplementation(dto => dto),
        findAll: jest.fn(),
        finOne: jest.fn(),
        create: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserRolesService, {
                provide: getRepositoryToken(UserRoleEntity),
                useValue: mockUserRoleRepo,
            }],
        })
            .overrideProvider(UserRolesService)
            .useValue(mockUserRoleRepo)
            .compile();

        service = module.get<UserRolesService>(UserRolesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // describe('Testing getAllUserRoles() functionality', () => {
    //     it('should return array',() => {
    //       const result = service.getAllUserRoles();
    //       console.log(result);
    //       expect(result).toBeInstanceOf(Array);
    //     })
    // })

});

