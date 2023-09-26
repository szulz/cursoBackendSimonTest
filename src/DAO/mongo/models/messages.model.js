import { Schema, model } from 'mongoose';

const validateUser = function (user) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(user);
};

const ChatSchema = new Schema(
  {
    user: {
      type: String,
      trim: true,
      lowercase: true,
      required: 'Email address is required',
      validate: [validateUser, 'Please fill a valid email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    msg: { type: String, required: true, max: 100, versionKey: false },
  },
  {
    versionKey: false,
  }
);

export const MessagesModel = model('messages', ChatSchema);
