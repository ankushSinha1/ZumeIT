import { useEffect, useState } from "react"
import { rootRoute } from "../../Axios/axiosRoot"
import { Link, useParams } from "react-router-dom"
import { monthNumToName } from "../../Helpers/monthNumToName.js"
import './ShowUserMerchant.css'
import { useDispatch, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import { actionCreator } from "../../../state"

export const ShowUserMerchant = () =>{ 
    const {userId} = useParams()
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)

    const [userMerchantDetails, setUserMerchantDetails] = useState({})
    useEffect(()=>{
        rootRoute.get(`/user-m/${userId}`)
        .then(res => setUserMerchantDetails(res.data))
        .catch(err => console.log(err))
    }, [])
    const showEditAndDeleteButtons = () =>{
        if(userMerchantDetails.email && login.isLoggedIn && userMerchantDetails.email === login.userStatus.user.email){
            return (
                <div className="edit-delete mt-2">
                    <Link to={`/user-m/${userId}/edit`} className="btn btn-info" style={{width: '100%', borderRadius: '20px'}}>
                        Edit user
                    </Link>
                    <Link to={`/user-m/${userId}/delete`} className="btn btn-danger" style={{width: '100%', borderRadius: '20px'}}>
                        Delete user
                    </Link>
                </div>
            )
        }
        return(<></>)
    }
    const date =new Date(userMerchantDetails.createdAt)
    {monthNumToName(date)}
    if(!userMerchantDetails._id){
        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span class="">Loading...</span>
            </div>
        )
    }
    return <>
    <div className="container">
            {/* <h2> User Profile Page</h2> */}
            <div className="box-parent">
                <div class="card">
                    <ul class="list-group list-group-flush">
                        <li className="list-group-item">
                            <div className="profile-image">
                                <img src={userMerchantDetails.profilePic} className="img" alt="Profile Picture"/>
                            </div>
                        </li>
                        <li className="list-group-item">Merchant profile</li>
                        <li class="list-group-item">
                            <h3>{userMerchantDetails.firstName} {userMerchantDetails.lastName} </h3>
                        </li>
                        <li className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-check me-2" viewBox="0 0 16 16">
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                                {date.month} {date.getDate()}, {date.getFullYear()}
                        </li>
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
                                {userMerchantDetails.address}
                        </li>

                        <li className="list-group-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-shop me-2" viewBox="0 0 16 16">
  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
</svg>
                            {userMerchantDetails.shopName}
                        </li>
                        <li className="list-group-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-basket-fill me-2" viewBox="0 0 16 16">
  <path d="M5.071 1.243a.5.5 0 0 1 .858.514L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1.717L5.07 1.243zM3.5 10.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3z"/>
</svg>
                            {userMerchantDetails.shopCategory.toUpperCase()}
                        </li>
                        <li className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-envelope me-2" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                            </svg>
                            {userMerchantDetails.email}
                        </li>
                        <li className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-telephone me-2"  viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                            </svg>
                            +91{userMerchantDetails.contactNum}
                        </li>

                        <li className="list-group-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-seam-fill me-2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003 6.97 2.789ZM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461L10.404 2Z"/>
</svg>
                            <Link to={`/user-m/${userId}/uploaded-products`} className="orders-link">
                                Show Products
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