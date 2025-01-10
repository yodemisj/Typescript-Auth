import prisma from "../prisma";
import { UserRepository } from "../repositories/UserRepository";

export class UserFactory {
    static getInstance() {
        const userRepository = new UserRepository(prisma);
        return userRepository;       
    }
}