import axios from "axios";
import { ProductListPageComponent } from "./components/ProductListPageComponent";
import { useSelector } from "react-redux";

export const ProductListPage = () => {

    let filterUrl ="";

    const proceedFilters = (filters) => {
       
        let filterUrl = "";
    
        Object.keys(filters).forEach((key) => {
            if (key === "price") {
                filterUrl += `&price=${filters[key]}`;
                
            } else if (key === "rating" && filters[key]) {
                let selectedRating = Object.entries(filters[key])
                    .filter(([key, value]) => value)
                    .map(([key]) => key)
                    .join(',');
                if (selectedRating) {
                    filterUrl += `&rating=${selectedRating}`;
                    
                }
            } else if (key === "category" && filters[key]) {
                let selectedCategory = Object.entries(filters[key])
                    .filter(([key, value]) => value)
                    .map(([key]) => key)
                    .join(',');
                if (selectedCategory) {
                    filterUrl += `&category=${selectedCategory}`;
                 
                }
            } else if (key === "attrs" && filters[key]) {
                let selectedAttrs = filters[key].map((item) => {
                    let selectedKey = item.key + "-" + item.value.join('-');
                    return selectedKey;
                }).join(',');
                if (selectedAttrs) {
                    filterUrl += `&attrs=${selectedAttrs}`;
                  
                }
            }
        });
    
        // Clean up the trailing commas from the final filterUrl
        return filterUrl;
    }
    
    // Example filters object
   

    const getProducts = async (categoryName = "", pageNumParam = null, searchQuery = "", filters = {}, sortOption = "") => {
        //filterUrl=`&price=${filters.price}&rating=${filters.rating}`
        const category = categoryName ? `category/${categoryName}` : "";
        const search = searchQuery ? `/search/${searchQuery}` : "";
        
        filterUrl = proceedFilters(filters);
        const url = `/api/products/${category}${search}?pageNum=${pageNumParam}${filterUrl}&sortCondition=${sortOption}`;  
        const { data } = await axios.get(url);
        return data;
    }

    const { categories } = useSelector((state) => state.categories);

    return (
        <ProductListPageComponent getProducts={getProducts} categories={categories} />
    )
}