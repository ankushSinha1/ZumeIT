import {useParams, useNavigate } from "react-router-dom"
import { rootRoute } from "../../Axios/axiosRoot"
import { useSelector, useDispatch } from "react-redux"
import { bindActionCreators } from "redux"
import { actionCreator } from "../../../state"
import { useEffect } from "react"
import { notify } from "../../Notify/notify"
export const DeleteUserMerchant = () =>{
    const {userId} = useParams()
    const navigate = useNavigate()
    const login = useSelector(state=> state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)
    useEffect(()=>{
        if(!login.isLoggedIn){
            navigate('/login/merchant')
            notify('You need to be logged in to do that!', 'error')
        }
        rootRoute.delete(`/user-m/${userId}/delete`)
        .then(res => {
            if(res.data.msg === 'Token expired!'){
                notify('Id expired', 'error')
                rootRoute.post('/login/refToken', login.userStatus)
                .then(data => {
    
                    if(data.data.msg === 'RefToken expired'){
                        rootRoute.post('/login/deleteRefToken', login.userStatus)
                        .then(data => console.log(data))
                        .catch(err  => console.log(err))
                        notify('Error occured! Login required', 'error')
                        navigate('/login/merchant')
                    }else{
                        action.onLogout()
                        action.onLogin(data.data)
                        rootRoute.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
                        navigate(-1)
                        notify('New Id registered!', 'success')
                        notify("Could not delete user! Try again.", 'error')
                    }
                })
                .catch(err => console.log(err))
            }else{
                notify(res.data.msg, 'success')
                navigateTo()
            }
        })
        .catch(err => console.log(err))
    }, [])
    const navigateTo = () =>{
        action.onLogout()
        notify('Logged out successfully', 'success')
        navigate('/')
    }
    return(
        <></>
    )
}