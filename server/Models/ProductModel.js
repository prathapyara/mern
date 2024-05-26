import mongoose from "mongoose";
import { Review } from "./ReviewModel.js";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number
    },
    reviewsNumber: {
        type: Number
    },
    sales: {
        type: Number,
        default: 0,
    },
    attrs: [
        { key: { type: String }, value: { type: String } }
    ],
    images: [{
        path: {
            type: String,
            required: true,
        }
    }],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Review,
        }
    ]

}, {
    timestamps: true,
});

productSchema.index({name:"text",description:"text"},{name:"TextIndex"});
productSchema.index({"attrs.key":1,"attrs.value":1});

export const Product = mongoose.model("Product", productSchema);
