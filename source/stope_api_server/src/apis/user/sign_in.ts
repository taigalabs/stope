import knex from "knex";
import { Request, Response } from "express";

export async function sign_in(req: Request, res: Response) {
  const { username, password } = req.body;

  console.log("username: %s, pw: %s", username, password);

  if (!username || !password) {
    return res.send({
      err: 'username, password not present'
    });
  }

  const { db } = res.app.locals;

  const row = await db('users').select('*').where({
    username,
    password,
  });

  console.log(22, row)

  res.send({
    ok: true,
  });
}
