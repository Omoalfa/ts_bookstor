import { Service } from "typedi";
import knex, { BaseAdapter } from ".";
import { ETables } from "@/types/db.types";
import { logger } from "@/Logger";

@Service()
class UserAdapter extends BaseAdapter {
  constructor () {
    super()
  }

  public DBJoinWaitingList = async (data: { email: string, nickname: string }) => {
    try {
      const user = await knex.table(ETables.WAITLIST).insert({ ...data, is_waiting: true }).returning('*')

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBGetUserAndPassword = async (email: string) => {
    try {
      const user = await knex.select(["email", "id"]).from(ETables.USER).where("email", email).first();

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBCreateUser = async (data) => {
    try {
      const [user] = await knex.table(ETables.USER).insert(data).returning("*");

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBUpdateUser = async (email: string, data): Promise<void> => {
    try {
      const user = await knex.table(ETables.USER).update(data).where("email", email).onConflict().merge();
    } catch (error) {
      return this.catchError(error);
    }
  }
}

@Service()
export class UserValidatorAdapter extends BaseAdapter {
  constructor () {
    super();
  }
  public DBIsEmailPresentInWailist = async (email: string) => {
    try {
      const user = await knex.select("*").from(ETables.WAITLIST).where("email", email).first();

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBGetUserAndPassword = async (email: string) => {
    try {
      const user = await knex.select(["email", "password"]).from(ETables.USER).where("email", email).first()

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBCheckSignupEmail = async (email: string) => {
    try {
      const user = await knex.select("*").from(ETables.USER).where("email", email).first()

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBValidaterPasswordResetPin = async (email: string, pin: string): Promise<any> => {
    try {
      const user = await knex.select(["email", "updated_at"]).from(ETables.USER).where("email", email).andWhere("password_otp", pin).first()

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBValidaterEmailVerificationCode = async (email: string, code: string): Promise<any> => {
    try {
      const user = await knex.select(["email", "updated_at"]).from(ETables.USER).where("email", email).andWhere("verification_code", code).first();

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }
}

export default UserAdapter;
