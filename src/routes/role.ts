import { Router } from 'express';
import { RoleFactory } from '../factories/RoleFactory';

const router = Router();

const roleController = RoleFactory.getInstance();

router.post('/roles', roleController.create.bind(roleController));
router.put('/roles/:id', roleController.update.bind(roleController));
router.delete('/roles/:id', roleController.delete.bind(roleController));
router.get('/roles/:id', roleController.find.bind(roleController));
router.get('/roles/name', roleController.findByName.bind(roleController));
router.get('/roles', roleController.findAll.bind(roleController));

export default router;