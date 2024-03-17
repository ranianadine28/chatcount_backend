// multerConfig.js

import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
// Define the Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const _dirname = dirname(fileURLToPath(import.meta.url));
    callback(null, join(_dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

// Configure Multer with the storage settings
export default multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit the file size to 1 MB
  fileFilter: (req, file, cb) => {
    // Filter files by extension
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error("Le fichier doit être au format CSV"));
    }
    cb(null, true);
  },
}).single("csvFile");
