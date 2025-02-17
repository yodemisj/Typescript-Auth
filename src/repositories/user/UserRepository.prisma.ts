import { PrismaClient } from "@prisma/client";
import { User } from "../../entities/User";
import { IUserRepository } from "./IUserRepository";
import { UserCreateDTO, UserUpdateDTO } from "../../types/user.types";
import { Role } from "../../entities/Role";
import { Credential } from "../../entities/Credential";

export class UserRepositoryPrisma implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(user: User): Promise<void> {  
        if (!user.role?.id) throw new Error("Role ID is required");
        if (!user.credentials) throw new Error("Credentials are required");

        await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: { connect: { id: user.role.id } }, 
                credentials: { create: { id: user.credentials.id, password: user.credentials.password } }
            }
        });
    }

    async read(iCredentials: boolean = false, iRole: boolean = true): Promise<User[]> {
        const pUsers = await this.prisma.user.findMany({ include: { credentials: iCredentials, role: iRole } });

        if(!pUsers.length) {
            return [];
        }

        const users: User[] = pUsers.map((user) => {
            const { id, name, email, role: pRole, credentials: pCredentials, createdAt, updatedAt } = user;
            const role = pRole ?  new Role(pRole.name, pRole.id) : undefined;
            const credentials = pCredentials ?  new Credential(pCredentials.password, pCredentials.id) : undefined;
            return new User(name, email, role, credentials, id, createdAt, updatedAt);
        })

        return users;

    }

    async update(user: User): Promise<void> {
        if (!user.role?.id) throw new Error("Role ID is required");
        if (!user.credentials) throw new Error("Credentials are required");

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                email: user.email,
                role: { connect: { id: user.role.id } },
                credentials: { update: { password: user.credentials.password } }
            }
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }

    async find(id: string, iCredentials: boolean = false, iRole: boolean = true): Promise<User | null> {
        const pUser = await this.prisma.user.findUnique({ 
            where: { id }, 
            include: { 
                role: iRole, 
                credentials: iCredentials, 
            } 
        });

        if (!pUser) {
            return null;
        }

        const { name, email, role: pRole, credentials: pCredentials, createdAt, updatedAt } = pUser;
        const role = pRole ?  new Role(pRole.name, pRole.id) : undefined;
        const credentials = pCredentials ?  new Credential(pCredentials.password, pCredentials.id) : undefined;

        return new User(name, email, role , credentials, id, createdAt, updatedAt);
    }

    async findByEmail(email: string, iCredentials: boolean = false, iRole: boolean = true): Promise<User | null> {
        const pUser = await this.prisma.user.findUnique({ 
            where: { email }, 
            include: { 
                role: iRole, 
                credentials: iCredentials, 
            } 
        });

        if (!pUser) {
            return null;
        }

        const { id, name, role: pRole, credentials: pCredentials, createdAt, updatedAt } = pUser;
        const role = pRole ?  new Role(pRole.name, pRole.id) : undefined;
        const credentials = pCredentials ?  new Credential(pCredentials.password, pCredentials.id) : undefined;

        return new User(name, email, role, credentials, id, createdAt, updatedAt);
    }

}