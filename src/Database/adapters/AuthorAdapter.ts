import { Service } from "typedi";
import knex, { BaseAdapter } from ".";
import { ETables, IAuthor } from "@/types/db.types";
import { ICreateAuthor, IUpdateAuthor } from "@/types/interface";

@Service()
class AuthorAdapter extends BaseAdapter {
  constructor () {
    super()
  }

  public DBcreateAuthor = async (data: ICreateAuthor): Promise<IAuthor> => {
    try {
      const [book] = await knex.insert(data).into(ETables.AUTHOR).returning("*");

      return book as IAuthor;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBUpdateAuthor = async (id: number, data: IUpdateAuthor): Promise<void> => {
    try {
      await knex.table(ETables.AUTHOR).update(data).where("id", id).onConflict().merge();
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBDeleteAuthor = async (id: number): Promise<void> => {
    try {
      await knex.table(ETables.AUTHOR).where("id", id).delete();
    } catch (error) {
      return this.catchError(error)
    }
  }

}

@Service()
export class AuthorValidatorAdapter extends BaseAdapter {
  constructor () {
    super()
  }

  public DAuthorIdExist = async (id: number): Promise<IAuthor> => {
    try {
      const book = await knex.select("*").from(ETables.AUTHOR).where("id", id).first<IAuthor>();

      return book;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DAuthorEmailExist = async (email: string): Promise<IAuthor> => {
    try {
      const book = await knex.select("*").from(ETables.AUTHOR).where("email", email).first<IAuthor>();

      return book;
    } catch (error) {
      return this.catchError(error);
    }
  }

}

export default AuthorAdapter;
