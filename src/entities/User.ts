import { Credential } from "./Credential";
import { Role } from "./Role"

export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public role?: Role,
        public credentials?: Credential,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
    }
}