import { OrdersPageComponent } from "./components/OrdersPageComponent";
import axios from "axios";
export const AdminOrdersPage = () => {

    const fetchOrders = async () => {
        const { data } = await axios.get("/api/orders/admin");
        return data
    }

    return (
        <OrdersPageComponent fetchOrders={fetchOrders} />
    );
}
