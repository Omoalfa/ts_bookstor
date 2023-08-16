import { Service } from "typedi";
import UserRouter from "./Users";
import { Router } from "express";
import { Routes } from "@/Interfaces/router";
import BookRouter from "./Books";

@Service()
class V1Router implements Routes {
  constructor(
    private readonly userRouter: UserRouter,
    private readonly bookRouter: BookRouter,
  ) {
    this.path = '/api';
    this.router = Router();

    this.initializerRoutes()
  }

  public path: string;
  public router: Router;

  private initializerRoutes = () => {
    // initializes the user routes
    this.router.use(this.userRouter.path, this.userRouter.router);
    this.router.use(this.bookRouter.path, this.bookRouter.router);
    // ... other routes follows
  }
}

export default V1Router;
