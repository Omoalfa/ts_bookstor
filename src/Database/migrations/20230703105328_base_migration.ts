import { ETables } from "../../types/db.types";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable(ETables.USER, (table) => {
      table.increments("id", { primaryKey: true });
      table.string("name", 255).notNullable();
      table.string("email").unique().index().notNullable();
      table.string("phone").unique();
      table.string("password");
      table.enum("gender", ["male", "female"]);
      table.string("verification_code");
      table.boolean("is_verified");
      table.string("password_otp");
      table.timestamp("deleted_at");
      table.timestamps(true, true);
    })
    .createTable(ETables.AUTHOR, (table) => {
      table.increments("id", { primaryKey: true });
      table.string("name").notNullable();
      table.enum("title", ["Mr.", "Mrs.", "Dr.", "Prof.", "Miss"]).notNullable();
      table.string("email").notNullable().unique();
    })
    .createTable(ETables.BOOK, (table) => {
      table.increments("id", { primaryKey: true })
      table.string("title").notNullable();
      table.string("description").nullable();
      table.integer("author_id").unsigned().notNullable();
      table.foreign("author_id").references("id").inTable(ETables.AUTHOR);
      table.timestamp("publish_date");
      table.timestamp("deleted_at");
      table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema
  .dropTableIfExists(ETables.USER)
  .dropTableIfExists(ETables.BOOK)
  .dropTableIfExists(ETables.AUTHOR);
}
