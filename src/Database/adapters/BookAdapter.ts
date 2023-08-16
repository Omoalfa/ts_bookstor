import { Service } from "typedi";
import knex, { BaseAdapter } from ".";
import { ICreateBook, IUpdateBook } from "@/types/interface";
import { ETables, IBook } from "@/types/db.types";

@Service()
class BookAdapter extends BaseAdapter {
  constructor () {
    super()
  }

  public DBcreateBook = async (data: ICreateBook): Promise<IBook> => {
    try {
      const [book] = await knex.insert(data).into(ETables.BOOK).returning("*");

      return book as IBook;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBUpdateBook = async (id: number, data: IUpdateBook): Promise<void> => {
    try {
      await knex.table(ETables.BOOK).update(data).where("id", id).onConflict().merge();
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBGetBookById = async (id: number): Promise<IBook> => {
    try {
      const raw_book = await knex.select([
        "b.id as id",
        "b.title as title",
        "b.description as description",
        "b.publish_date as publish_date",
        "b.created_at as created_at",
        "b.deleted_at as deleted_at",
        "b.updated_at as updated_at",
        "a.name as author_name",
        "a.email as author_email",
        "a.title as author_title",
        "a.id as author_id"
      ]).from({ b: ETables.BOOK }).leftJoin({ a: ETables.AUTHOR }, "a.id", "b.author_id").where("b.id", id).first();

      const book: IBook = {
        id: raw_book.id,
        title: raw_book.title,
        description: raw_book.description,
        publish_date: raw_book.publish_date,
        author: {
          id: raw_book.author_id,
          name: raw_book.author_name,
          email: raw_book.author_email,
          title: raw_book.author_title,
        }
      }

      return book;
    } catch (error) {
      return this.catchError(error);
    }
  }


  public DBGetBooks = async (data: {
    page: "next" | "prev",
    lastPageId?: number,
    pageRange?: [number, number],
    search: string,
    limit: number
  }): Promise<{ list: IBook[], total: number }> => {
    const { page, lastPageId = 0, pageRange, search = "", limit } = data;
    console.log(page);
    try {
      const query = knex.from({ b: ETables.BOOK });

      if (page === "prev") {
        query.whereBetween("id", pageRange).andWhereILike("title", `%${search}%`)
      } else {
        query.where("id", ">", lastPageId).andWhereILike("title", `%${search}%`);
      }

      const [total]: any[] = await query.clone().countDistinct("b.id")
      const books = await query.clone().select("*").limit(limit)

      return { list: books, total: Number(total.count) }
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBDeleteBook = async (id: number): Promise<void> => {
    try {
      await knex.table(ETables.BOOK).where("id", id).delete();
    } catch (error) {
      return this.catchError(error)
    }
  }

}

@Service()
export class BookValidatorAdapter extends BaseAdapter {
  constructor () {
    super()
  }

  public DBBookExist = async (id: number): Promise<IBook> => {
    try {
      const book = await knex.select("*").from(ETables.BOOK).where("id", id).first<IBook>();

      return book;
    } catch (error) {
      return this.catchError(error);
    }
  }
}

export default BookAdapter;
