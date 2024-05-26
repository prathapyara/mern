import { Product } from "../Models/ProductModel.js";
import { recordsPerPage } from "../config/pagination.js";
import { imageValidation } from "../utils/imageValidation.js";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//getproduct is more complex please take time to understand

export const getProdcuts = async (req, res, next) => {
    try {
        const pageNum = Number(req.query.pageNum) || 1;
        const priceFilter = Number(req.query.price) || Number.MAX_VALUE;
        let queryCondition = false;
        let ratingFilter = "";
        if (req.query.rating) {
            ratingFilter = req.query.rating.split(",");
        }

        let categoryFilter = "";
        if (req.query.category) {
            categoryFilter = req.query.category.split(",");
        }

        //as attrsfilter is bit complext so using mongodb query condtion to filter it
        let attrsFilter = [];
        if (req.query.attrs) {
            attrsFilter = req.query.attrs.split(",").reduce((acc, item) => {
                if (item) {
                    let a = item.split("-");
                    let values = [...a];
                    values.shift(); //removes the first item

                    let condition = {
                        $and: [
                            { "attrs.key": a[0] },
                           { "attrs.value": { $in: values } }
                        ]
                    };

                    acc.push(condition);

                    return acc;
                } else {
                    return acc;
                }
            }, []);
            queryCondition = true;
        }

        let queries = {};
        if (queryCondition) {
            queries = {
                $and: [
                    ...attrsFilter
                ]
            }
        }

        const categoryName = req.params.categoryName || "";
        const searchQuery = req.params.searchQuery || "";
        let categoryName2 = "";

        if (searchQuery) {
            categoryName2 = req.params.categoryName || ""
        }

        let sort = {};
        const sortOption = req.query.sortCondition || "";
        if (sortOption) {
            let sortOpt = sortOption.split("_");
            sort = { [sortOpt[0]]: Number(sortOpt[1]) };
        }

        const totalProducts = await Product.countDocuments({});
        const products = await Product.find(queryCondition ? queries : null).sort(sort).skip((pageNum - 1) * recordsPerPage).limit(recordsPerPage);
        const filteredProduct = products.filter((item) => {
            //for homepage and productspage search of products but this logic is used for both the routes of searchQuery
            if (searchQuery) {
                let a = categoryName2.replace(/,/g, "/");
                var regEx = new RegExp(a);
                return (regEx === "" ? true : regEx.test(item.category) && (searchQuery === "" || item.name.includes(searchQuery) || item.description.includes(searchQuery)) && (ratingFilter === "" ? true : ratingFilter.includes(item.rating.toString()))
                    && item.price < priceFilter);
            }

            //for homepage category search dropdown on left side of search
            if (categoryName) {
                let a = categoryName.replace(/,/g, "/");
                var regEx = new RegExp(a);
                return (regEx.test(item.category) && (ratingFilter === "" ? true : ratingFilter.includes(item.rating.toString()))
                    && item.price < priceFilter);
            }

            //for general purpose that mean when we do filtering from products pag
            return (
                (ratingFilter === "" ? true : ratingFilter.includes(item.rating.toString()))
                && item.price < priceFilter
                && (categoryFilter === "" ? true : categoryFilter.includes(item.category.toString()))
            );
        })

        res.json({ filteredProduct, pageNum, totalPages: Math.ceil(totalProducts / recordsPerPage) });
    } catch (err) {
        next(err);
    }
}

export const getProductById = async (req, res, next) => {

    try {

        const product = await Product.findById(req.params.id).populate("reviews").orFail();
        res.status(200).json({ product: product });

    } catch (err) {
        next(err);
    }
}

export const getBestSellers = async (req, res, next) => {

    try {
        
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: "$category", bestseller: { $first: "$$ROOT" } } },
            { $replaceWith: "$bestseller" },
            { $match: { sales: { $gte: 0 } } },
            { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
            { $limit: 3 }
        ]);

        res.json(products);

    } catch (err) {
        next(err);
    }
}

export const adminGetProducts = async (req, res, next) => {
    try {
        const adminProducts = await Product.find({}).sort({ category: 1 }).select("name price category").orFail();
        res.json(adminProducts);
    } catch (err) {
        next(err);
    }
}

export const adminDeleteProducts = async (req, res, next) => {
    try {

        const productExists = await Product.findOne({ _id: decodeURIComponent(req.params.id) }).orFail();
        await Product.deleteOne({ name: productExists.name }).orFail();
        res.send("Product Removed");

    } catch (err) {
        next(err)
    }
}

export const adminCreateProduct = async (req, res, next) => {
    try {
        const { name, description, count, price, category, attrs, images } = req.body

        const product = await Product.create({
            name,
            description,
            count,
            price,
            category,
            attrs,
            images
        });

        res.json({
            message: "Product got created",
            _id: product._id
        });

    } catch (err) {
        next(err);
    }
}

export const adminUpdateProdcuts = async (req, res, next) => {
    try {

        const productUpdateValues = req.body;

        await Product.updateOne({ _id: req.params.id }, productUpdateValues);
        res.json({ message: "Product got updated successfully" });

    } catch (err) {
        next(err);
    }
}

//here if we are using the cloudinary we can store the images in cloudinary rather than local storage

export const adminUploadImage = async (req, res, next) => {
    if (req.query.cloudinary === "true") {
        try {
            let product = await Product.findById(req.query.productId).orFail();
            product.images.push({ path: req.body.url });
            await product.save();
            return res.status(200).json("success");
        } catch (err) {
            next(err);
        }
    }

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded")
        }

        const validationResultImage = imageValidation(req.files.images);

        if (validationResultImage.error) {
            return res.status(400).send(validationResultImage.error);
        }

        let imageTable = [];
        if (Array.isArray(req.files.images)) {
            imageTable = req.files.images;
        } else {
            imageTable.push(req.files.images);
        }

        const uploadDirectory = path.resolve(__dirname, "../../client", "public", "images", "products");
        const product = await Product.findOne({ _id: req.query.productId });

        for (let image of imageTable) {
            var fileName = uuidv4() + path.extname(image.name);
            var uploadPath = uploadDirectory + "/" + fileName
            product.images.push({ path: "/images/products/" + fileName });
            image.mv(uploadPath)
                .then(() => {

                }).catch((error) => {
                    return res.status(500).send(error);
                })
        }
        await product.save();

        return res.status(200).send("Image uploaded sucessfully");

    } catch (err) {
        next(err);
    }
}

export const adminDeleteProductImage = async (req, res, next) => {

    const imagePath = decodeURIComponent(req.params.imagePath);
    if (req.query.cloudinary === "true") {
        try {
            await Product.findOneAndUpdate({ _id: req.params.productId }, { $pull: { images: { path: imagePath } } }).orFail();
        } catch (err) {
            next(err);
        }
        return ;
    }

    try {
        const pathName = path.resolve("../client/public") + imagePath;
        await fs.promises.unlink(pathName);
        await Product.findOneAndUpdate({ _id: req.params.productId }, { $pull: { images: { path: imagePath } } }).orFail();

        return res.end();

    } catch (err) {
        next(err);
    }
}