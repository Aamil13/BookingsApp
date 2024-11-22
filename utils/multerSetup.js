import multer from "multer";
import os from 'os';
//Multer Configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// export {upload}

// for vercel /tmp works
const tempDir = os.tmpdir()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Use system's temp directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename
  },
});

const upload = multer({ storage: storage });

export { upload };