import { Router } from 'express';
import { UserFactory } from '../factories/UserFactory';

const router = Router();

const userController = UserFactory.getInstance();

router.post('/users', userController.create.bind(userController));
router.put('/users/:id', userController.update.bind(userController));
router.delete('/users/:id', userController.delete.bind(userController));
router.get('/users/:id', userController.find.bind(userController));
router.get('/users/email', userController.findByEmail.bind(userController));
router.get('/users', userController.findAll.bind(userController));

export default router;