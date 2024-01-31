
import express from "express";
const app = express();
import path from "path";
import multer from 'multer';
const upload = multer();
import user_router from "../src/router/user.route.js";
import db from "./config/db.config.js";




app.use(upload.any());
app.use(express.json());
//  app.use(express.static(path.join(__dirname, 'public')));

app.use('/', user_router);

export default app;


