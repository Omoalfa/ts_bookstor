import { ETables } from "../../types/db.types";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable(ETables.USER, (table) => {
    table.increments("id", { primaryKey: true });
    table.string("first_name", 255).notNullable();
    table.string("last_name",  255).notNullable();
    table.string("email").unique().index().notNullable();
    table.string("phone").unique();
    table.string("password");
    table.boolean("is_waiting");
    table.boolean("is_guest");
    table.boolean("is_admin");
    table.boolean("is_super_admin");
    table.string("password_otp");
    table.string("avatar");
    table.timestamp("deleted_at");
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(ETables.USER);
}
