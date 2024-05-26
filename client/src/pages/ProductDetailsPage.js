import axios from "axios"
import { ProductsDetailsPageComponent } from "./components/ProductsDetailsPageComponent"
import { useParams } from "react-router-dom"
import { useDispatch} from "react-redux";
import { add_to_cart } from "../redux/actions/cartActions.js";

export const ProductDetailsPage = () => {

  const dispatch = useDispatch();

  const { productId } = useParams();
  const fetchProduct = async () => {
    const { data } = await axios.get("/api/products/get-one/" + productId);
    return data;
  }

  const postReview=async(formInputs)=>{
    const {data}=await axios.post("/api/users/review/"+productId,formInputs);
    return data;
  }

  return (
    <>
      <ProductsDetailsPageComponent fetchProduct={fetchProduct} dispatch={dispatch} addToCartReduxAction={add_to_cart} postReview={postReview} />
    </>
  )
}