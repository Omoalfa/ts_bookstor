import { IAuthor, IBook } from "./db.types";

export type ICreateBook = Pick<IBook, "title" | "author_id" | "description" | "publish_date">
export type IUpdateBook = Partial<ICreateBook>
export type ICreateAuthor = Pick<IAuthor, "email" | "name" | "title">
export type IUpdateAuthor = Partial<ICreateAuthor>
