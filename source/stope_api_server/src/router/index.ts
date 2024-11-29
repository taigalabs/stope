import express from "express";

import { get_my_assets } from "@/apis/asset";
import { sign_in } from "@/apis/user/sign_in";

export const v0Router = express.Router({ mergeParams: true });

v0Router.post("/sign_in", sign_in);
v0Router.post("/get_my_assets", get_my_assets);
v0Router.post("/get_merkle_path", (req, res) => { });
