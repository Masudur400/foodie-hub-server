import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { setAuthCookie } from "../../utils/setCookies";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";
import { IUser } from "./user.interface";





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





const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const result = await userServices.getMe(decodedToken.id)
    if (!result.data) {
        throw new AppError(httpStatus.NOT_FOUND, "User does't exist!")
    }
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data,
    })
})





const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const result = await userServices.getSingleUser(id)
    if (!result.data) {
        throw new AppError(httpStatus.NOT_FOUND, "User does't exist!")
    }
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data: result.data,
    })
})



const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await userServices.getAllUsers(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});



const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!')
    }
    const payload: Partial<IUser> = { ...req.body }
    if (req.file?.path) {
        payload.picture = req.file.path
    }
    const updateUser = await userServices.updateMyProfile(userId, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Update successful!',
        data: updateUser
    })
})









export const userControllers = {
    createUser,
    getMe,
    getSingleUser,
    getAllUsers,
    updateMyProfile
}