import { Request, Response } from "express";

export async function get_my_assets(_req: Request, res: Response) {
  res.send("running");
}
