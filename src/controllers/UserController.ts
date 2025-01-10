import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { error } from "console";

export class UserController{
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req: Request, res: Response) {
        const { name, email, password, roleId } = req.body;

        try {
            const user = await this.userService.createUser(name, email, password, roleId);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }

    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { data } = req.body;
        try {
            const updatedUser = await this.userService.updateUser(id, data);
            res.status(200).json(updatedUser);
        } catch(error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        
        try {
            const deletedUser = await this.userService.deleteUser(id);
            res.status(200).json(deletedUser);
        } catch(error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async find(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await this.userService.findUserById(id);
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