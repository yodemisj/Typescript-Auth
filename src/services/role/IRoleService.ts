import { Role } from "../../entities/Role";
import { RoleCreateDTO, RoleUpdateDTO } from "../../types/role.types";

export interface IRoleService {
    createRole(role: RoleCreateDTO): Promise<void>;
    findAllRoles(): Promise<Role[]>;
    updateRole(role: RoleUpdateDTO, id: string): Promise<void>;
    deleteRole(id: string): Promise<void>;
    findRoleById(id: string): Promise<Role>;
    findRoleByName(name: string): Promise<Role>;
}