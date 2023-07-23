import {useState, useEffect} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { bindActionCreators } from 'redux'
import {rootRoute} from '../../Axios/axiosRoot.js'
import {actionCreator} from '../../../state/index.js'
import {notify} from '../../Notify/notify.js'
export const CartUserCustomer = () =>{
    let totalAmount = 0
    const {userId} = useParams()
    const navigate = useNavigate()
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)
    const [userCustomerDetails, setUserCustomerDetails] = useState({})
    const [increaseItemLoader, setIncreaseItemLoader] = useState({status: false, index: ''})
    const [decreaseItemLoader, setDecreaseItemLoader] = useState({status: false, index: ''})
    useEffect(() => {
        if(!login.isLoggedIn){
            notify('You must be logged in to do that!', 'error')
            navigate('/login/customer')
        }
        rootRoute.get(`/user/${userId}`)
        .then(res=> {
            setUserCustomerDetails(res.data)
        })
        .catch(err => console.log(err))
    }, [])
    const toggleRemoveAndMinusButton = (element, index) =>{
        if(userCustomerDetails.cart[index].quantity === 1){
            return(<>
                <button type="button" class="btn btn-primary" onClick={()=>{
                    setDecreaseItemLoader({status: true, index: index})
                    removeItemFromCart(element, index)
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                </button>
            </>
            )
        }else{
            return(
                <>
                    <button type="button" class="btn btn-primary" onClick={()=>{
                        setDecreaseItemLoader({status: true, index: index})
                        decreaseQuantity(index)
                    }}>-</button>
                </>
            )
        }
    }
    const removeItemFromCart = async (element, index) =>{
        await rootRoute.post(`/user/${userId}/deleteItemFromCart`, {element, index: index})
        .then(async res=>{
            notify(res.data.msg, 'success')
            await rootRoute.get(`/user/${userId}`)
            .then(response=> setUserCustomerDetails(response.data))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        setDecreaseItemLoader({status: false, index: ''})
    }
    const increaseQuantity = async (index) => {
        userCustomerDetails.cart[index].quantity += 1
        setUserCustomerDetails(userCustomerDetails)
        await rootRoute.patch(`/user/${userId}/update`, userCustomerDetails)
        .then(async res =>{
            setUserCustomerDetails(res.data.data)
        })
        .catch(err => notify(err.err, 'error'))
        await rootRoute.patch(`/user/${userId}/update`, userCustomerDetails)
        .then(async res =>{
            setUserCustomerDetails(res.data.data)
        })
        .catch(err => console.log(err))
        setIncreaseItemLoader({status: false, index: ''})
        // console.log(userCustomerDetails)
    }
    const decreaseQuantity = async (index) => {
        userCustomerDetails.cart[index].quantity -= 1
        setUserCustomerDetails(userCustomerDetails)
        await rootRoute.patch(`/user/${userId}/update`, userCustomerDetails)
        .then(async res =>{
            setUserCustomerDetails(res.data.data)
        })
        .catch(err => notify(err.err, 'error'))
        await rootRoute.patch(`/user/${userId}/update`, userCustomerDetails)
        .then(async res =>{
            setUserCustomerDetails(res.data.data)
        })
        .catch(err => console.log(err))
        setDecreaseItemLoader({status: false, index: ''})
    }
    if(!userCustomerDetails.cart){
        return(
            <>Loading...</>
        )
    }
    else if(userCustomerDetails.cart.length === 0){
        return(
            <>Your cart is empty</>
        )
    }
    return (
        <div className='container'>
            <div style={{
                width: '100%',
                backgroundColor: 'black',
                opacity: '100%',
                borderRadius: '10px',                
            }}>
                <div style={{
                    padding: '10px',
                    width: '100%',
                    backgroundImage: `url(${require('../../../Background.png')})`,
                    backgroundSize: '80%',
                    opacity: '75%',
                    borderRadius: '10px',
                    filter: 'brightness(100%)'                    
                }}>
                    <h2>Cart</h2>
                    {  
                        userCustomerDetails.cart.map((element, index)=>{
                            totalAmount += (element.item.price * element.quantity)
                            return(<>
                                <div className='row p-3' style={{height: '100%'}}>
                                    <div className='col-sm-3' style={{border: '3px solid grey', borderRadius: '7px'}}>
                                        <Link to={`/product/${element.item._id}`}>
                                            <img alt='err' src={element.item.images[0]} style={{width: '100%', height:"100%"}}/>
                                        </Link>
                                    </div>
                                    <div className='col-sm-9' style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <div>
                                            <h4>{element.item.brand}</h4>
                                            <div className='mb-2'>
                                                {
                                                    element.item.inStock ? 
                                                    <button className='btn btn-success disabled' style={{color: '#00ff00'}}>In stock</button>
                                                    : <button className='btn btn-danger disabled' style={{color: '#7f0000'}}>Out of stock</button>
                                                }
                                            </div>
                                            <div className='mb-2'>₹ {element.item.price}</div>
                                        </div>
                                        <div className='d-flex justify-content-start'>
                                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                {(increaseItemLoader.status || decreaseItemLoader.status) && 
                                                (increaseItemLoader.index === index || decreaseItemLoader.index === index)? 
                                                <button class="btn btn-primary" type="button" disabled>
                                                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Refreshing...
                                                </button>
                                            : 
                                            <>
                                                {toggleRemoveAndMinusButton(element, index)}
                                                <button className="btn btn-primary">{element.quantity}</button>
                                                <button class="btn btn-primary" onClick={()=>{
                                                    setIncreaseItemLoader({status: true, index: index})
                                                    increaseQuantity(index)
                                                }}>+</button>
                                            </>
                                            }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <hr/>
                    </>
                            )
                        })
                    }
                    <div className='col-12' style={{height: '50px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <h4>
                            Total amount : {totalAmount}
                        </h4>
                    </div>
                    <div style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                flexDirection: 'column', 
                                gap: '8px',
                            }}>

                        <button 
                            className='btn btn-success' 
                            onClick={()=>navigate(`/user/${userId}/checkout`)} 
                            style={{
                                width: '100%',
                                borderRadius: '20px'
                            }}>
                                Buy now
                        </button>
                        <button class="btn btn-danger" onClick={(e)=>{
                            e.preventDefault()
                            navigate(-1)
                        }} 
                        style={{
                            width: '100%', 
                            borderRadius: '20px'
                        }} >Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}