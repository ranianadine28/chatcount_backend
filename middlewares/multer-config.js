import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/gif': 'gif',
}

export default multer({
    storage: diskStorage({
        destination: (req, file, callback) => {
            const _dirname = dirname(fileURLToPath(import.meta.url));
            callback(null, join(_dirname, "../public/images"));
        },
        filename: (req, file, callback) =>
            callback(null, `${Date.now()}.${MIME_TYPES[file.mimetype]}`)
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).single("avatar");