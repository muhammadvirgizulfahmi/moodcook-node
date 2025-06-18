import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Mood = sequelize.define('Mood', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  slug: DataTypes.STRING,
  label: DataTypes.STRING,
});
