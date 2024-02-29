import express from "express";
import {body} from 'express-validator';
import { uploadFec } from "../Controllers/fec_controller.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' });

const router = express.Router();


router.route("/upload-csv").post(upload.single('csvFile'),uploadFec);

export default router;