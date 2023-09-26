import { Schema, model } from 'mongoose';

const schema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  age: { type: Number},
  password: { type: String, required: true, max: 100 },
  role: { type: String, required: true, default: 'user' },
  cart: { type: String},
});

export const UserSchema = model('users', schema);
