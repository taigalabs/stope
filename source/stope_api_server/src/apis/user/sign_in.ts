import { Request, Response } from "express";

export async function sign_in(_req: Request, res: Response) {
  res.send("running");
}
