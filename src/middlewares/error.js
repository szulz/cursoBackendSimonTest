import errorsNum from '../errors/enum.js';
import { logger } from '../utils.js';

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
      case errorsNum.INVALID_TYPES_ERROR:
        logger.debug(`Invalid fields`, error.name, error.cause);
        res
          .status(400)
          .send({ status: 'Error', error: error.name, cause: error.cause });
        break;
      case errorsNum.DATABASE_ERROR:
        logger.warn(`Error connecting/retrieving from database `, error.name, error.cause);
        res
          .status(400)
          .send({ status: 'Error', error: error.name, cause: error.cause });
        break;
      case errorsNum.AUTHORIZATION_FAILED:
        logger.warn(`User not authorized `, error.name, error.cause);
        res
          .status(400)
          .send({ status: 'Error', error: error.name, cause: error.cause });
        break;
      default:
      res.send({ status: 'Error', error: 'Unhandled error' });
      break;
  }
};
