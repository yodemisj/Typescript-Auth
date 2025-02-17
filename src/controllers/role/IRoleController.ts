export interface IRequest {
    body: any;
    params: any;
}

export interface IResponse {
    status(code: number): this;
    json(body: any): this;
}

export interface IRoleController {
    create(req: IRequest, res: IResponse): Promise<IResponse | void>;
    update(req: IRequest, res: IResponse): Promise<IResponse | void>;
    delete(req: IRequest, res: IResponse): Promise<IResponse | void>;
    find(req: IRequest, res: IResponse): Promise<IResponse | void>;
    findByName(req: IRequest, res: IResponse): Promise<IResponse | void>;
    findAll(req: IRequest, res: IResponse): Promise<IResponse | void>;
}
