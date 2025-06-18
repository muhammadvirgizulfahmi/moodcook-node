import { Recipe } from '../models/index.js';

export const findAll = async (_, res) => {
  const data = await Recipe.findAll();
  res.json(data);
};

export const create = async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.status(201).json(recipe);
};
