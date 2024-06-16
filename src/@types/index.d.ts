import { Request } from "express";
import { UserDocument } from "../models/User";

export interface UserRequest extends Request {
    user: UserDocument
}