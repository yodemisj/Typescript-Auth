import { Request, Response } from "express";
import { validate as isUuid } from "uuid";
import { IUserController } from "./IUserController";
import { IUserService } from "../../services/user/IUserService";
import { UserCreateDTO, UserUpdateDTO } from "../../types/user.types";

export class UserControllerExpress implements IUserController{
    constructor(
            private readonly userService: IUserService,
    ) {}

    async create(req: Request, res: Response) {
        const { name, email, password, roleId } = req.body;

        const userCreateDto = new UserCreateDTO(name, email, password, roleId);

        try {
            const user = await this.userService.createUser(userCreateDto);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, password, roleId } = req.body;

        if (!id) res.status(400).json({ error: "ID is required." });
    
        if (!isUuid(id)) res.status(400).json({ error: "Invalid ID format." });

        const userUpdateDto = new UserUpdateDTO(name, email, password, roleId);

        try {
            const updatedUser = await this.userService.updateUser(userUpdateDto, id);
            res.status(200).json(updatedUser);
        } catch(error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) res.status(400).json({ error: "ID is required." });
    
        if (!isUuid(id)) res.status(400).json({ error: "Invalid ID format." });
        
        try {
            const deletedUser = await this.userService.deleteUser(id);
            res.status(200).json(deletedUser);
        } catch(error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async find(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) res.status(400).json({ error: "ID is required." });
    
        if (!isUuid(id)) res.status(400).json({ error: "Invalid ID format." });

        try {
            const user = await this.userService.findUserById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message })
        }
    }

    async findByEmail(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) res.status(400).json({ error: "Email is required." });

        try {
            const user = await this.userService.findUserByEmail(email);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message })
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const users = await this.userService.findAllUsers();
            res.status(200).json(users);
        } catch(error) {
            res.status(500).json({ error: (error as Error).message })
        }
    }
}