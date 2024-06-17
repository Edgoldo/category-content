import { File } from 'buffer';
import { Request } from 'express';
import { UserDocument } from "../models/User";

export interface UserRequest extends Request {
    user: UserDocument,
    file?: any
}

export interface QueryRequest {
    page?: number,
    limit?: number,
    searchTerm?: string,
    category?: any
}

export interface QueryFilter {
    title?: object,
    category?: any
}

export interface FileRequest extends File {
    originalname: string
}