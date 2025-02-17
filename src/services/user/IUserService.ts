import { User } from "../../entities/User";
import { UserCreateDTO, UserUpdateDTO } from "../../types/user.types";

export interface IUserService {
    createUser(user: UserCreateDTO): Promise<void>;
    findAllUsers(credentials?: boolean, role?: boolean): Promise<User[]>;
    updateUser(user: UserUpdateDTO, id: string): Promise<void>;
    deleteUser(id: string): Promise<void>;
    findUserById(id: string, credentials?: boolean, role?: boolean): Promise<User>;
    findUserByEmail(email: string, credentials?: boolean, role?: boolean): Promise<User>;
}