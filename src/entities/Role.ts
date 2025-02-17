import { v4 as uuidv4 } from "uuid";

export class Role {
    private _id: string;
    private _name!: string;

    constructor( name: string, id?: string ) {
        this._id = id ?? uuidv4();
        this.name = name;
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public set name(value: string) {
        if(value.length < 3) {
            throw new Error("The name must have at least 3 characters.");
        } else if(value.length > 150) {
            throw new Error("The name must have a maximum of 150 characters.");
        }
        this._name = value;
    }
}
