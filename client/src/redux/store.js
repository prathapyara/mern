import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension"
import { cartReducer } from "./reducer/cartReducer.js";
import { userRegisterLoginReducer } from "./reducer/userRegisterLoginReducer.js";
import thunk from "redux-thunk";
import { categoryReducer } from "./reducer/categoryReducer.js";
import { chatReduer } from "./reducer/chatReducer.js";

const reducer = combineReducers({
    cart: cartReducer,
    user: userRegisterLoginReducer,
    categories: categoryReducer,
    chatBetweenClientAdmin:chatReduer,
})

const middleware = [thunk];

var INITIAL_STATE

const checkAndUpdateLocalStorage = () => {

    const userInfoLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : {}
    const cartItemsInLocalStorage = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    INITIAL_STATE = {
        cart: {
            cartItems: cartItemsInLocalStorage,
            itemsCount: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((quantity, item) => Number(item.quantity) + quantity, 0) : 0,
            cartSubTotal: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((sum, item) => Number(item.quantity) * Number(item.price) + sum, 0) : 0
            
        },
        user: { userInfo: userInfoLocalStorage }
    }
}

const localStorageUpdateInterval = setInterval(checkAndUpdateLocalStorage, 600000);

checkAndUpdateLocalStorage();


const store = createStore(reducer, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)));

export default store;







