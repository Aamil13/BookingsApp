import jwt from "jsonwebtoken";
import { createError } from "./error.js";


export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
        // console.log("tokenenter",token);
    if(!token){
        // console.log("no token");
        return res.send(createError(401,"You are not authenticated"))
    } 
        
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.send(createError(403,"Token is not valid"));

        req.user = user;
        // console.log("res",req.user);
        next()
    })
}

export const verifyUser = (req,res,next)=>{
    // console.log(req.params.id);cls
    verifyToken(req,res, ()=>{
        // console.log("user",req.user.id);
        if(req.user.id === req.params.id || req.user.isAdmin){
            // console.log("aaa");
            next()
        }else{
             return next(createError(403,"You are not authorized"));

        }
    })
}

export const verifyAdmin = (req,res,next)=>{
    verifyToken(req,res,next, ()=>{
        if(req.user.isAdmin){
            // console.log("verr");
            next()
        }else{
            return next(createError(403,"You are not Admin"));

        }
    })
}