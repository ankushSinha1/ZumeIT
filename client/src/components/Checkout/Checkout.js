import { useEffect, useState } from "react"
import { rootRoute } from "../Axios/axiosRoot"
import { useNavigate, useParams } from "react-router-dom"
import { notify } from "../Notify/notify"

export const Checkout =() =>{
    var totalAmount = 0
    var finalAmount
    const navigate = useNavigate()
    const {userId} = useParams()
    const [cart, setCart] = useState([])
    const [userCustomerDetails, setUserCustomerDetails] = useState({})
    const [togglePaymentGateway, setTogglePaymentGateway] = useState(false)
    useEffect(()=>{
        rootRoute.get(`/user/${userId}`)
        .then(res=>{
            setCart(res.data.cart)
            setUserCustomerDetails(res.data)
        })
    }, [])

    const handlePayment = async (amount) =>{
        await rootRoute.post('/payment/order-creation', {amount: amount})
        .then(res => {
            console.log(res.data)
            handleOpenRazorpay(res.data)
        })
        .catch(err => console.log(err))
    }
    const handleOpenRazorpay = (data) =>{
        const options = {
            key: 'rzp_test_O5WrCObZSPvrXw',
            amount: data.order.amount,
            currency: "INR",
            name: "ZumeIT",
            order_id: data.order.id,
            handler: async (response)=>{
                await rootRoute.post('/payment/payment-verification', response)
                .then(async res => { 
                    if(res.data.msg === 'signatureValid'){
                        let date = new Date()
                        await rootRoute.patch(`/user/${userId}/update-orders`,{ cart: cart, date: date})
                        .then((_data) => {
                            notify('Order successfully placed!', 'success')
                        })
                        .catch(err => console.log(err))
                    }
                })
                .catch(err => {
                    notify(err.toString(), 'error')
                    notify('Disable your ad-blocker and then try again', 'error')
                })
                navigate(`/user/${userId}/orders`)
            },
            prefill: {
                name: `${userCustomerDetails.firstName} ${userCustomerDetails.lastName}`,
                email: `${userCustomerDetails.email}`,
                contact: `${userCustomerDetails.contactNum}`
            }
        }
        const rzp = new window.Razorpay(options)
        setTogglePaymentGateway(false)
        rzp.open()

    }
    if(!userCustomerDetails._id){
        return (
            <>
            Loading...
            </>
        )
    }else{
        if(!cart[0]){
            notify('Your cart is empty. Add products in your cart to checkout.', 'error')
            navigate('/')
            
        }else{
            return(
                <div className="container pt-4">
                    <div style={{
                        width: '100%',
                        backgroundColor: 'black',
                        opacity: '100%',
                        borderRadius: '10px',
                    }}>
                        <div style={{
                            padding: '10px',
                            width: '100%',
                            backgroundImage: `url(${require('../../Background.png')})`,
                            backgroundSize: '80%',
                            opacity: '75%',
                            borderRadius: '10px',
                            filter: 'brightness(100%)'    
                        }}>
                            <div className="row" 
                                style={{
                                    height: '60px', padding: '10px'
                                }}>
                                <div className="col-3 d-flex justify-content-center align-items-center">
                                    Name
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center">
                                    Base price
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center">
                                    Quantity
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center">
                                    Net amount
                                </div>
                            </div>
                            {userCustomerDetails.cart.map((element, index) => {
                                totalAmount += element.item.price * element.quantity
                                return(
                                    <div className="row" style={{height: '60px', padding: '10px'}}>
                                        <div className="col-3 d-flex justify-content-center align-items-center">
                                            {element.item.brand}
                                        </div>
                                        <div className="col-3 d-flex justify-content-center align-items-center">
                                            ₹ {element.item.price}
                                        </div>
                                        <div className="col-3 d-flex justify-content-center align-items-center">
                                            {element.quantity}
                                        </div>
                                        <div className="col-3 d-flex justify-content-center align-items-center">
                                            ₹ {element.item.price*element.quantity}
                                        </div>
                                    </div>
                                    )
                                })
                            }
                            <div className="row d-flex justify-content-end align-items-center pt-3 pb-3" 
                                style={{
                                    height: '60px', padding: '10px'
                                }}
                            >
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    Total amount
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    ₹ {totalAmount}
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end align-items-center pt-3 pb-3" 
                                style={{
                                    height: '60px', padding: '10px'
                                }}
                            >
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    GST (6%)
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    ₹ {(totalAmount*0.06).toFixed(2)}
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end align-items-center pt-3 pb-3" 
                                style={{
                                    height: '60px', padding: '10px'
                                }}
                            >
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    Net amount
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    ₹ {totalAmount + (totalAmount*0.06)}
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end align-items-center pt-3 pb-3" 
                                style={{
                                    height: '60px', padding: '10px'
                                }}
                            >
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    Round off
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center" 
                                    style={{
                                        borderBottom: '1px solid grey'
                                    }}
                                >
                                    ₹ {(totalAmount + (totalAmount*0.06)).toFixed()}
                                </div>

                            </div>
                            <div style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                flexDirection: 'column', 
                                gap: '8px',
                            }}>
                                {
                                !togglePaymentGateway ? 
                                    <>
                                        <button 
                                            className="btn btn-success" 
                                            onClick={()=>{
                                                setTogglePaymentGateway(true)
                                                finalAmount = (totalAmount*1.06).toFixed()
                                                handlePayment(finalAmount)
                                            }}
                                            style={{
                                                width: '100%',
                                                borderRadius: '20px'
                                            }}>
                                            Proceed to checkout
                                        </button>
                                    </> : 
                                    <>
                                        <button className="btn btn-success disabled" 
                                            style={{
                                                width: '100%',
                                                borderRadius: '20px'
                                            }}
                                        >Redirecting...</button>
                                    </>
                                }
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
    }
}