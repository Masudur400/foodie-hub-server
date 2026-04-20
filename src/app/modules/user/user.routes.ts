import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";





const router = Router()


router.post('/register',
    validateRequest(createUserZodSchema),
    userControllers.createUser
)

router.get('/me',
    checkAuth(...Object.values(Role)),
    userControllers.getMe
)

router.get('/all-users',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getAllUsers)

router.patch('/update-profile',
    checkAuth(...Object.values(Role)),
    multerUpload.single('file'),
    validateRequest(updateUserZodSchema), //optional
    userControllers.updateMyProfile
)

router.get('/:id',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    userControllers.getSingleUser
)

router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(updateUserZodSchema),
    userControllers.updateUserByAdmin
)



export const UserRoutes = router