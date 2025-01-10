import { Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello, Express with Typescript!');
});

router.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong');
});

export default router;