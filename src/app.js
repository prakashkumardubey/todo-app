import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.route.js'
import taskRouter from './routes/task.route.js'
import tagRouter from './routes/tag.route.js'


//routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/task", taskRouter)
app.use("/api/v1/tag", tagRouter)


export {app};