import knex, { Knex } from "knex";

export async function connectDB(): Promise<Knex> {
  try {
    const config: Knex.Config = {
      client: "pg",
      connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres',
      },
    };

    console.info("Connecting to db, config: %j", config);

    const db = knex(config);

    // Check connection
    await db.raw("select 1");

    return db;
  } catch (err) {
    console.error(err)
  }
}
