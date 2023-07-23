export const onLogin = (status)=> {
    return (dispatch) => 
    dispatch({
        type: 'LOGIN',
        payload: status,
    })
}
export const onLogout = (status) => {
    return (dispatch) => 
    dispatch({
        type: 'LOGOUT',
        payload: status,
    })
}