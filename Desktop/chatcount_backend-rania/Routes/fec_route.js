// fecRoute.js

import express from "express";
import {getFec, replaceFile, uploadFec} from "../Controllers/fec_controller.js"
import upload from "../middlewares/multer-fec.js";

const router = express.Router();

// Define the route handler for uploading CSV files
router.post("/uploadCsv", upload, uploadFec);
router.get("/getCsv",  getFec);
router.put('/fec/replace/:existingFecId',replaceFile);

export default router;
