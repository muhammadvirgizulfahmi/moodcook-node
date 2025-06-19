// src/models/foodPref.js (Versi Final yang Diperbaiki)
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './user.js';

export const FoodPref = sequelize.define('FoodPref', {
  mood:  DataTypes.STRING,
  taste: DataTypes.STRING,
  // Kita tidak perlu mendefinisikan userId di sini, asosiasi di bawah sudah cukup
  // Namun, untuk memastikan, kita akan menggunakan foreignKey di asosiasi
});

// Definisikan asosiasi secara eksplisit dengan foreignKey
User.hasMany(FoodPref, { foreignKey: 'userId' });
FoodPref.belongsTo(User, { foreignKey: 'userId' });