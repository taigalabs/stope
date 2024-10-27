import { Request, Response } from "express";

export async function sign_in(req: Request, res: Response) {
  const { username, password } = req.body;
  console.log("username: %s, pw: %s", username, password);

  res.send("running");
}
