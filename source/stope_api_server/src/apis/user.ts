import knex, { Knex } from "knex";
import { Request, Response } from "express";

export async function sign_in(req: Request, res: Response) {
  const { username, password } = req.body;

  console.log("username: %s, pw: %s", username, password);

  if (!username || !password) {
    return res.send({
      err: "username, password not present",
    });
  }

  const db = res.app.locals.db as Knex;

  const rows = await db("users").select("*").where({
    username,
    password,
  });

  if (rows.length) {
    return res.send({
      ok: true,
    });
  } else {
    return res.send({
      err: "no row with username",
    });
  }
}
