import AppError from "../../errorHandler/AppError"
import { User } from "../user/user.model"
import httpStatus from "http-status"
import bcryptjs from "bcryptjs";
import { setTokens } from "../../utils/setTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";






interface loginPayload {
    email: string
    password: string
}


const loginUser = async (payload: loginPayload) => {
    const { email, password } = payload
    // check user exist 
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.NOT_EXTENDED, "User doesn't exist!")
    }
    // check user password 
    if (!user.password) {
        throw new AppError(httpStatus.NOT_FOUND, "Password did't set!")
    }
    // compare password 
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not valid!")
    }
    // check if user is active / verified
    if (!user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
    }
    // generate tokens
    const tokens = setTokens({
        id: user._id.toString(),
        role: user.role,
        email: user.email, // optional but useful for middleware
    });
    return { user, tokens };
}





const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    // user from token 
    const user = await User.findById(decodedToken.id)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User is not exist!")
    }
    // check old password match 
    const isOldPasswordMatch = await bcryptjs.compare(
        oldPassword,
        user.password as string
    )
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password is not matched!")
    }
    // save new password make hash 
    user.password = await bcryptjs.hash(
        newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )
    await user.save()
    return true
}




const forgetPassword = async (email: string, newPassword: string) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!")
    }
    user.password = await bcryptjs.hash(
        newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )
    await user.save()
    return true
}




export const authServices = {
    loginUser,
    changePassword,
    forgetPassword
}