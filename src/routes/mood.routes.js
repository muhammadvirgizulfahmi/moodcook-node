import { Router } from 'express';
import * as moodCtrl from '../controllers/mood.controller.js';
const router = Router();

router.get('/', moodCtrl.findAll);
router.post('/', moodCtrl.create);       // untuk admin
export default router;
