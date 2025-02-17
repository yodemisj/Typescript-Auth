import prisma from "../prisma";
import { UserControllerExpress } from "../controllers/user/UserController.express";
import { RoleRepositoryPrisma } from "../repositories/role/RoleRepository.prisma";
import { UserRepositoryPrisma } from "../repositories/user/UserRepository.prisma";
import { UserService } from "../services/user/UserService";

export class UserFactory {
    static getInstance() {
        const userRepository = new UserRepositoryPrisma(prisma);
        const roleRepository = new RoleRepositoryPrisma(prisma);
        const userService = new UserService(userRepository, roleRepository);
        const userController = new UserControllerExpress(userService);
        return userController;       
    }
}