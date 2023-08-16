import BookController from "@/Controller/Book";
import UserController from "@/Controller/User";
import { Routes } from "@/Interfaces/router";
import AuthMiddleware from "@/Middlewares/auth";
import BookValidator from "@/Validators/Book";
import UserValidations from "@/Validators/User";
import { Router } from "express";
import { Inject, Service } from "typedi";

@Service()
class BookRouter implements Routes {
  constructor (
    @Inject() private readonly bookValidator: BookValidator,
    @Inject() private readonly authMiddleware: AuthMiddleware,
    @Inject() private readonly bookController: BookController,
  ) {
    this.path = "/books";
    this.router = Router();

    this.initializeRoutes()
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.post("/", this.authMiddleware.isAuth, this.bookValidator.createBookValidator, this.bookController.createBook)
    this.router.patch("/:id", this.authMiddleware.isAuth, this.bookValidator.bookIdValidator, this.bookValidator.updateBookValidator, this.bookController.updateBook)
    this.router.get("/", this.bookValidator.getBooksValidator, this.bookController.getBooks);
    this.router.get("/:id", this.bookValidator.bookIdValidator, this.bookController.getBookById);
    this.router.delete("/:id", this.bookValidator.bookIdValidator, this.bookController.deleteBook);
  }
}

export default BookRouter;
