import { User } from "../../entities/User";

export interface IUserRepository {
    create(user: User): Promise<void>;
    read(credentials?: boolean, role?: boolean): Promise<User[]>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    find(id: string, credentials?: boolean, role?: boolean): Promise<User | null>;
    findByEmail(email: string, credentials?: boolean, role?: boolean): Promise<User | null>;
}