import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { rootRoute } from "../../Axios/axiosRoot"
import { notify } from "../../Notify/notify"
import {monthNumToName} from '../../Helpers/monthNumToName.js'

export const OrdersUserCustomer = () =>{
    const {userId} = useParams()
    const [userCustomerDetails, setUserCustomerDetails] = useState({})
    useEffect(()=>{
        rootRoute.get(`/user/${userId}`)
        .then(res => setUserCustomerDetails(res.data))
        .catch(err => notify(err.err, 'error'))
    }, [])
    if(userCustomerDetails._id && userCustomerDetails.orders[0]){
        return(
            <>
            <div className="container">
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
                        {
                            userCustomerDetails.orders.map(_orders => {
                                let date = new Date(_orders.Date)
                                {monthNumToName(date)}
                                var totalAmount = 0
                                return(
                                    <div className="row">
                                        <div> Ordered  at {date.getHours()}:{date.getMinutes()} on {date.getDate()}, {date.month} {date.getFullYear()}</div>
                                        {_orders.currentOrders.map(order => {
                                            totalAmount += (order.item.price * order.quantity)
                                            return (
                                                <>
                                                <div className="row d-flex justify-content-center align-items-center" 
                                                    style={{
                                                        height: '60px', padding: '10px'
                                                    }}
                                                >
                                                    <div className="col-3 d-flex justify-content-center align-items-center">{order.item.brand}</div>
                                                    <div className="col-3 d-flex justify-content-center align-items-center">₹ {order.item.price}</div>
                                                    <div className="col-3 d-flex justify-content-center align-items-center">{order.quantity}</div>
                                                    <div className="col-3 d-flex justify-content-center align-items-center"> ₹ {order.item.price * order.quantity}</div>
                                                </div>
                                                </>
                                            )
                                        })}
                                        <div className="row d-flex justify-content-end align-items-center pt-3 pb-3">
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
                                                    ₹ {(totalAmount*1.06).toFixed(2)}
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
                                                    ₹ {(totalAmount*1.06).toFixed()}
                                                </div>

                                        </div>
                                        <hr/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
}