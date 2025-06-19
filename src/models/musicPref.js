// src/models/musicPref.js (Versi Final yang Benar)
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './user.js';

export const MusicPref = sequelize.define('MusicPref', {
  mood:  DataTypes.STRING,
  genre: DataTypes.STRING,
});

// DIUBAH: Definisikan foreign key secara eksplisit di sini
User.hasMany(MusicPref, { foreignKey: 'userId' });
MusicPref.belongsTo(User, { foreignKey: 'userId' });