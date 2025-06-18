// src/models/musicPref.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './user.js';

export const MusicPref = sequelize.define('MusicPref', {
  mood:  DataTypes.STRING,
  genre: DataTypes.STRING,        // mellow, upbeat, dsb.
});
User.hasMany(MusicPref);
MusicPref.belongsTo(User);
