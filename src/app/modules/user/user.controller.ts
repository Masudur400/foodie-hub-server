import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { setAuthCookie } from "../../utils/setCookies";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'





const createUser = catchAsync(async (req: Request, res: Response) => {
    const { user, tokens } = await userServices.createUser(req.body)
    setAuthCookie(res, tokens)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User created successfully.',
        data: {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }
    })
})









export const userControllers = {
    createUser,
}