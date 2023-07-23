import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { rootRoute } from "../../Axios/axiosRoot"
import { useParams } from "react-router-dom"
import { monthNumToName } from "../../Helpers/monthNumToName.js"
import './ShowUserCustomer.css'
import { useDispatch, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import { actionCreator } from "../../../state"

export const ShowUserCustomer = () =>{ 
    const {userId} = useParams()
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)
    const [userCustomerDetails, setUserCustomerDetails] = useState({})
    useEffect(()=>{
        rootRoute.get(`/user/${userId}`)
        .then(res => setUserCustomerDetails(res.data))
        .catch(err => console.log(err))
    }, [])
    const showEditAndDeleteButtons = () =>{
        if(userCustomerDetails.email && login.isLoggedIn && userCustomerDetails.email === login.userStatus.user.email){
            return (
                <div className="edit-delete mt-2">
                    <Link to={`/user/${userId}/edit`} className="btn btn-info" style={{width: '100%', borderRadius: '20px'}}>
                        Edit user
                    </Link>
                    <Link to={`/user/${userId}/delete`} className="btn btn-danger" style={{width: '100%', borderRadius: '20px'}}>
                        Delete user
                    </Link>
                </div>
            )
        }
        return(<></>)
    }
    const date =new Date(userCustomerDetails.createdAt)
    {monthNumToName(date)}
    if(!userCustomerDetails._id){
        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span class="">Loading...</span>
            </div>
        )
    }
    return <>
        <div className="container">
            <h2> User Profile Page</h2>
            <div className="box-parent">
                <div class="card">
                    <ul class="list-group list-group-flush">
                        <li className="list-group-item">
                            <div className="profile-image">
                                <img src={userCustomerDetails.profilePic} className="img" alt="Profile Picture"/>
                            </div>
                        </li>
                        <li className="list-group-item">Customer profile</li>
                        <li class="list-group-item">
                            <h3>{userCustomerDetails.firstName} {userCustomerDetails.lastName} </h3>
                        </li>
                        <li className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-check me-2" viewBox="0 0 16 16">
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                                {date.month} {date.getDate()}, {date.getFullYear()}
                        </li>
                        {
                            login.isLoggedIn && userCustomerDetails._id === login.userStatus.user._id ?
                                <>
                                    <li className="list-group-item">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="19" 
                                            height="19" 
                                            fill="currentColor" 
                                            class="bi bi-geo-alt-fill me-2" 
                                            viewBox="0 0 16 16"
                                            >
                                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 
                                            6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                        </svg>
                                            {userCustomerDetails.address}
                                    </li>
                                </>
                                :
                            <></>
                        }
                        <li className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-envelope me-2" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                            </svg>
                            {userCustomerDetails.email}
                        </li>
                        <li className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-telephone me-2"  viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                            </svg>
                            +91{userCustomerDetails.contactNum}
                        </li>

                        <li className="list-group-item">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                fill="currentColor" 
                                class="bi bi-cart-check-fill me-2" 
                                viewBox="0 0 16 16"
                                >
                                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2
                                2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5
                                0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1
                                1 0 1 1-2 0 1 1 0 0 1 2 0zm-1.646-7.646-3 3a.5.5 0 0 
                                1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                            </svg>
                            <Link to={`/user/${userId}/orders`} className="orders-link">
                                Show Orders
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                fill="currentColor" 
                                class="bi bi-cart-fill me-2" 
                                viewBox="0 0 16 16"
                                >
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 
                                .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 
                                0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 
                                0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 
                                0 1 1 0 2 1 1 0 0 1 0-2z"
                                />
                            </svg>
                            <Link to={`/user/${userId}/cart`} className="cart-link">
                                Show Cart
                            </Link>
                        </li>
                    </ul>
                {showEditAndDeleteButtons()}
                </div>
            </div>
        </div>
        {/* <div class="user-profile">
        </div> */}

    </>
}