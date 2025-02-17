import { UserCreateDTO, UserUpdateDTO } from "../../types/user.types";
import { User } from "../../entities/User";
import { Credential } from "../../entities/Credential";
import { IUserService } from "./IUserService";
import { IRoleRepository } from "../../repositories/role/IRoleRepository";
import { IUserRepository } from "../../repositories/user/IUserRepository";

export class UserService implements IUserService{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly roleRepository: IRoleRepository 
    ) {}

    async createUser(userDto: UserCreateDTO) {
        const emailInUse = await this.userRepository.findByEmail(userDto.email);
        if(emailInUse) throw new Error('Email already used.');

        const role = await this.roleRepository.find(userDto.roleId);
        if (!role) throw new Error("Role not found."); 

        const credentials = await Credential.createCredential(userDto.password);

        const user = new User(userDto.name, userDto.email, role, credentials);
        await this.userRepository.create(user);
    }

    async updateUser( userDto: UserUpdateDTO, id: string) {
        const { name, email, password, roleId } = userDto;

        const existingUser = await this.userRepository.find(id);

        if(!existingUser) throw new Error("User not found.");

        if(email && existingUser.email !== email) {
            const emailInUse = await this.userRepository.findByEmail(email);
            if(emailInUse) throw new Error('Email already used.');
        };

        if(roleId){
            const existingRoleId = await this.roleRepository.find(roleId);

            if(!existingRoleId) throw new Error('Role not found.');
        };

        if(name) existingUser.name = name;
        if(email) existingUser.email = email;
        if(password) existingUser?.credentials?.updatePassword(password);    
        
        await this.userRepository.update(existingUser);
    }

    async deleteUser(id: string) {
        return await this.userRepository.delete(id);
    }

    async findUserById(id: string, credentials: boolean = false, role: boolean = true) {
        const user = await this.userRepository.find(id, credentials, role);

        if(!user) throw new Error('User not found.');

        return user;
    }

    async findUserByEmail(email: string, credentials: boolean = false, role: boolean = true) {
        const user = await this.userRepository.findByEmail(email, credentials, role);
        if(!user) throw new Error('User not found.');

        return user;
    }

    async findAllUsers(credentials: boolean = false, role: boolean = true) {
        return await this.userRepository.read(credentials, role);   
    }
}