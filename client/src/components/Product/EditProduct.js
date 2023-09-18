import { useEffect, useState, useRef } from "react"
import { rootRoute } from "../Axios/axiosRoot"
import {useNavigate, useParams} from 'react-router-dom'
import { convToBase64 } from '../Helpers/convToBase64'
import {notify} from '../Notify/notify.js'
import { useDispatch, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import { actionCreator } from "../../state"
export const EditProduct = () =>{
    const {productId} = useParams()
    const navigate = useNavigate()
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)
    const [productDetails, setProductDetails] = useState({})
    const [brand, setBrand] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [specs, setSpecs] = useState([{property: '', value: ''}])
    const [productImages, setProductImages] = useState([])
    const [isInStock, setIsInStock] = useState('')
    const [uploadImageLoader, setUploadImageLoader] = useState(false)

    useEffect(()=>{
        if(!login.userStatus.user){
            navigate('/login/merchant')
            notify('You need to be logged in to do that!', 'error')
        }
        rootRoute.get(`/product/${productId}/edit`)
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
                        navigate('/login/merchant')
                    }else{
                        //if reftoken is intact
                        action.onLogout()
                        action.onLogin(data.data)
                        rootRoute.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
                        navigate(`/product/${productId}`)
                        notify('New Id registered!', 'success')
                        notify("Could not edit your details. Try again.", 'error')
                    }
                })
                .catch(err => console.log(err))
            }else{

                setProductDetails(res.data)
                setBrand(res.data.brand)
                setDescription(res.data.description)
                setPrice(res.data.price)
                setSpecs(res.data.specs)
                setProductImages(res.data.images)
                setIsInStock(res.data.inStock)
            }
        })
        .catch(err => console.log(err))
    },[])
    const onChangeProductImage = async (e) => {
        const dataPict = await convToBase64(e.target.files[0])
        setUploadImageLoader(true)
        await rootRoute.post('product/uploadImages', {myFile: dataPict})
        .then(res => {
                setProductImages([...productImages, res.data.secure_url])
                setUploadImageLoader(false)
                notify('Image Uploaded', 'success')
            })
            .catch(err => {
                setUploadImageLoader(false)
                notify(err.toString(), 'error')
            })
    }
    
    const handleSpecsInputChange = (e, index) =>{
        let newSpecs = [...specs]
        newSpecs[index][e.target.name] = e.target.value
        setSpecs(newSpecs)
    }
    const addMore = (e) =>{
        e.preventDefault()
        setSpecs([...specs, {property: '', value: ''}])
    }
    const removeField =(i, e) =>{
        e.preventDefault()
        let newSpecs = [...specs]
        newSpecs.splice(i, 1);
        setSpecs(newSpecs)
    }
    const bottomEl = useRef(null)
    const scrollToBottom = () => {
        bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
    }
    const removeImage = (e, i) => {
        productImages.splice(i, 1)
        setProductImages(productImages => {
            return productImages.filter(value => value!== e.target.value)
        })
    }

    const onSubmit = async (e) =>{
        e.preventDefault()
        var updatedProduct = {
            brand: brand,
            description: description,
            specs: specs,
            images: productImages,
            price: price,
            merchantDetails: productDetails.merchantDetails,
            reviews: productDetails.reviews,
            inStock: isInStock
        }
        await rootRoute.patch(`/product/${productId}/update`, updatedProduct)
        .then(res => {
            notify(res.data.msg, 'success')
            navigate(`/product/${productId}`)
        })
        .catch(err => console.log(err))
    }
    return (
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
                <form onSubmit={onSubmit} style={{
                    padding: '10px',
                    width: '100%',
                    backgroundImage: `url(${require('../../Background.png')})`,
                    backgroundSize: '80%',
                    opacity: '85%',
                    borderRadius: '10px',
                    filter: 'brightness(100%)'                    
                }}>
                    <h3>Edit Product</h3>
                    {productDetails._id ? <></> : 
                        <>
                            <div className="d-flex justify-content-center align-items-center mb-2">
                                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                                <span class="">Loading details...</span>
                            </div>
                        </>
                    }
                    <div className="row">
                            <div className="col-md-6" style={{padding: '10px'}}>
                                <label className="col-form-label mb-2" >Brand:</label>
                                <div className="">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value = {brand}
                                        placeholder='Enter brand name' 
                                        onChange={(e)=>setBrand(e.target.value)}
                                        />
                                </div>
                            </div>
                            <div className="col-md-6 " style={{padding: '10px'}}>
                                <label className="col-form-label mb-2" >Price:</label>
                                <div className="">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value = {price}
                                        placeholder='Enter price'
                                        min='0'
                                        onChange={(e)=>setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        <div className="col-md-12 mb-4" style={{padding: '10px'}}>
                            <label className="col-form-label mb-2" >Description:</label>
                            <div className="">
                                <textarea 
                                    className="form-control" 
                                    rows={3} 
                                    value={description}
                                    placeholder='Enter description' 
                                    onChange={(e)=>setDescription(e.target.value)}
                                    />
                            </div>
                        </div>
                        <div className="col-sm-12 mb-4">
                            <div className="" style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                                <label className="col-sm-2 col-form-label" style={{
                                    height: 'auto',
                                    display: 'block'
                                }}> Specifications: </label>
                                <button className="btn btn-secondary "
                                    style={{
                                        minHeight: '35px',
                                        width: 'auto',
                                        padding: '5px'
                                    }}
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        scrollToBottom()
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width='20'
                                        fill="currentColor" 
                                        class="bi bi-arrow-down" 
                                        viewBox="0 0 16 16"
                                        style={{marginRight: '2px'}}
                                    >
                                        <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 
                                        0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                                    </svg>
                                    Move to bottom
                                </button>
                            </div>
                                
                                <div className="" style={{
                                    maxHeight: '225px',
                                    overflow: 'auto',
                                    gap: '10px',
                                    width: '100%',
                                }}>
                                    {specs.map((element, index) => {
                                        return(
                                            <div key={index} ref={bottomEl} className="ps-2" style={{
                                                width: 'auto',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                marginTop: '10px',
                                                marginBottom: '10px',
                                                gap: '5px'
                                            }}>
                                                <div className="col-sm-5">
                                                    <input 
                                                        type='text'
                                                        placeholder='Property'
                                                        className="form-control col-sm-2"
                                                        name='property'
                                                        value={element.property || ''}
                                                        onChange={(e)=>handleSpecsInputChange(e, index)}
                                                    />
                                                </div>
                                                <div className="col-sm-5">
                                                    <input 
                                                        type ='text'
                                                        placeholder='Value'
                                                        className="form-control col-sm-2"
                                                        name='value'
                                                        value={element.value || ''}
                                                        onChange={(e)=>handleSpecsInputChange(e, index)}
                                                        />
                                                </div>
                                                {
                                                    index ?
                                                    <button onClick={(e)=>removeField(index, e)} className="btn btn-danger btn-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                                            width="16" 
                                                            height="16" 
                                                            fill="currentColor" 
                                                            class="bi bi-trash3" 
                                                            viewBox="0 0 16 16"
                                                            style={{
                                                                marginBottom: '3px',
                                                                // marginRight: '4px'
                                                            }}
                                                            >
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0
                                                            0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1
                                                            h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a
                                                            .5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.
                                                            92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5
                                                            a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.
                                                            5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5
                                                            0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                        </svg>
                                                    </button>
                                                    : <div style={{display:'inline', minWidth: '32px'}}></div>
                                                }
                                        </div>
                                        )
                                    })}
                                </div>
                                <button onClick={(e)=>addMore(e)} className="btn btn-info w-auto">Add more...</button>
                        </div>
                        <div className="col-md-12 mb-3">
                            
                            {
                                uploadImageLoader===true ? 
                                    <div class="d-flex align-items-center">
                                    Uploading Image...
                                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                                </div>

                                : <><label for='mulImages' className="btn btn-info w-auto">Upload pictures</label></>
                            }
                            <input 
                                type="file" 
                                mulitple = 'true'
                                id='mulImages'
                                accept="image/*"
                                hidden
                                onChange={(e)=>{onChangeProductImage(e)}}
                            />
                            <div style={{overflow: 'auto'}}>
                                {
                                    productImages.map((data, index)=>{
                                        return(
                                            <div style={{display: 'inline-flex', flexDirection: 'column', padding: '10px'}}>
                                                <img alt="err" src={data} 
                                                    style={{
                                                        width: '100px', 
                                                        margin: '5px',
                                                        border: '2px solid #909090',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                                <button className="btn btn-danger" 
                                                    onClick={(e)=>{
                                                        e.preventDefault()
                                                        removeImage(e, index)
                                                        notify('Image Removed', 'success')
                                                    }}
                                                >
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        width="16" 
                                                        height="16" 
                                                        fill="currentColor" 
                                                        class="bi bi-x-lg" 
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 
                                                        1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 
                                                        0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div>

                            Is the product currently in stock?
                            <div class="form-check form-check-inline ms-2">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value = 'true' onChange={()=>{
                                    setIsInStock(true)}}/>
                                <label class="form-check-label" for="inlineRadio1">Yes</label>
                                </div>
                                <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value = 'false' onChange={()=>{
                                    setIsInStock(false)}}/>
                                <label class="form-check-label" for="inlineRadio2">No</label>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex', 
                            justifyContent: 'center', 
                            flexDirection: 'column', 
                            gap: '8px',
                        }}>
                            <button type="submit" class="btn btn-primary" 
                                style={{
                                    width: '100%', 
                                    borderRadius: '20px'
                                }}>Update product
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
                </form>
            </div>
        </div>
    )
}