import UserModal from "../modals/UserModal.js"
import { createError } from "../utils/error.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res,next)=>{

    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        const newuser = new UserModal({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        await newuser.save()
        return res.status(201).json({message:"Successfully Registered"})
    } catch (error) {
        return next(error)
    }
}


export const login =async(req,res,next)=>{
    // console.log(req.body);
    try {
        const user = await UserModal.findOne({username:req.body.username})
        if(!user) return next(createError(401, "No User Found"))

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if(!isPasswordCorrect) return next(createError(404,"Password or Username Incorrect"))

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET)

        const {password , isAdmin, ...otherDetails} = user._doc
        res.cookie("access_token",token,{httpOnly: true,}).status(200).json({otherDetails})
    } catch (error) {
        return next(error)
    }
}