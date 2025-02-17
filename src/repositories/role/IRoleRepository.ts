import { Role } from "../../entities/Role";

export interface IRoleRepository {
    create(user: Role): Promise<void>;
    read(): Promise<Role[]>;
    update(user: Role): Promise<void>;
    delete(id: string): Promise<void>;
    find(id: string): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
}