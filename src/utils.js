import 'dotenv/config';
//----------------multer------------
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
console.log(path.join(__dirname, 'public/uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

//--------------------logger----------------
import winston from 'winston';
import ip from 'ip';
const { combine, printf, colorize } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

const myFormat = printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString(
    undefined,
    options
  )}] [${level}]: ${message}`;
});

const myFormatFile = printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString(
    undefined,
    options
  )}] [${level.toLocaleUpperCase()}]: ${message}`;
});

let logger;
switch (process.env.enviroment) {
  case 'DEVELOPMENT':
    logger = winston.createLogger({
      levels: logLevels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: combine(winston.format.colorize({ all: true }), myFormat),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, '../logs/dev.errors.log'),
          level: 'error',
          format: myFormatFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
    break;
  case 'PRODUCTION':
    logger = winston.createLogger({
      levels: logLevels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: combine(winston.format.colorize({ all: true }), myFormat),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, '../logs/errors.log'),
          level: 'error',
          format: myFormatFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
    break;
  default:
    break;
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  const ipClient = ip.address();
  req.logger.info(`${req.method} on ${req.url} on ${ipClient}`);
  next();
};

export { logger };

//---------mongoose---------

import { connect } from 'mongoose';
export async function connectMongo() {
  try {
    await connect(
      `mongodb+srv://${process.env.MONGO_USER}@coderdbatlas.ud2qdcy.mongodb.net/ecommerce`
    );
  } catch (e) {
    logger.error('Cannot connect to database');
  }
}

//----------------bcrypt------------------------------

import bcrypt from 'bcrypt';

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);

//----------------nodemailer --------------
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const enviarCorreo = (address, name) => {
  const result = transport.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to: address,
    subject: 'CODER Ecommerce - Registration succesful',
    html: `
              <div>
                  <h1>Bienvenido a CODER Ecomm</h1>
                  <p>Gracias por registrarte ${name}!!</p>
                  <p>Esperamos que encuentres lo que estas buscando!</p>
              </div>
              <div>
              <h4>Te saluda el equipo de CODER Ecomm</h4>
              </div>

          `,
  });
};
