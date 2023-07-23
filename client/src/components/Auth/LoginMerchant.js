import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {rootRoute} from '../Axios/axiosRoot.js'
import axios from "axios";
import {notify} from '../Notify/notify.js'
import {useSelector, useDispatch} from 'react-redux'
import { bindActionCreators } from "redux";
import { actionCreator } from "../../state/index.js";

export const LoginMerchant = () => {
    const navigate= useNavigate()
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const actions = bindActionCreators(actionCreator, dispatch)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inpType, setInpType] = useState('password');
    const [btnText, setBtnText] = useState('Show password')

    const showPassword = () => {
        if(btnText === 'Show password'){
            setInpType('text')
            setBtnText('Hide password')
        }
        else{
            setInpType('password')
            setBtnText('Show password')
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        var loginMerchant = {
            email: email,
            password: password
        }
        rootRoute.post('login/merchant', loginMerchant)
        .then(res =>{
            if(res.data.msg === 'Merchant with this email does not exist'){
                notify(res.data.msg, 'error')
            }else{

                actions.onLogin(res.data)
                rootRoute.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
                notify(res.data.msg, 'success')
                navigate(-1)
            }
        })
        .catch(err => notify(err.data.msg), 'error')
    }
    return(
        <div className="container" style={{
            display: 'flex', 
            justifyContent: 'center',
        }}>
            <div style={{
                display: 'flex',
                margin: '1%',
                width: '100%',
                maxWidth: '70%',
                backgroundColor: 'black',
                opacity: '100%',
                borderRadius: '10px',
            }}>
                <form  style={{
                    padding: '10px',
                    width: '100%',
                    backgroundImage: `url(${require('../../Background.png')})`,
                    backgroundSize: '80%',
                    opacity: '70%',
                    borderRadius: '10px',
                    filter: 'brightness(100%)'
                }} onSubmit={onSubmit}
                >
                    <h2>Merchant login</h2>
                    <div class="mb-3 mt-3">
                        <label for="exampleInputEmail1">Email</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            id="exampleInputEmail1"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" style={{display: 'flex',}}>
                        Password
                        <span className="ms-2">
                            {
                                inpType === 'text' ?
                                <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="18" 
                                fill="currentColor" 
                                class="bi bi-eye-slash-fill" 
                                viewBox="0 0 16 16"
                                onClick={()=>showPassword()}
                                style={{cursor: 'pointer'}}
                                >
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                                </svg>
                                : 
                                <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="18" 
                                fill="currentColor" 
                                class="bi bi-eye-fill" 
                                viewBox="0 0 16 16"
                                onClick={()=>showPassword()}
                                style={{cursor: 'pointer'}}
                                >
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                </svg>
                            }
                            </span>
                            </label>
                        <input 
                            type={inpType} 
                            class="form-control" 
                            id="exampleInputPassword1"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required                            
                        />
                    </div>
                    <div style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        flexDirection: 'column', 
                        gap: '8px',
                    }}>
                        <button type="submit" class="btn btn-primary" style={{width: '100%', borderRadius: '20px'}}>Login</button>
                        <button class="btn btn-danger" style={{width: '100%', borderRadius: '20px'}} onClick={()=>navigate(-1)}>Cancel</button>
                    </div>
                    <div className="mt-2">
                        Don't have an account yet? <Link to='/register' style={{textDecoration: 'none', filter: 'brightness(200%)'}}>Register</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}