import express, { Request, Response } from 'express'
import cors from 'cors' 
import cookieParser from 'cookie-parser' 
// import { envVars } from './app/config/env'
import notFound from './app/middlewares/notFound'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler' 
import { envVars } from './app/config/env'
import { router } from './app/routes'


const app = express() 
app.set("trust proxy", 1); 
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.FRONTEND_URL2,
      "http://localhost:3000",
      "https://events-activities.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

 
app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to Foodie Hub Server...!'
    })
})

app.use(globalErrorHandler)
app.use(notFound)



export default app