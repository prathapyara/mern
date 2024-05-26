import bcrypt from "bcryptjs";
import mongoose from "mongoose"

const ObjectId=mongoose.Types.ObjectId;

export const userData=[
    {
        firstName:"Prathap",
        lastName:"Yara",
        emailAddress:"prathapyara@gmail.com",
        password:bcrypt.hashSync("prathap@123",10),
        isAdmin:true,
    },
    {
        firstName:"Mamatha",
        lastName:"Kusa",
        emailAddress:"mamathayara@gmail.com",
        password:bcrypt.hashSync("mamatha@123",10),
        isAdmin:true,
    },
    {
        _id:new ObjectId("65d09619ebb63743ed7f9a72"),
        firstName:"kiran",
        lastName:"Ponnala",
        emailAddress:"kiran@gmail.com",
        password:bcrypt.hashSync("kiran@123",10),
        isAdmin:false,
    },
    {
        firstName:"sukesh",
        lastName:"Yara",
        emailAddress:"sukesh@gmail.com",
        password:bcrypt.hashSync("sukesh@123",10),
        isAdmin:false,
    },
]