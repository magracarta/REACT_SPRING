import {  Routes, Route } from "react-router-dom";

import Login from './Component/Login';
import Main from './Component/Main';
import Join from './Component/member/Join';
import WritePost from './Component/post/WritePost';
import MyPage from './Component/member/MyPage';
import Kakaosaveinfo from './Component/member/Kakaosaveinfo';
import EditProfile from './Component/member/EditProfile';
import MemberPage from './Component/member/MemberPage';

import Postone from './Component/post/Postone';

function App() {
    
    return (
        <div className="App" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/main" element={<Main />} />
                <Route path="/writePost" element={<WritePost />} />
                <Route path="/myPage" element={<MyPage />} />
                <Route path="/postone/:postid" element={<Postone />} />
                <Route path="/kakaosaveinfo/:nickname" element={<Kakaosaveinfo />} />
                <Route path="/editProfile" element={<EditProfile />} />
                <Route path="/memberPage/:membernick" element={<MemberPage />} />
                
            </Routes>
        </div>
    );
}

export default App;
