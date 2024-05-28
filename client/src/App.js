import { Route, Routes, BrowserRouter } from "react-router-dom"
import { HomePage } from "./pages/Homepage.js";
import { CartPage } from "./pages/CartPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { UserCartDetails } from "./pages/user/UserCartDetailsPage.js";
import { UserOrderDetails } from "./pages/user/UserOrderDetailsPage.js";
import { UserOrdersPage } from "./pages/user/UserOrdersPage.js";
import { UserProfilePage } from "./pages/user/UserProfilePage.js";
import { ProtectedRoutesComponent } from "./components/ProtectedRoutesComponent.js";
import { AdminAnalyticsPage } from "./pages/admin/AdminAnalyticsPage.js";
import { AdminChatPage } from "./pages/admin/AdminChatPage.js";
import { AdminCreateProductPage } from "./pages/admin/AdminCreateProductPage.js";
import { AdminEditProductPage } from "./pages/admin/AdminEditProductPage.js";
import { AdminEditUserPage } from "./pages/admin/AdminEditUserPage.js";
import { AdminOrderDetailsPage } from "./pages/admin/AdminOrderDetailsPage.js";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage.js";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage.js";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage.js";
import { FooterComponent } from "./components/FooterComponet.js";
import { HeaderComponent } from "./components/HeaderComponent.js";
import { RouterWithUserChatComponent } from "./components/user/RouterWithUserChatComponent.js";
import ScrollToTopOnReload from "./utils/ScrollToTopReload.js";
import { LogoutPage } from "./pages/LogoutPage.js";
import dotevn from "dotenv";

dotevn.config();

function App() {

  return (
    <>
      <BrowserRouter>
        <ScrollToTopOnReload />
        <HeaderComponent />
        <Routes>
          <Route element=<RouterWithUserChatComponent />>
            <Route path="/" element=<HomePage /> />
            <Route path="/cart" element=<CartPage /> />
            <Route path="/login" element=<LoginPage /> />
            <Route path="/product-list" element=<ProductListPage /> />
            <Route path="/product-list/category/:categoryName" element=<ProductListPage /> />
            <Route path="/product-list/category/:categoryName/:pageNumParam" element=<ProductListPage /> />
            <Route path="/product-list/search/:searchQuery" element=<ProductListPage /> />
            <Route path="/product-list/search/:searchQuery/:pageNumParam" element=<ProductListPage /> />
            <Route path="/product-list/category/:categoryName/search/:searchQuery" element=<ProductListPage /> />
            <Route path="/product-list/category/:categoryName/search/:searchQuery/:pageNumParam" element=<ProductListPage /> />
            <Route path="/product-details" element=<ProductDetailsPage /> />
            <Route path="/product-details/:productId" element=<ProductDetailsPage /> />
            <Route path="/register" element=<RegisterPage /> />
            <Route path="/logout" element=<LogoutPage /> />
            <Route path="*" element=<h1>Page not found</h1> />

            <Route element=<ProtectedRoutesComponent /> >
              <Route path="/user/cart-details" element=<UserCartDetails /> />
              <Route path="/user/order-details/:id" element=<UserOrderDetails /> />
              <Route path="/user/my-orders" element=<UserOrdersPage /> />
              <Route path="/user" element=<UserProfilePage /> />
            </Route>
          </Route>

          <Route element=<ProtectedRoutesComponent />>
            <Route path="/admin/users" element=<AdminUsersPage /> />
            <Route path="/admin/edit-user/:id" element=<AdminEditUserPage /> />
            <Route path="/admin/products" element=<AdminProductsPage /> />
            <Route path="/admin/create-new-product" element=<AdminCreateProductPage /> />
            <Route path="/admin/edit-product/:id" element=<AdminEditProductPage /> />
            <Route path="/admin/order-details/:id" element=<AdminOrderDetailsPage /> />
            <Route path="/admin/chats" element=<AdminChatPage /> />
            <Route path="/admin/analytics" element=<AdminAnalyticsPage /> />
            <Route path="/admin/orders" element=<AdminOrdersPage /> />
          </Route>
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
