import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import userRoute from "./routes/users.js"
import hotelRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser"
import cors from "cors" // step 5 cors is a middleware that allows us to make requests from different domains

const app = express()
dotenv.config()


// step 2 mongodb
const connect = async () => {
try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to mongodb")
} catch (error) {
    throw error
}

};

mongoose.connection.on("disconnected", () => {
    console.log("mongodb disconnected")
})
//step 4 models schema
 
app.use(cors()) // this will allow us to make requests from different domains
// step 3 middleware are important because is a able to use our request and response before sending anything to the user
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoute) // this will use the auth route for all requests  
app.use("/api/user", userRoute)
app.use("/api/hotels", hotelRoute)
app.use("/api/rooms", roomsRoute)

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!"

    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack
    })
})
// step 1 list the app
app.listen(8800, () => {
    connect()
    console.log("Server is running on port 8800")

})