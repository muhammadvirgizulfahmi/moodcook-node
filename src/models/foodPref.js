// src/models/foodPref.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './user.js';

export const FoodPref = sequelize.define('FoodPref', {
  mood:   DataTypes.STRING,       // angry, sad, happy, bored
  taste:  DataTypes.STRING,       // pedas, manis, dll.
});
User.hasMany(FoodPref);  // FK userId
FoodPref.belongsTo(User);
