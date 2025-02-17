import { Router, Request, Response } from 'express';
import  userRouter from "./user"
import  roleRouter from "./role"

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello, Express with Typescript!');
});

router.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong');
});

router.use(userRouter);
router.use(roleRouter);

export default router;