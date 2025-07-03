// import { combineReducers } from "redux";
import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import chatReducer  from "./Reducers/chatReducer";
import  productReducer  from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import  OrderReducer  from "./Reducers/OrderReducer";
import PaymentReducer from "./Reducers/PaymentReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import bannerReducer from "./Reducers/bannerReducer";
// import { salesReportReducer } from "./Reducers/salesReportReducer";
import salesReportReducer from './Reducers/salesReportReducer';
import sellerReportReducer from "./Reducers/sellerReportReducer";


const rootReducer = {
    salesReport: salesReportReducer,
    auth: authReducer,
    category : categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    chat: chatReducer,
    order: OrderReducer,
    payment: PaymentReducer,
    dashboard: dashboardReducer,
    banner: bannerReducer,
    sellerReport: sellerReportReducer


}
export default rootReducer;