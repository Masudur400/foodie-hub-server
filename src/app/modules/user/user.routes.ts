import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface"; 





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

router.get('/:id',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    userControllers.getSingleUser
)




export const UserRoutes = router