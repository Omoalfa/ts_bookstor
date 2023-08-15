import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT } from '@/Config';
import { logger, stream } from '@/Logger/index';
import V1Router from '@/Routes/v1';
import Container, { Service } from 'typedi';

@Service()
class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(
    private readonly v1Router: V1Router
  ) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes = () => {
    this.app.use(this.v1Router.path, this.v1Router.router);
  }
}


const instance = Container.get(App);

instance.listen();

const app = instance.getServer()

export default app;
