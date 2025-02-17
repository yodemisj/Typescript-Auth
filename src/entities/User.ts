import { Credential } from "./Credential";
import { Role } from "./Role";
import { v4 as uuidv4 } from "uuid";

export class User {
    private _id: string;
    private _name!: string;
    private _email!: string;
    private _role?: Role;
    private _credentials?: Credential;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor( name: string, email: string, role?: Role, credentials?: Credential, id?: string, createdAt?: Date, updatedAt?: Date) {
        this._id = id ?? uuidv4();
        this.name = name;
        this.email = email;
        this._role = role;
        this._credentials = credentials;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }
    
    public get role(): Role | undefined {
        return this._role;
    }

    public get credentials(): Credential | undefined {
        return this._credentials;
    }

    public get createdAt(): Date{
        return this._createdAt;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }
    
    public set name(value: string) {
        if(value.length < 3) {
            throw new Error("The name must have at least 3 characters.");
        } else if(value.length > 150) {
            throw new Error("The name must have a maximum of 150 characters.");
        }
        this._name = value;
        this._updatedAt = new Date();
    }

    public set email(value: string) {
        if (!User.isValidEmail(value)) {
            throw new Error("Invalid email format.");
        } else if(value.length < 3) {
            throw new Error("The email must have at least 3 characters.");
        } else if(value.length > 150) {
            throw new Error("The email must have a maximum of 150 characters.");
        }
        this._email = value;
        this._updatedAt = new Date();
    }

    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public set role(value: Role | undefined) {
        this._role = value;
        this._updatedAt = new Date();
    }

    public set credentials(value: Credential | undefined) {
        this._credentials = value;
        this._updatedAt = new Date();
    }

}