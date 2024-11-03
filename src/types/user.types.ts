type PasswordUpdateRequest = {
    update: {
        password: string
    }
}

type RoleConnection = {
    connect: {
        id: string
    }
}

export type UserUpdateData = {
    name?: string,
    email?: string,
    credentials?: PasswordUpdateRequest,
    role?: RoleConnection
}