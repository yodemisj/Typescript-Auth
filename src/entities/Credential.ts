import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";


export class Credential {
    private _id: string;
    private _password: string;

    public constructor ( password: string, id?: string) {
        this._id = id ?? uuidv4();
        this._password = password;
    }

    public static async createCredential(password: string): Promise<Credential> {
        const hashedPassword = await Credential.hashPassword(password);
        return new Credential(hashedPassword);
    }

    public get id() {
        return this._id;
    }

    public get password() {
        return this._password;
    }

    public async updatePassword(value: string): Promise<void> {
        this._password = await Credential.hashPassword(value);
    }

    private static async hashPassword(password: string) {
        if(password.length < 3) {
            throw new Error("The password must have at least 3 characters.");
        } else if(password.length > 150) {
            throw new Error("The password must have a maximum of 150 characters.");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!hashedPassword || typeof hashedPassword !== "string") throw new Error("Failed to generate the password hash");
        return hashedPassword;
    }

}
