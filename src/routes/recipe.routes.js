import { Router } from 'express';
import * as recipeCtrl from '../controllers/recipe.controller.js';
const router = Router();

router.get('/', recipeCtrl.findAll);
router.post('/', recipeCtrl.create);       // untuk admin
export default router;
