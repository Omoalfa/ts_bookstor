import { Service } from "typedi";
import BaseController from "..";
import BookAdapter from "@/Database/adapters/BookAdapter";
import AuthorAdapter from "@/Database/adapters/AuthorAdapter";
import { IBook } from "@/types/db.types";
import { Request, Response } from "express";
import { created, success, successAction, successPaginated } from "@/Utils/api_response";
import { generatePageTag, getLastEndId, getPreviousPageRang } from "@/Utils/pagination";

@Service()
class BookController extends BaseController {
  constructor (
    private readonly bookAdapter: BookAdapter,
    private readonly authorAdapter: AuthorAdapter,
  ) {
    super()
  }

  public createBook = async (req: Request, res: Response) => {
    const { title, description, publish_date, author_id, author_name, author_title, author_email } = req.body;

    try {
      let book: IBook;
      if (author_id > 0) {
        book = await this.bookAdapter.DBcreateBook({
          title, author_id, publish_date, description
        });
      } else {
        const author = await this.authorAdapter.DBcreateAuthor({
          name: author_name, email: author_email, title: author_title
        })

        book = await this.bookAdapter.DBcreateBook({
          title, author_id: author.id, publish_date, description
        })
      }

      return created(res, book, "Book created successfully");
    } catch (error) {
      return this.catchError(res, error);
    }
  }

  public updateBook = async (req: Request, res: Response) => {
    const { title, description, publish_date, author_id } = req.body;
    const { id } = req.params;

    try {
      await this.bookAdapter.DBUpdateBook(Number(id), {
        ...(title && { title }),
        ...(description && { description }),
        ...(publish_date && { publish_date }),
        ...(author_id && { author_id }),
      })

      return successAction(res);
    } catch (error) {
      return this.catchError(res, error);
    }
  }

  public getBookById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const book = await this.bookAdapter.DBGetBookById(Number(id));

      return success(res, book);
    } catch (error) {
      return this.catchError(res, error);
    }
  }

  public getBooks = async (req: Request, res: Response) => {
    const { search, pt, page = "next", limit = 20 } = req.query as unknown as {
      search: string, pt: string, page: "next" | "prev", limit: number
    }

    try {
      let lastPageId: number = 0;
      let pageRange: [number, number];
      let total: number;
      let list: IBook[];

      if (page === "prev") {
        pageRange = getPreviousPageRang(pt);

        const resp = await this.bookAdapter.DBGetBooks({
          pageRange, page, limit, search
        })

        total = resp.total;
        list = resp.list;
      } else {
        if (pt) {
          lastPageId = getLastEndId(pt);
        }

        const resp = await this.bookAdapter.DBGetBooks({
          lastPageId, page, limit, search
        })

        total = resp.total;
        list = resp.list;
      }

      let pageTag = pt;

      if (list.length > 0) {
        pageRange = [list[0].id, list[list.length - 1].id]
        pageTag = generatePageTag(pageRange, page, pt);
      } 

      return successPaginated(res, { limit, list, pageTag, total})
    } catch (error) {
      return this.catchError(res, error);
    }
  }

  public deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.bookAdapter.DBDeleteBook(Number(id));

      return successAction(res, "Book deleted successfully")
    } catch (error) {
      return this.catchError(res, error);
    }
  }
}

export default BookController;
