import {createSlice} from "@reduxjs/toolkit";

const initialState  ={
    eamil:"",
    userid:"",
    phone :"",
    pwd :"",
    name:"",
}

const userSlice = createSlice({
    name:"user",
    initialState ,
    reducers:{
        loginAction:(state, action)=>{
            state.email = action.payload.email;
            state.userid = action.payload.userid;
            state.phone = action.payload.phone;
            state.pwd = action.payload.pwd;
            state.name = action.payload.name;
        },
        logoutAction:(state)=>{
            state.email = '';
            state.userid = '';
            state.phone = '';
            state.pwd ='';
            state.name = '';
        }
    }
});


export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice;