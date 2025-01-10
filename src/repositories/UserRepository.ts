import { PrismaClient } from "@prisma/client";
import { User } from "../entities/User";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(user: User): Promise<void> {  
        await this.prisma.user.create({ data: user})
    }

    async read(): Promise<User[]> {
        return await this.prisma.user.findMany({ include: { role: true } });
    }

    async update(user: User): Promise<void> {
        
    }

    async delete(id: number): Promise<User> {
        
    }

    async find(id: number): Promise<User> {
        
    }

}