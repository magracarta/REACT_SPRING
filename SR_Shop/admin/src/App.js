import { Routes , Route } from "react-router-dom";
import Admin from "./component/Admin";
import MemberList from "./component/member/MemberList";
import OrderList from "./component/order/OrderList";
import ProductList from "./component/product/ProductList";
import ProductView from "./component/product/ProductView";
import UpdateProduct from "./component/product/UpdateProduct";
import WriteProduct from "./component/product/WriteProduct";
import QnaList from "./component/qna/QnaList";
import QnaView from "./component/qna/QnaView";
import SubMenu from "./component/SubMenu";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Admin />}/>
        <Route path="/productList" element={<ProductList />}/>
        <Route path="/orderList" element={<OrderList />}/>
        <Route path="/qnaList" element={<QnaList />}/>
        <Route path="/memberList" element={<MemberList />}/>
        <Route path="/writeProduct" element={<WriteProduct />}/>
        <Route path="/productView/:pseq" element={<ProductView />}/>
        <Route path="/updateProduct/:pseq" element={<UpdateProduct />}/>
        <Route path="/qnaView/:qseq" element={<QnaView />}/>
      </Routes>
    </div>
  );
}

export default App;
