import { Request, Response } from "express";
import { validate as isUuid } from "uuid";
import { IRoleController } from "./IRoleController";
import { IRoleService } from "../../services/role/IRoleService";
import { RoleCreateDTO, RoleUpdateDTO } from "../../types/role.types";

export class RoleControllerExpress implements IRoleController{
    constructor(
            private readonly roleService: IRoleService,
    ) {}

    async create(req: Request, res: Response) {
        const { name } = req.body;

        const roleCreateDto = new RoleCreateDTO(name);

        try {
            const role = await this.roleService.createRole(roleCreateDto);
            res.status(201).json(role);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;

        if (!id) res.status(400).json({ error: "ID is required." });
    
        if (!isUuid(id)) res.status(400).json({ error: "Invalid ID format." });

        const roleUpdateDto = new RoleUpdateDTO(name);

        try {
            const updatedRole = await this.roleService.updateRole(roleUpdateDto, id);
            res.status(200).json(updatedRole);
        } catch(error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) res.status(400).json({ error: "ID is required." });
    
        if (!isUuid(id)) res.status(400).json({ error: "Invalid ID format." });
        
        try {
            const deletedRole = await this.roleService.deleteRole(id);
            res.status(200).json(deletedRole);
        } catch(error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async find(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) res.status(400).json({ error: "ID is required." });
    
        if (!isUuid(id)) res.status(400).json({ error: "Invalid ID format." });

        try {
            const role = await this.roleService.findRoleById(id);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message })
        }
    }

    async findByName(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) res.status(400).json({ error: "Name is required." });

        try {
            const role = await this.roleService.findRoleByName(name);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message })
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const roles = await this.roleService.findAllRoles();
            res.status(200).json(roles);
        } catch(error) {
            res.status(500).json({ error: (error as Error).message })
        }
    }
}