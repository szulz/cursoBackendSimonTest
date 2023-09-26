import MongoStore from 'connect-mongo';
import 'dotenv/config';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { Server } from 'socket.io';
import { iniPassport } from './config/passport.config.js';
import errorHandler from './middlewares/error.js';
import { authRouter } from './routes/authRouter.js';
import cartRouter from './routes/cartRouter.js';
import chatRouter from './routes/chatRouter.js';
import loggerRouter from './routes/loggerRouter.js';
import mockRouter from './routes/mockRouter.js';
import productsRouter from './routes/productsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import { __dirname, addLogger, connectMongo, logger ,uploader} from './utils.js';
import ip from 'ip';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-Ui-Express';

const app = express();
const PORT = 8080;
const ipClient = ip.address();


connectMongo().then(() => {
  logger.info('Plugged Mongo')
});

app.use(addLogger);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGO_USER}@coderdbatlas.ud2qdcy.mongodb.net/ecommerce?retryWrites=true&w=majority`,
      ttl: 3660,
    }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Render carpeta public
app.use(express.static(path.join(__dirname , 'public')));

//Passport Login
iniPassport();

app.use(passport.initialize());
app.use(passport.session());

//doc Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Proyecto Ecomm",
      description: "Documentación Ecommerce",
    },
  },
  apis: [`${__dirname.replace(/\/[^/]*$/, '/')}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', authRouter);
app.use('/chat', chatRouter);
app.use('/current', viewsRouter);
app.use('/loggerTest', loggerRouter);
app.use('/mockingproducts', mockRouter);
app.use('/', viewsRouter);
app.use(errorHandler);

app.engine(
  'handlebars',
  exphbs.create({
    helpers: {
      gt: function (a, b) {
        return a > b;
      },
      lt: function (a, b) {
        return a < b;
      },
      add: function (a, b) {
        return a + b;
      },
    },
  }).engine
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Captura de cualquier ruta fuera de las definidas
app.get('*', async (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'No se encuentra implementada la ruta',
    data: {},
  });
});

// Servidor comun
const httpServer = app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`, __dirname);
});

// Servidor socket
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  logger.info(`New client connected to chat ${ipClient}`);
  socket.emit('msg_back_to_front', { msg: 'Cliente Conectado' });

  socket.on('Mensaje pusheado a BD', (data) => {
    socket.broadcast.emit('updateChat');
  });
});

export default app;
