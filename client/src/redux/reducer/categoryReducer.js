import { category_list } from "../actions/caterogiesAction";
import { CATEGORY_LIST } from "../constant/constant";
import { SAVE_ATTR } from "../constant/constant";
import { INSERT_CATERGORY } from "../constant/constant";
import { DELETE_CATEGORY } from "../constant/constant";

export const categoryReducer=(state={categories:[]},action)=>{
    switch (action.type) {
        case CATEGORY_LIST:
            return {
                ...state,
                categories:action.payload,
            };
        
        case SAVE_ATTR:{
            return {
                ...state,
                categories:action.payload,
            }
        }

        case INSERT_CATERGORY:{
            return {
                ...state,
                categories:action.payload
            }
        }

        case DELETE_CATEGORY:{
            return {
                ...state,
                categories:action.payload
            }
        }

        default:
            return state;
    }
}
