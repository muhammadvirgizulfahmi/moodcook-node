import { Mood } from '../models/index.js';

export const findAll = async (_, res) => {
  const data = await Mood.findAll();
  res.json(data);
};

export const create = async (req, res) => {
  const mood = await Mood.create(req.body);
  res.status(201).json(mood);
};
