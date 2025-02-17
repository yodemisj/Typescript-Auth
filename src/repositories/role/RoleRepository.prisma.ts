import { PrismaClient } from "@prisma/client";
import { Role } from "../../entities/Role";
import { IRoleRepository } from "./IRoleRepository";


export class RoleRepositoryPrisma implements IRoleRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(role: Role): Promise<void> {  
        await this.prisma.role.create({
            data: {
                id: role.id,
                name: role.name,
            }
        });
    }

    async read(): Promise<Role[]> {
        const pRoles = await this.prisma.role.findMany();

        if (!pRoles.length) {
            return [];
        }

        const roles: Role[] = pRoles.map((role) => {
            const { id, name } = role;
            return new Role(name, id);
        })

        return roles;

    }

    async update(role: Role): Promise<void> {
        await this.prisma.role.update({
            where: { id: role.id },
            data: {
                name: role.name,
            }
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.role.delete({ where: { id } });
    }

    async find(id: string): Promise<Role | null> {
        const pRole = await this.prisma.role.findUnique({ where: { id } });

        if (!pRole) {
            return null;
        }

        const { name } = pRole;

        return new Role(name, id);
    }

    async findByName(name: string): Promise<Role | null> {
        const pRole = await this.prisma.role.findUnique({ where: { name } });

        if (!pRole) {
            return null;
        }

        const { id } = pRole;

        return new Role(name, id);
    }

}