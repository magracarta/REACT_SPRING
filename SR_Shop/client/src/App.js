import { Route, Routes } from 'react-router-dom';
import Index from './component/Index'; 
import Heading from './component/HeaderFooter/Heading';
import Footer from './component/HeaderFooter/Footer';

import "./style/index.css"
import { Login , Join ,UpdateMember } from './component/member';
import KakaoSaveInfo from './component/member/KakaoSaveInfo';
import { Kindlist, ProductDetail } from './component/product';
import {Cartlist} from "./component/cart"
import {OrderList , Mypage , OrderAll} from "./component/order"
import { Customer , Qna ,WriteQna , QnaView } from './component/customer';


function App() {
  return (
    <div className='container'> 
      <Heading />
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/kakaosaveinfo' element={<KakaoSaveInfo />} />
        <Route path='/join' element={<Join />} />
        <Route path='/kindlist/:kind' element={<Kindlist />} />
        <Route path='/productDetail/:pseq' element={<ProductDetail />} />
        <Route path='/cartlist' element={<Cartlist />} />
        <Route path='/orderList/:oseq' element={<OrderList />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/orderAll' element={<OrderAll />} />
        <Route path='/updateMember' element={<UpdateMember />} />
        <Route path='/customer' element={<Customer />} />
        <Route path='/qna' element={<Qna />} />
        <Route path='/writeQna' element={<WriteQna />} />
        <Route path='/qnaView/:qseq' element={<QnaView />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
