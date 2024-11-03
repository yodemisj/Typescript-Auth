import { describe, expect, test, jest, beforeAll, beforeEach } from "@jest/globals";
import { UserService } from "../../services/UserService";
import { prismaMock } from "../__mocks__/prisma";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

jest.mock('bcryptjs');

describe('UserService', () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService();    
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should create a new user successfully", async () => {
        const name = "Nome teste";
        const email = "teste@gmail.com";
        const password = "12345678";
        const roleId = "akjsdnasbbaksdaskj";    

        prismaMock.user.findUnique.mockResolvedValue(null); 
        prismaMock.role.findUnique.mockResolvedValue({ id: roleId, name: "ADMIN" });
        bcrypt.hash = jest.fn<() => Promise<string>>().mockResolvedValue("hashedPassword");
        const date = new Date();
        const expectedUser: User = {
            id: 'fake-user-id',
            name,
            email,
            roleId,
            createdAt: date,
            updatedAt: date,
        }
        prismaMock.user.create.mockResolvedValue(expectedUser)

        const user = await userService.createUser(name, email, password, roleId);

        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email } });
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where:{ id: roleId } });
        expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(prismaMock.user.create).toHaveBeenCalledWith({ data: {
            name,
            email,
            role: { connect: { id: roleId } },
            credentials: {
                create: {
                    password: "hashedPassword",
                }
            }
        }})
        expect(user).toEqual(expectedUser);
    });

    test("should fail to create a user when database error occurs", async () => {
        const name = "Nome teste";
        const email = "teste@gmail.com";
        const password = "12345678";
        const roleId = "akjsdnasbbaksdaskj";    

        prismaMock.user.findUnique.mockResolvedValue(null); 
        prismaMock.role.findUnique.mockResolvedValue({ id: roleId, name: "ADMIN" });
        prismaMock.user.create.mockRejectedValue(new Error('Database error.'));

        await expect(userService.createUser(name, email, password, roleId)).rejects.toThrow('Database error.');

    });

    test("should fail to create a user when email is already in use", async () => {
        const name = "Nome teste";
        const email = "teste@gmail.com";
        const password = "12345678";
        const roleId = "akjsdnasbbaksdaskj";    

        prismaMock.user.findUnique.mockResolvedValue({
            id: "fake-user-id", 
            name: "Joao", 
            email: "teste@gmail.com", 
            roleId: "asdasdasd", 
            createdAt: new Date(), 
            updatedAt: new Date() 
        }); 

        await expect(userService.createUser(name, email, password, roleId))
        .rejects
        .toThrow("Email already used.");
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    });

    test("should fail to create a user when the role does not exist", async () => {
        const name = "Nome teste";
        const email = "teste@gmail.com";
        const password = "12345678";
        const roleId = "akjsdnasbbaksdaskj";    

        prismaMock.user.findUnique.mockResolvedValue(null); 
        prismaMock.role.findUnique.mockResolvedValue(null);

        await expect(userService.createUser(name, email, password, roleId))
        .rejects
        .toThrow('Role not found.');

        expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where:{ id: roleId } });
    });

    test("should fail to create a user when hashing password fails", async () => {
        const name = "Nome teste";
        const email = "teste@gmail.com";
        const password = "12345678";
        const roleId = "akjsdnasbbaksdaskj";    
    
        prismaMock.user.findUnique.mockResolvedValue(null); 
        prismaMock.role.findUnique.mockResolvedValue({ id: roleId, name: "ADMIN" });
        
        bcrypt.hash = jest.fn<() => Promise<string>>().mockRejectedValue(new Error("Hashing failed"));
    
        await expect(userService.createUser(name, email, password, roleId))
            .rejects
            .toThrow("Hashing failed");
    });

    test("should find a user successfully", async () => {
        const id = "fake-user-id";   
        const date = new Date();
    
        const expectedRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
    
        const expectedUser = {
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedRole 
        };
    
        prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    
        const user = await userService.findUserById(id);
    
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ 
            where: { id },
            include: { credentials: false, role: true }
        });
    
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(user).toEqual(expectedUser);
    });
    
    test("should throw an error when user is not found", async () => {
        const id = "fake-user-id";   
        prismaMock.user.findUnique.mockResolvedValue(null);
    
        await expect(userService.findUserById(id)).rejects.toThrow("User not found.");
    
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ 
            where: { id },
            include: { credentials: false, role: true }
        });
    
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    });

    test("should find all users successfully", async () => {
        const id = "fake-user-id";   
        const date = new Date();
    
        const expectedRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
    
        const expectedReturn = [{
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedRole 
        }];
    
        prismaMock.user.findMany.mockResolvedValue(expectedReturn);
    
        const users = await userService.findAllUsers();
    
        expect(prismaMock.user.findMany).toHaveBeenCalledWith({ 
            include: { credentials: false, role: true }
        });
    
        expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
        expect(users).toEqual(expectedReturn);
    });

    test('should failt to find all users when database error ocurrs', async () => {
        prismaMock.user.findMany.mockRejectedValue(new Error('Database error.'));

        await expect(userService.findAllUsers()).rejects.toThrow('Database error.');
    });

    test('should delete a user sucessfully', async () => {
        const id = 'fake-user-id'

        const expectedDeletedUser = {
            id,
            name: 'Fake User',
            email: 'fakeuser@example.com',
            roleId: 'fake-role-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            credentials: {
                id: 'fake-credential-id',
                password: 'hashedPassword',
                userId: id,
            },
        };

        prismaMock.user.delete.mockResolvedValue(expectedDeletedUser)

        const deletedUser = await userService.deleteUser(id);

        expect(prismaMock.user.delete).toHaveBeenCalledWith({
            where: {
                id
            },
            include: { credentials: true }
        });
        expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
        expect(deletedUser).toEqual(expectedDeletedUser);
    });

    test('should fail to delete a user', async () => {
        const id = 'fake-user-id';
        prismaMock.user.delete.mockRejectedValue(new PrismaClientKnownRequestError(
            'Record to delete does not exist.',
            {
                code: 'P2025',
                clientVersion: '^5.21.1',
            }
        ));

        await expect(userService.deleteUser(id)).rejects.toThrow('Record to delete does not exist.');
    });

    test('should update a user successfully', async () => {
        const id = 'fake-user-id';

        const data = {
            name: "newName",
            email: "newEmail@gmail.com",
            password: "newPassword",
            roleId: "newRoleId",
        }

        const date = new Date();
    
        const expectedFindRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
        
        const expectedUpdateRole = {
            id: 'newRoleId',
            name: 'ADMIN'
        };
    
        const expectedFindUser = {
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedFindRole 
        };

        bcrypt.hash = jest.fn<() => Promise<string>>().mockResolvedValue("newHashedPassword");

        const expectedUpdateUser = {
            id: 'fake-user-id',
            name: 'newName',
            email: 'newEmail@gmail.com',
            roleId: 'newRoleId',
            createdAt: date,
            updatedAt: date,
            role: expectedUpdateRole 
        };

        prismaMock.user.findUnique
        .mockResolvedValueOnce(expectedFindUser)
        .mockResolvedValue(null);

        prismaMock.role.findUnique.mockResolvedValue(expectedUpdateRole);

        prismaMock.user.update.mockResolvedValue(expectedUpdateUser);

        const updatedUser = await userService.updateUser(id, data);

        expect(prismaMock.user.findUnique).toHaveBeenCalled();

        const calls = prismaMock.user.findUnique.mock.calls;

        expect(calls[0]).toEqual([{ where: { id }, include: { credentials: false, role: true } }]);
        expect(calls[1]).toEqual([{ where: { email: data.email } }]);
        expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where: { id: data.roleId } });
        expect(prismaMock.user.update).toHaveBeenCalledWith({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                credentials: {
                    update: { password: "newHashedPassword" }
                },
                role: { connect: { id: data.roleId } }
            }
        });
        expect(updatedUser).toEqual(expectedUpdateUser);
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(2);
        expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);

    });

    test('should fail to update a user when email is already in use', async () => {
        const id = 'fake-user-id';

        const data = {
            name: "newName",
            email: "usedemail@gmail.com",
            password: "newPassword",
            roleId: "newRoleId",
        }

        const date = new Date();
    
        const expectedFindRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
        
        const expectedUpdateRole = {
            id: 'newRoleId',
            name: 'ADMIN'
        };
    
        const expectedFindUser = {
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedFindRole 
        };

        const expectedFindUserWithSameEmail = {
            id: 'fake-other-user-id',
            name: 'other user',
            email: 'usedemail@gmail.com',
            roleId: 'other-user-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedUpdateRole 
        };

        prismaMock.user.findUnique
        .mockResolvedValueOnce(expectedFindUser)
        .mockResolvedValue(expectedFindUserWithSameEmail);

        await expect(userService.updateUser(id, data)).rejects.toThrow('Email already used.');
        expect(prismaMock.user.findUnique).toHaveBeenCalled();
    });

    test('should fail to update a user when role is already in use', async () => {
        const id = 'fake-user-id';

        const data = {
            name: "newName",
            email: "newEmail@gmail.com",
            password: "newPassword",
            roleId: "newRoleId",
        }

        const date = new Date();
    
        const expectedFindRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
    
        const expectedFindUser = {
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedFindRole 
        };

        prismaMock.user.findUnique
        .mockResolvedValueOnce(expectedFindUser)
        .mockResolvedValue(null);

        prismaMock.role.findUnique.mockResolvedValue(null);

        await expect(userService.updateUser(id, data)).rejects.toThrow('Role not found.');

        expect(prismaMock.user.findUnique).toHaveBeenCalled();
        expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where: { id: data.roleId } });
        expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(2);
    });

    test('should fail to update a user when database error ocurrs', async () => {
        const id = 'fake-user-id';

        const data = {
            name: "newName",
            email: "newEmail@gmail.com",
            password: "newPassword",
            roleId: "newRoleId",
        }

        const date = new Date();
    
        const expectedFindRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
        
        const expectedUpdateRole = {
            id: 'newRoleId',
            name: 'ADMIN'
        };
    
        const expectedFindUser = {
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedFindRole 
        };

        bcrypt.hash = jest.fn<() => Promise<string>>().mockResolvedValue("newHashedPassword");

        prismaMock.user.findUnique
        .mockResolvedValueOnce(expectedFindUser)
        .mockResolvedValue(null);

        prismaMock.role.findUnique.mockResolvedValue(expectedUpdateRole);

        prismaMock.user.update.mockRejectedValue(new Error('Database error.'));

        await expect(userService.updateUser(id, data)).rejects.toThrow('Database error.');
    });

    test('should fail to update a user when hashing password fails', async () => {
        const id = 'fake-user-id';

        const data = {
            name: "newName",
            email: "newEmail@gmail.com",
            password: "newPassword",
            roleId: "newRoleId",
        }

        const date = new Date();
    
        const expectedFindRole = {
            id: 'fake-role-id',
            name: 'ADMIN'
        };
        
        const expectedUpdateRole = {
            id: 'newRoleId',
            name: 'ADMIN'
        };
    
        const expectedFindUser = {
            id: 'fake-user-id',
            name: 'fake-user-name',
            email: 'teste@gmail.com',
            roleId: 'fake-role-id',
            createdAt: date,
            updatedAt: date,
            role: expectedFindRole 
        };

        bcrypt.hash = jest.fn<() => Promise<string>>().mockRejectedValue(new Error("Hashing failed."));

        prismaMock.user.findUnique
        .mockResolvedValueOnce(expectedFindUser)
        .mockResolvedValue(null);

        prismaMock.role.findUnique.mockResolvedValue(expectedUpdateRole);

        prismaMock.user.update.mockRejectedValue(new Error('Database error.'));

        await expect(userService.updateUser(id, data)).rejects.toThrow('Hashing failed.');
    });

});