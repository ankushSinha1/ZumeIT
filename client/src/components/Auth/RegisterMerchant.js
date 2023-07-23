import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { convToBase64 } from '../Helpers/convToBase64'
import {notify} from '../Notify/notify.js'
import {rootRoute} from '../Axios/axiosRoot'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreator } from '../../state'
import axios from 'axios'

export const RegisterMerchant = () =>{
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
    const [shopName, setShopName] = useState('')
    const [shopCategory, setShopCategory] = useState('')
    const [inpType, setInpType] = useState('password')
    const [text, setText] = useState('Show password')

    const onChangeProfilePict = async (e) => {
        setProfilePic({myFile: ''})
        const dataPict = await convToBase64(e.target.files[0])
        setProfilePic({myFile: dataPict})
    }
    const onChangeOptions = (e) => {
        setShopCategory(e.target.value)
    }
    const showPassword = () =>{
        if(inpType === 'password'){
            setInpType('text')
            setText('Hide password')
        }else{
            setInpType('password')
            setText('Show password')
        }
    }
    const onSubmit = async (e) =>{
        e.preventDefault()
        var newMerchant = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            profilePic: profilePic.myFile,
            shopName: shopName,
            shopCategory: shopCategory,
            address: address,
            products: [],
            contactNum: contactNum,
        }

        //uploading image on cloudinary
        await rootRoute.post('/register/uploadImage', profilePic)
        .then(res => newMerchant.profilePic = res.data.secure_url)
        .catch(err => console.log(err))
        await rootRoute.post('/register/merchant', newMerchant)
        .then(res=>{
            actions.onLogin(res.data)
            rootRoute.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
            navigate('/')
            notify(res.data.msg, 'success')
        })
        .catch(err => console.log(err))
    }
    return(
        <div className='container'  style={{display: 'flex', justifyContent: 'center'}}>
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
                    <div  style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '10px 0px 20px 0px'}}
                    >
                        <img src={require('../../ZumeIT.png')} alt='err' style={{
                            width: 'auto',
                            maxWidth: '100%', 
                            height: '50px', 
                            margin: '1%', 
                            borderRadius: '4px',
                            filter: 'brightness(160%)'
                        }}/>
                    </div>
                    <div>
                        <div class="row ">
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">First Name</label>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    value={firstName} 
                                    required onChange={(e)=>setFirstName(e.target.value)} placeholder="Enter your first name"/>
                            </div>
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Last Name</label>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    value={lastName} 
                                    required onChange={(e)=>setLastName(e.target.value)} placeholder="Enter your last name"/>
                            </div>
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Email</label>
                                <input 
                                    type="email"
                                    className="form-control" 
                                    value={email} 
                                    required onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email id"/>
                            </div>
                            <div className="col-md-6" style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Password
                                <span className="ms-2" style={{}}>
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
                                            >
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                        </svg>
                                    }
                                    </span></label>
                                <input 
                                    type={inpType}
                                    className="form-control" 
                                    value={password} 
                                    required onChange={(e)=>setPassword(e.target.value)} placeholder="Enter password"
                                />
                            </div>
                            <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Address</label>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    value={address} 
                                    required onChange={(e)=>setAddress(e.target.value)} placeholder="Enter your address"/>
                            </div>
                            <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Contact no.</label>
                                <input 
                                    type="number"
                                    className="form-control" 
                                    value={contactNum} 
                                    required onChange={(e)=>setContactNum(e.target.value)} placeholder='00000 00000'/>
                            </div>
                            <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Shop Name</label>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    value={shopName} 
                                    required onChange={(e)=>setShopName(e.target.value)} placeholder="Enter your shop name"/>
                            </div>
                            <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                                <label className="form-label">Shop Category</label>
                                {/* <input 
                                    type="text"
                                    className="form-control" 
                                    value={shopCategory} 
                                required onChange={(e)=>setShopCategory(e.target.value)} placeholder="Enter shop category"/> */}
                                    <select class="form-select form-select-md mb-3" value = {shopCategory} onChange={(e)=>{onChangeOptions(e)}} aria-label=".form-select-lg example">
                                        <option selected>Select your shop category</option>
                                        <option  value='electronics'>Electronic products</option>
                                        <option value="books">Books</option>
                                        <option value="stationary">Stationary</option>
                                        <option value="gaming">Gaming</option>
                                        <option value="beauty">Beauty</option>
                                        <option value="health">Health care</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="handicrafts">Handicrafts</option>
                                        <option value="groceries">Groceries</option>
                                        <option value="kitchen">Kitchen</option>
                                        <option value="household">Household supplies</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="home-appliances">Home appliances</option>
                                        <option value="garden">Garden</option>
                                        <option value="kids-accs">Kid's Accessories</option>
                                        <option value="kids-fashion">Kid's Fashion</option>
                                        <option value="kids-toys">Toys for children</option>
                                        <option value="sports">Sports</option>
                                        <option value="travel">Travel</option>
                                        <option value="industrial">Industrial and Scientific</option>
                                    </select>
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
                                            border: '4px solid #efefef',
                                            objectFit: 'cover',
                                        }}/>
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
                                flexDirection: 'column', 
                                gap: '8px',
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