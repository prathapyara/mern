import { ProductPageComponent } from "./components/ProdutPageComponent.js";
import axios from "axios";

export const AdminProductsPage = () => {

    const fetchProducts = async () => {
        const { data } = await axios.get("/api/products/admin");
        return data
    }

    const deleteProduct = async (productId) => {
        const { data } = await axios.delete(`/api/products/admin/${productId}`);
        return data
    }

    return (
        <ProductPageComponent fetchProducts={fetchProducts} deleteProduct={deleteProduct} />
    )
}

