import { User } from "../entities/User";

export interface IUserRepository {
    create(user: User): Promise<void>;
    read(): Promise<User[]>;
    update(user: User): Promise<void>;
    delete(id: number): Promise<User>;
    find(id: number): Promise<User>;
}