import express from "express";

import { get_stope_user } from "#apis/stope_user.ts";
import { get_my_assets } from "#apis/assets/index.ts";

export const v0Router = express.Router({ mergeParams: true });

v0Router.get("/get_stope_user", get_stope_user);
v0Router.get("/get_my_assets", get_my_assets);
v0Router.get("/get_merkle_path", (req, res) => {});
