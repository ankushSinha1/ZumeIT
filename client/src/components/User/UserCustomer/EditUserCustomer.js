import { useEffect, useState } from 'react'
import { rootRoute } from '../../Axios/axiosRoot'
import { useParams, useNavigate } from 'react-router-dom'
import { convToBase64 } from '../../Helpers/convToBase64'
import { notify } from '../../Notify/notify.js'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreator } from '../../../state'

export const EditUserCustomer = () =>{
    const {userId} = useParams()
    const navigate = useNavigate()
    const login = useSelector(state=> state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)
    const [customerDetails, setCustomerDetails] = useState({})
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [contactNum, setContactNum] = useState('')
    const [profilePic, setProfilePic] = useState({myFile: ''})

    useEffect(()=>{
        if(!login.isLoggedIn){
            notify('You need to be logged in to do that!', 'error')
            navigate('/login/customer')
        }
        rootRoute.get(`/user/${userId}/edit`)
        .then(res => {
            setCustomerDetails(res.data)
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setEmail(res.data.email)
            setAddress(res.data.address)
            setContactNum(res.data.contactNum)
            setProfilePic({myFile: res.data.profilePic})
        })
        .catch(err => console.log(err))
    }, [])
    const onChangeProfilePict =async (e) =>{
        const dataPict = await convToBase64(e.target.files[0])
        await rootRoute.post(`/register/uploadImage`, {myFile: dataPict})
        .then(res => setProfilePic({myFile: res.data.secure_url}))
        .catch(err => console.log(err))
    }
    const onSubmit =async (e) =>{
        e.preventDefault()
        var updatedCustomer = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: customerDetails.password,
            profilePic: profilePic.myFile,
            orders: customerDetails.orders,
            address: address,
            contactNum: contactNum,
        }
        await rootRoute.patch(`/user/${userId}/update`, updatedCustomer)
        .then(res => {
            if(res.data.msg === 'Token expired!'){
                notify('Id expired', 'error')
                rootRoute.post('/login/refToken', login.userStatus.refToken)
                .then(data => {
                    //if reftoken is also expired
                    if(data.data.msg === 'RefToken expired'){
                        rootRoute.post('/login/deleteRefToken', login.userStatus)
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                        notify('Error occurred! Login required', 'error')
                        navigate('/login/customer')
                    }else{
                        //if reftoken is intact
                        action.onLogout()
                        action.onLogin(data.data)
                        rootRoute.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
                        navigate(`/user/${userId}`)
                        notify('New Id registered!', 'success')
                        notify("Could not edit your details. Try again.", 'error')
                    }
                })
            }else{
                notify(res.data.msg, 'success')
                navigate(`/user/${userId}`)
            }
        })
        .catch(err => console.log(err))
    }
    if(!customerDetails._id){
        return (

            <div className="d-flex justify-content-center align-items-center mb-2">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span class="">Loading details...</span>
            </div>
        )
    }
    return(
        <div className="container" style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '70%',
                backgroundColor: 'black',
                opacity: '100%',
                borderRadius: '10px',
            }}>
            <form noValidate onSubmit={onSubmit} style={{
                padding: '10px',
                width: '100%',
                backgroundImage: `url(${require('../../../Background.png')})`,
                backgroundSize: '80%',
                opacity: '85%',
                borderRadius: '10px',
                filter: 'brightness(100%)'
            }}>
                <h2 className='p-2 pb-4'>Edit User</h2>
                <div>
                    <div class="row " style={{height: 'auto'}}>
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
                        <div className='col-md-6' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                            <label className="form-label">Enter your contact no.</label>
                            <input 
                                type="number"
                                className="form-control" 
                                value={contactNum} 
                                required onChange={(e)=>setContactNum(e.target.value)} placeholder='00000 00000'/>
                        </div>
                        <div className='col-md-12' style={{height: '110px', padding: '0px 15px 0px 15px '}}>
                            <label className="form-label">Enter your address</label>
                            <input 
                                type="text"
                                className="form-control" 
                                value={address} 
                                required onChange={(e)=>setAddress(e.target.value)} placeholder="Enter your address"/>
                        </div>
                        <div className='col-md-6' style={{height: 'auto', padding: '0px 15px 0px 15px '}}>
                            <div className='' 
                                style={{ 
                                    marginBottom: '2%',
                                    padding: '10px 10px 10px 10px', 
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
                            padding: '0px 15px 0px 15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {profilePic.myFile? 
                                <button type="button" className="btn btn-danger" onClick = {()=>setProfilePic({myFile: ''})}>
                                    Remove this image
                                </button>
                                :
                                <label className="btn btn-info" for="images" >
                                    Upload profile image
                                </label>
                            }
                            <input type="file" id="images" required onChange={e=>onChangeProfilePict(e)} accept=".png, .jpg, .jpeg" hidden/>
                        </div>
                        <div 
                            style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                flexDirection: 'column', 
                                gap: '8px',
                            }}>
                            <button type="submit" class="btn btn-primary" style={{width: '100%', borderRadius: '20px'}}>Update</button>
                            <button class="btn btn-danger" style={{width: '100%', borderRadius: '20px'}} onClick={()=>navigate(-1)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form>
            </div>
        </div>
    )
}