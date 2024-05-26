import { Category } from "../Models/CategoryModel.js";

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ name: "asc" }).orFail();
        res.status(200).send(categories);

    } catch (err) {
        next(err);
    }
}

export const newCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!category) {
            res.status(400).send("Categroy input is required");
        }
        const categoryExists = await Category.findOne({ name: category });
        if (categoryExists) {
            res.status(400).send("category is already exits");
        } else {
            await Category.create({
                name: category,
            })
        }
        const categories = await Category.find({}).sort({ name: "asc" }).orFail();
        res.json(categories);

    } catch (err) {
        next(err);
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        if (req.params.category !== "choose category") {
            const categoryExists = await Category.findOne({
                name: decodeURIComponent(req.params.category)
            }).orFail();

            await Category.deleteOne({ name: categoryExists.name });
        }
        const categories = await Category.find({}).sort({ name: "asc" }).orFail();
        res.json(categories);
    } catch (error) {
        next(error);
    }
}

export const newAttributeCategory = async (req, res, next) => {
    const {key,val,categoryChoosen}=req.body
    if(!key || !val || !categoryChoosen){
        return res.status(400).send("All inputs are required");
    }
    try {
        const presentcategories = await Category.findOne({ name: categoryChoosen }).orFail();
        
        if(presentcategories.attrs.length>0){
            var keyDoesNotExistInDatabase=true;
            

            presentcategories.attrs.map((item,idx)=>{
                if(item.key===key){
                    keyDoesNotExistInDatabase=false;
                    var copyAttributeValues=[...presentcategories.attrs[idx].value];
                    copyAttributeValues.push(val);
                    const newAttributeValue=[...new Set(copyAttributeValues)];
                    presentcategories.attrs[idx].value=newAttributeValue;
                }
            })

            if(keyDoesNotExistInDatabase){
                
                const newAttribute = {
                    key: key,
                    value: [val],
                }
                presentcategories.attrs.push(newAttribute);
            }
        }else{
            const newAttribute = {
                key: key,
                value: [val],
            }
            presentcategories.attrs.push(newAttribute);
        }

        await presentcategories.save();
        let cat=await Category.find({}).sort({name:"asc"});
        res.status(200).json({"categories":cat});
    }
    catch (error) {
        next(error);
    }
}