import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { convToBase64 } from '../Helpers/convToBase64'
import {notify} from '../Notify/notify.js'
import {rootRoute} from '../Axios/axiosRoot'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreator } from '../../state'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import './RegisterCustomer.scss'

export const RegisterCustomer = () =>{
    const navigate = useNavigate();
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const actions = bindActionCreators(actionCreator, dispatch)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [contactNum, setContactNum] = useState('')
    const [profilePic, setProfilePic] = useState({myFile: ''})
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

    const onChangeProfilePict = async (e) => {
        setProfilePic({myFile: ''})
        const dataPict = await convToBase64(e.target.files[0])
        setProfilePic({myFile: dataPict})    
    } 
    const onSubmit = async (e) =>{
        e.preventDefault()
        var newCustomer = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            profilePic: profilePic.myFile,
            orders: [],
            cart:[],
            address: address,
            contactNum: contactNum,
        }

        await rootRoute.post('/register/uploadImage', profilePic)
        .then(res => newCustomer.profilePic = res.data.secure_url)
        .catch(err => console.log(err))

        await rootRoute.post('/register/customer', newCustomer)
        .then(res=>{
            actions.onLogin(res.data) 
            rootRoute.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
            navigate('/')
            notify(res.data.msg, 'success')
        })
        .catch(err => console.log(err))
    }
    const eye = () =>{
        if(password.length !== 0){
            return(
                inpType === 'text' ?
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="18" 
                fill="black" 
                class="bi bi-eye-slash-fill" 
                viewBox="0 0 16 16"
                style={{cursor:'pointer'}}
                onClick={()=>showPassword()}
                >
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
            : 
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="18" 
            fill="black" 
            class="bi bi-eye-fill" 
            viewBox="0 0 16 16"
            style={{cursor:'pointer'}}
            onClick={()=>showPassword()}
            >
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
            </svg>
            )
        }else{
            return <></>
        }
    }
    return(
        <div className='container' style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '70%',
                backgroundColor: 'black',
                opacity: '100%',
                borderRadius: '10px',
            }}>
                <form onSubmit={onSubmit} style={{
                    padding: '10px',
                    width: '100%',
                    backgroundImage: `url(${require('../../Background.png')})`,
                    backgroundSize: '80%',
                    opacity: '85%',
                    borderRadius: '10px',
                    filter: 'brightness(100%)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '10px 0px 20px 0px'
                    }}>
                        <img 
                            src={require('../../ZumeIT.png')} 
                            alt='err' 
                            style={{
                                width: 'auto',
                                maxWidth: '100%', 
                                height: '50px', 
                                margin: '1%', 
                                borderRadius: '4px',
                                filter: 'brightness(160%)'
                            }
                        }/>
                    </div>
                    <div>
                        <div class="row">
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label" for='firstname'>First Name</label>
                                <input 
                                    type="text"
                                    id='firstname'
                                    className="form-control" 
                                    value={firstName} 
                                    required onChange={(e)=>setFirstName(e.target.value)} placeholder="Enter your first name"
                                />
                            </div>
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label" for='lastname'>Last Name</label>
                                <input 
                                    type="text"
                                    id='lastname'
                                    className="form-control" 
                                    value={lastName} 
                                    required onChange={(e)=>setLastName(e.target.value)} placeholder="Enter your last name"
                                />
                            </div>
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label" for='email'>Email</label>
                                <input 
                                    type="email"
                                    id='email'
                                    className="form-control" 
                                    value={email} 
                                    required onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email id"
                                    />
                            </div>
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label" for='password'>Password</label>
                                <input 
                                    type={inpType}
                                    id='password'
                                    className="form-control" 
                                    value={password} 
                                    required 
                                    onChange={(e)=>{
                                        if(e.target.value === ''){
                                            setInpType('password')
                                        }  
                                        setPassword(e.target.value)
                                    }} 
                                    placeholder="Enter password"
                                    style={{padding: '6px 28px 6px 12px'}}
                                />
                                <span className="ms-2" style={{
                                    display: 'flex',
                                    position: 'absolute',
                                    right: '20px',
                                    transform: 'translateY(-27px)'
                                }}>{eye()}</span>
                            </div>
                            <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label" for='address'>Enter your address</label>
                                <input 
                                    type="text"
                                    id='address'
                                    className="form-control" 
                                    value={address} 
                                    required 
                                    onChange={(e)=>setAddress(e.target.value)} 
                                    placeholder="Enter your address"
                                />
                            </div>
                            <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label" for='number'>Enter your contact no.</label>
                                <PhoneInput
                                    value={contactNum} 
                                    id='number'
                                    required
                                    onChange={(phone)=>{setContactNum(phone)}}
                                />
                            </div>
                            <div className='col-md-6' style={{height: 'auto', padding: '0px 15px 0px 15px '}}>
                                <div className='' 
                                    style={{ 
                                        marginBottom: '2%',
                                        padding: '10px 0px 10px 0px', 
                                        height: '100%',
                                        width: '100%',
                                    }}>
                                    <img className="" src={profilePic.myFile} alt="Selected image will be shown here"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'flex',
                                            justifyContent: 'center',    
                                            borderRadius: '8px',
                                            overflow: 'auto',
                                            border: '2px solid rgb(210 208 208)',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='col-md-6' style={{
                                marginBottom: '2%',
                                height: 'auto', 
                                padding: '0px 20px 0px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {profilePic.myFile? 
                                    <button type="button" className="btn btn-danger" onClick = {()=>setProfilePic({myFile: ''})} 
                                    style={{borderRadius: '20px'}}>
                                        Remove this image
                                    </button>
                                    :
                                    <label className="btn btn-info" for="images" >
                                        Upload profile image
                                    </label>
                                }
                                <input type="file" id="images" required onChange={e=>onChangeProfilePict(e)} accept=".png, .jpg, .jpeg" hidden/>
                            </div>
                            <div style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: '15px',
                            }}>
                                <button type="submit" class="btn btn-primary" style={{width: '100%', borderRadius: '20px'}}>Register</button>
                                <button class="btn btn-danger" style={{width: '100%', borderRadius: '20px'}} onClick={()=>navigate(-1)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}