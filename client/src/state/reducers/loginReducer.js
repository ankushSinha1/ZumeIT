const loginReducer = (state={isLoggedIn: false, userStatus: ''}, action) => {
    if(action.type === 'LOGIN'){
        return {...state, isLoggedIn: true, userStatus: action.payload};
    }else if(action.type === 'LOGOUT'){
        return  {...state, isLoggedIn: false, userStatus: ''};
    }else{
        return state;
    }
}
export default loginReducer;