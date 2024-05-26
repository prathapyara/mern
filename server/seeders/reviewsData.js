import mongoose from "mongoose"
const ObjectId=mongoose.Types.ObjectId;

export const reviewsData=[
    {
        comment:"Product one is one most popular product which is used for the collection of elements",
        rating:3,
        user:{
            _id:new ObjectId(),
            name:"Prathap Yara"
        },
    },
    {
        comment:"Product one is one most popular product which is used for the collection of elements",
        rating:3,
        user:{
            _id:new ObjectId(),
            name:"Mamatha Yara"
        },
    },
    {
        comment:"Product one is one most popular product which is used for the collection of elements",
        rating:3,
        user:{
            _id:new ObjectId(),
            name:"Kiran Yara"
        },
    },
]
