import { useEffect, useState } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";
import { rootRoute } from "../Axios/axiosRoot";
import {  useSelector } from "react-redux";
import { notify } from "../Notify/notify";
import { monthNumToName } from "../Helpers/monthNumToName.js";
import {Loader} from '../Helpers/Loader.js'
export const ShowProduct = () => {
    const {productId} = useParams();
    const navigate = useNavigate()
    const login = useSelector(state=>state.login)
    const [productDetails, setProductDetails] = useState({})
    const [toggleItemInCart, setToggleItemInCart] = useState(false)

    useEffect(()=>{
        rootRoute.get(`/product/${productId}`)
        .then(async res => {
            setProductDetails(res.data)
            if(login.isLoggedIn){
                await rootRoute.get(`/user/${login.userStatus.user._id}`)
                .then(async response=>{
                    response.data.cart.map(element =>{
                        if(res.data.product && element.item._id === res.data.product._id){ 
                            setToggleItemInCart(true)
                            return (<></>)
                        }
                    })
                })
                .catch(err => console.log(err))
            }
            
        })
        .catch(err => console.log(err))
    }, [])
    const showEditAndDeleteButtons = () =>{
        if(productDetails.product.merchantDetails && login.isLoggedIn && productDetails.product.merchantDetails.email === login.userStatus.user.email){
            return(
                <div style={{display: 'flex', gap: '4px'}}>
                    <Link to={`/product/${productId}/edit`} className="btn btn-info w-50" > Edit product details</Link>
                    <Link to={`/product/${productId}/delete`} className="btn btn-danger w-50" style={{borderRadius: '20px'}}>Delete product</Link>
                </div>
            )
        }
        return(
            <></>
        )
    }
    const showEditAndDeleteButtonsReview = (review) =>{
        if(login.isLoggedIn && review.author && login.userStatus.user.email === review.author.email){
            return(
                <div style={{display: 'flex', gap: '4px'}}>
                    <Link to={`/product/${productId}/review/${review._id}/edit`} className="btn btn-info btn-sm" style={{width: 'auto'}}>Edit review</Link>
                    <Link to={`/product/${productId}/review/${review._id}/delete`} className="btn btn-danger btn-sm" style={{width: 'auto', borderRadius: '20px'}}>Delete review</Link>
                </div>
            )
        }else{
            return(
                <></>
            )
        }
    }
    const addToCartButton = () =>{
        if(login.isLoggedIn){
            if(toggleItemInCart){
                return(
                    <div>
                        <button className="btn btn-info p-2 disabled w-auto">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="20" 
                                fill="currentColor" 
                                className="bi bi-check2-square me-1" 
                                viewBox="0 0 16 16"
                            >
                                <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 
                                0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5
                                0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5
                                1.5 0 0 1-1.5 1.5H3z"
                                />
                                <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293
                                 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"
                                />
                            </svg>
                            Item already in cart
                        </button>
                    </div>
                )
            }else if(login.userStatus.user.products){
                return <></>
            }else if(!productDetails.product.inStock){
                return <></>

            }else{
                return(
                    <div><button className="btn btn-info w-auto" onClick={()=>addToCart()}>Add to cart</button></div>
                )
            }
        }else{
            return(
                <div><button className="btn btn-primary w-auto" onClick={()=>navigate('/login')}>Log in to add this item in your cart</button></div>
            )
        }
    }
    const addToCart = async() =>{
        var userId = login.userStatus.user._id
        await rootRoute.post(`/user/${userId}/addItemToCart`, {item: productDetails.product, quantity: 1})
        .then(res => {
            notify(res.data.msg, 'success')
            setToggleItemInCart(true)
        })
        .catch(err => console.log(err))
    }
    if( productDetails.product || toggleItemInCart){
        return(
            <>
            <div className="container"
                style={{
                    width: '100%',
                    display: 'flex', 
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    overflow: 'auto',
                    padding:"20px",
                    backgroundImage: `url(${require('../../Background.png')})`,
                    backgroundSize: '70%',
                    opacity: '85%',
                    filter: 'brightness(85%)',
                    borderRadius: '10px'
                }}>
                <div style={{width: '100%', }}>
                    <div className="row" style={{flexWrap: 'nowrap', filter: "brightness(110%)"}}>
                        <div id="carouselExample" className="carousel slide col-md-4" style={{
                            width: '50%',
                            minWidth:'500px',
                            height: "500px",
                            padding:"10px",
                        }}>
                            <div className="carousel-inner" 
                                style={{
                                    display: 'flex',
                                    width: 'auto',
                                    justifyContent: 'flex-start',
                                    height: 'auto',
                                    marginTop:'-20px'
                                }}>
                                <div className="carousel-item active" style={{
                                    width: '100%',
                                    height: 'auto'
                                }}>
                                    <img src={productDetails.product.images[0]} alt='Product image' 
                                        style={{
                                            width: '100%', 
                                            height: 'auto', 
                                            objectFit: 'fill',
                                            borderRadius: '10px'
                                        }}/>
                                </div>
                                {productDetails.product.images.map(img => {
                                    return (
                                        <div className="carousel-item" style={{
                                            // display: 'flex',
                                            width: '100%',
                                            height: 'auto'
                                        }}>
                                            <img src={img} alt='Product image' 
                                                style={{
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'fill',
                                                    borderRadius: '10px'
                                                }}/>
                                        </div>
                                    )
                                })}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            </button>
                        </div>
                        <div className="col-md-6" style={{}}>
                            <h2>{productDetails.product.brand}</h2>
                            <p style={{height: '200px', overflow: 'auto',}}>{productDetails.product.description}</p>
                            <div>
                                {!toggleItemInCart ? <>
                                {
                                    productDetails.product.inStock===true? 
                                    <p className="btn btn-success disabled" style={{color: '#00ff00'}}>In stock</p> 
                                    : <p className="btn btn-danger disabled" style={{color: '#7f0000'}}>Out of stock</p>
                                }
                                </> : <></>}
                            </div>
                            <span >
                                <Link to={`/user-m/${productDetails.product.merchantDetails._id}`} 
                                    style={{
                                        color: '#0bcbf7', 
                                        textDecoration: 'none',
                                        fontSize:'18px'
                                    }}
                                >
                                    {productDetails.product.merchantDetails.firstName} {productDetails.product.merchantDetails.lastName}
                                </Link>
                            </span>
                            <p style={{fontSize:'20px'}}> ₹ {productDetails.product.price}</p>
                            <div className="row" 
                                style={{
                                    border:'3px solid #8d8d8d',
                                    padding:'3px', 
                                    borderRadius:'10px',
                                    marginBottom:'10px'
                                }}
                            >
                                <h4>Details:</h4>
                                {productDetails.product.specs.map(spec => {
                                    return(
                                        <div>
                                            <div ><strong>{spec.property}</strong>: {spec.value}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'stretch',
                            }}>
                                {productDetails.product.rating.toFixed(2)} 
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="18" 
                                    height="18" 
                                    fill="currentColor" 
                                    class="bi bi-star-fill ms-1" 
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 
                                    6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 
                                    0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 
                                    3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </div>
                            {addToCartButton()}
                            <hr/>
                            {showEditAndDeleteButtons()}
                        </div>
                    </div>
                </div>
                </div>
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                    
                    <div className="footer">
                        <div className="col-md-12" 
                            style={{
                                width: '100%', 
                                display: 'block'
                            }}
                        >
                            Already bought the product? 
                                <Link to={`/product/${productId}/review/new`} 
                                    style={{
                                        color: '#0bcbf7', 
                                        textDecoration: 'none',
                                        marginLeft: '6px'
                                        }}
                                    >Add a review
                                </Link>
                        </div>
                        <br/>
                        <div>
                            {
                                productDetails.reviews[0] ? <>
                                <div className="mb-4"> {productDetails.reviews.length} reviews</div>
                                    
                                <div>{productDetails.reviews.map(review => {
                                    const date = new Date(review.createdAt)
                                    monthNumToName(date)
                                    return (
                                        <div className="row" 
                                            style={{
                                                display: 'flex', 
                                                justifyContent:'start', 
                                                width: '100%'
                                            }}
                                        >
                                            <div className="col-sm-1">
                                                <img src={`${review.author.profilePic}`} alt='...' 
                                                    style={{
                                                        width: '50px', 
                                                        display: 'inline', 
                                                        marginRight: '6px',
                                                        border: '1px solid #909090',
                                                        borderRadius: '3px'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-sm-11">
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <h5 style={{fontWeight: 'bold'}}>{review.title}</h5>
                                                    <p>{date.getDate()}, {date.month} {date.getFullYear()}</p>
                                                </div>
                                                <div style={{height: '50px', overflow: 'auto'}}>{review.text}</div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}>
                                                    {review.productRating} 
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        width="18" 
                                                        height="18" 
                                                        fill="currentColor" 
                                                        class="bi bi-star-fill ms-1" 
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 
                                                        6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 
                                                        0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 
                                                        3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                                    </svg>
                                                </div>
                                                <div style={{
                                                    overflow: 'auto',
                                                }}>
                                                    {review.images.map(image => {
                                                        return(
                                                            <img src={image} alt='' 
                                                                style={{
                                                                    width: '100px', 
                                                                    margin: '5px',
                                                                    border: '2px solid #909090',
                                                                    borderRadius: '5px'
                                                                }}
                                                            />
                                                        )
                                                    })}
                                                </div>
                                                {showEditAndDeleteButtonsReview(review)}
                                                <hr/>
                                            </div>
                                        </div>
                                    )
                                })}</div> </> :
                                    <div> <strong>No reviews yet</strong></div>
                                }
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
                </>
        )
    }
    return(
        <>
            <Loader/>
        </>
    )
}