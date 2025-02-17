import { RoleControllerExpress } from "../controllers/role/RoleController.express";
import prisma from "../prisma";
import { RoleRepositoryPrisma } from "../repositories/role/RoleRepository.prisma";
import { RoleService } from "../services/role/RoleService";

export class RoleFactory {
    static getInstance() {
        const roleRepository = new RoleRepositoryPrisma(prisma);
        const roleService = new RoleService(roleRepository);
        const roleController = new RoleControllerExpress(roleService);
        return roleController;       
    }
}