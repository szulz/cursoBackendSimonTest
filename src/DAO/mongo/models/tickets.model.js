import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    code: { type: String, required: true, max: 100 },
    purchase_datetime: { type: String, required: true, max: 100 },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const TicketsModel = model('tickets', schema);
