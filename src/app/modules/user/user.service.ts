import { QueryBuilder } from './../../utils/queryBuilder';
import AppError from "../../errorHandler/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status'
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { setTokens } from "../../utils/setTokens";
import { userSearchableFields } from './user.constents';
import { deleteImageFromCLoudinary } from '../../config/cloudinary.config';




const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isExistUser = await User.findOne({ email })
    if (isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exist!')
    }
    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
    )
    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    }
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    const tokens = setTokens({
        id: user._id.toString(),
        role: user.role
    })
    return { user, tokens }
}


const getMe = async (userId: string) => {
    const user = await User.findById(userId).select('-password')
    return {
        data: user
    }
}


const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select('-password')
    return {
        data: user
    }
}


const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find().select('-password'), query)
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .pagination()
    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ])
    return { data, meta }
}


const updateMyProfile = async(userId:string, payload:Partial<IUser>):Promise<IUser> =>{
const user = await User.findById(userId)
if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "user doesn't exist.")
}
const allowedFields:(keyof IUser)[] = ['name','phone','address', 'bio', 'picture']
// delete old photo when upload new photo 
if(payload.picture && user.picture){
    await deleteImageFromCLoudinary(user.picture)
}
// updata allowedFields 
for(const field of allowedFields){
    if(payload[field] !== undefined) {
        user.set(field, payload[field])
    }
}
await user.save()
return user
}








export const userServices = {
    createUser,
    getMe,
    getSingleUser,
    getAllUsers,
    updateMyProfile
}