// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import mongoose from "mongoose"
import {DB_NAME} from "./constants"
import connectDB from "./db";
// 2nd Approach 


dotenv.config({
    psth: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is runing at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MOGO DB CONNECTION FAILED !!", err);
})






//first approach -
/*
import express from "express"

const app = express()


;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=> {
            console.log("ERR:", error) ;
            throw error
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`app is listening on port ${process.env.PORT}`);
        })
    } catch(eroor){
        console.error("ERROR: ", error);
        throw err
    }
})()

connectDB()

*/