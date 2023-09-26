import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema(
  {
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    code: { type: Number, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, max: 100 },
    thumbnail: { type: String },
  },
  {
    versionKey: false, // Esto deshabilita la inclusión de __v en los documentos
  }
);

schema.plugin(mongoosePaginate);

export const ProductsModel = model('products', schema);
