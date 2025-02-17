import { IRoleRepository } from "../../repositories/role/IRoleRepository";
import { IRoleService } from "./IRoleService";
import { Role } from "../../entities/Role";
import { RoleCreateDTO, RoleUpdateDTO } from "../../types/role.types";

export class RoleService implements IRoleService{
    constructor(
        private readonly roleRepository: IRoleRepository 
    ) {}

    async createRole(roleDto: RoleCreateDTO) {
        const existingRole = await this.roleRepository.findByName(roleDto.name);
        if(existingRole) throw new Error('Name already used.');

        const role = new Role(roleDto.name);
        await this.roleRepository.create(role);
    }

    async updateRole(roleDto: RoleUpdateDTO, id: string) {
        const { name } = roleDto;

        const existingRole = await this.roleRepository.find(id);

        if(!existingRole) throw new Error("Role not found.");

        const existingName = await this.roleRepository.findByName(roleDto.name);
        if(existingName) throw new Error('Name already used.');

        existingRole.name = name;
        
        await this.roleRepository.update(existingRole);
    }

    async deleteRole(id: string) {
        return await this.roleRepository.delete(id);
    }

    async findRoleById(id: string) {
        const role = await this.roleRepository.find(id);

        if(!role) throw new Error('Role not found.');

        return role;
    }

    async findRoleByName(name: string) {
        const role = await this.roleRepository.find(name);

        if(!role) throw new Error('Role not found.');

        return role;
    }

    async findAllRoles() {
        return await this.roleRepository.read();   
    }
}