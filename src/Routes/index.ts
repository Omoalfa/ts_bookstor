import { Service } from "typedi";
import UserRouter from "./v1/User";
import { Router } from "express";
import { Routes } from "@/Interfaces/router";

@Service()
class V1Router implements Routes {
  constructor(
    private readonly userRouter: UserRouter,
  ) {
    this.path = '/api/v1';
    this.router = Router();

    this.initializerRoutes()
  }

  public path: string;
  public router: Router;

  private initializerRoutes = () => {
    // initializes the user routes
    this.router.use(this.userRouter.path, this.userRouter.router);
    // ... other routes follows
  }
}

export default V1Router;
