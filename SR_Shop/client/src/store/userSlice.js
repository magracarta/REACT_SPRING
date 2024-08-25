import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    userid:'',
    pwd:'',
    name:'',
    email:'',
    phone:'',
    zip_num:'',
    address1:'',
    address2:'',
    address3:'',
    indate:'',
    useyn:'',
    provider:'',
}

const userSlice = createSlice({
    name : 'user',  // 저장되는 저장객체의 이름
    initialState,
    reducers:{ 
        loginAction:(state, action)=>{
            state.userid=action.payload.userid;
            state.pwd=action.payload.pwd;
            state.name=action.payload.name;
            state.email=action.payload.email;
            state.phone=action.payload.phone;
            state.zip_num=action.payload.zip_num;
            state.address1=action.payload.address1;
            state.address2=action.payload.address2;
            state.address3=action.payload.address3;
            state.indate=action.payload.indate;
            state.useyn=action.payload.useyn;
            state.provider=action.payload.provider;
        },
        logoutAction:(state)=>{
            state.userid='';
            state.pwd='';
            state.name='';
            state.email='';
            state.phone='';
            state.zip_num='';
            state.address1='';
            state.address2='';
            state.address3='';
            state.indate='';
            state.useyn='';
            state.provider='';
        }
    }
})

export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice;