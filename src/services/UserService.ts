import { UserUpdateData } from "../types/user.types";
import prisma from '../prisma';
import bcrypt from "bcryptjs";

export class UserService {

    async createUser(name: string, email: string, password: string, roleId: string) {
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if(existingUser) throw new Error('Email already used.');

        const existingRoleId = await prisma.role.findUnique({
            where:{ id: roleId },
        });

        if(!existingRoleId) throw new Error('Role not found.');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user =  await prisma.user.create({
            data: {
                name,
                email,
                role: { connect: { id: roleId } },
                credentials: {
                    create: {
                        password: hashedPassword,
                    }
                }
            }
        })
        
        return user;
    }

    async updateUser( id: string, data: { name?: string, email?: string, password?: string, roleId?: string }) {
        const { name, email, password, roleId } = data;

        const existingUser = await this.findUserById(id);

        if(email && existingUser.email !== email) {
            const emailInUse = await prisma.user.findUnique({
                where: { email }
            })

            if(emailInUse) throw new Error('Email already used.');
        }

        if(roleId){
            const existingRoleId = await prisma.role.findUnique({
                where:{ id: roleId },
            });

            if(!existingRoleId) throw new Error('Role not found.');
        }

        const updateData: UserUpdateData = {}
        if(name) updateData.name = name;
        if(email) updateData.email = email;
        if(password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.credentials = { update: { password: hashedPassword } };
        }
        if(roleId) updateData.role = { connect: { id: roleId } }        
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        })

        return updatedUser;
    }

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: {
                id
            },
            include: { credentials: true }
        })
    }

    async findUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: { credentials: false, role: true }
        });

        if(!user) throw new Error('User not found.');

        return user;
    }

    async findAllUsers() {
        return await prisma.user.findMany({include: { credentials: false, role: true }});   
    }
}