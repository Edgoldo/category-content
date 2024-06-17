import { Request, Response, NextFunction } from 'express';
import { FileRequest } from '../@types';
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req: Request, file: FileRequest, cb: Function) => {
    cb(null, process.cwd()+"/uploads/");
  },
  filename: (req: Request, file: FileRequest, cb: Function) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
