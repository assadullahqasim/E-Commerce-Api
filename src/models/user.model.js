import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
            trim: true
        },
        username:{
            type: String,
            required: true,
            trim: true
        },

        email:{
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        password:{
            type: String,
            required: true,
            minlength: 6
        },
        role:{
            type: String,
            enum: ["customer","admin"],
            default: "customer"
        },
    },
    {
        timestamps: true
    }
)

//*---> bcrypt password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.comparePassword = async function(inputPassword){
    return await bcrypt.compare(inputPassword,this.password)
}

//*---> generate json web token

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {_id:this._id},
        process.env.JWT_TOKEN_SECRET,
        {expiresIn:process.env.JWT_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User",userSchema)