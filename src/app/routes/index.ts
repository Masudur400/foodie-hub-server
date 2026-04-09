import { Router } from "express";  
import { UserRoutes } from "../modules/user/user.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    }, 
    // {
    //     path: '/auth',
    //     route: AuthRoutes
    // },
    
    // {
    //     path: '/event',
    //     route: EventRoutes
    // },
    // {
    //     path: '/review',
    //     route: ReviewRoutes
    // },
    // {
    //     path: '/booking',
    //     route: BookingRoutes
    // },
    // {
    //     path: '/payment',
    //     route: PaymentRoutes
    // },
    // {
    //     path: '/state',
    //     route: StateRoutes
    // },
    // {
    //     path: '/contact',
    //     route: ContactRoutes
    // },
]





moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})