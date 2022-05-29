import * as express from 'express';
import { config } from 'dotenv';
import { urlencoded, json } from 'body-parser';
import { AppDataSource } from './data-source';
import { auth } from './middlwares/auth';
import { login, signup } from './controllers/user';
import { requestLogger, errorLogger } from './middlwares/logger';
import { handleError } from './errors/handleError';
import { WebSockets } from './websockets';
import { ServerError } from './errors/ServerError';

config();
const PORT = process.env.PORT || 3005;
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const expressServer = app.listen(PORT, () => console.log(`Server started on port ${PORT} :)`));

// WS server
WebSockets(expressServer);

// Database
AppDataSource.initialize()
  .then(() => console.log('connection to DB established'))
  .catch((err) => console.log(err));

// Request logger
app.use(requestLogger);

// Auth
app.post('/login', login);
app.post('/signup', signup);

app.use(auth);

// Errors logger
app.use(errorLogger);

// Errors handler
app.use(
  (err: ServerError, req: express.Request, res: express.Response, next: express.NextFunction) =>
    handleError({ err, req, res, next })
);
