import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
          },
          quantity: { type: Number, min: 1, default: 1 },
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

export const CartModel = model('cart', cartSchema);
