import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Mood } from './mood.js';

export const Recipe = sequelize.define('Recipe', {
  title: DataTypes.STRING,
  taste: { type: DataTypes.STRING, allowNull: true },
  mood_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  ingredients: DataTypes.TEXT,
  steps: DataTypes.TEXT('long'),
  image_url: DataTypes.STRING,
  video_url: DataTypes.STRING,
});

Mood.hasMany(Recipe, { foreignKey: 'mood_id' });
Recipe.belongsTo(Mood, { foreignKey: 'mood_id' });
