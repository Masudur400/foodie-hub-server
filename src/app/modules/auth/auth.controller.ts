import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookies";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";






const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    // login user 
    const result = await authServices.loginUser({ email, password })
    // set cookies 
    setAuthCookie(res, result.tokens)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successful.",
        data: {
            user: result.user,
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken
        }
    })
})



const logOutUser = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logout successful.",
        data: null
    })
})




const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body
    const decodedToken = req.user as JwtPayload   //check from middleware
    await authServices.changePassword(oldPassword, newPassword, decodedToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed.",
        data: null
    })
})




const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body
    await authServices.forgetPassword(email, newPassword)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password reset successful.",
        data: null
    })
})




export const authControllers = {
    loginUser,
    logOutUser,
    changePassword,
    forgetPassword
}