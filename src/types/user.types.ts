export class UserCreateDTO {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public roleId: string,
    ) {}
}

export class UserUpdateDTO {
    constructor(
        public name?: string,
        public email?: string,
        public password?: string,
        public roleId?: string
    ) {}
}