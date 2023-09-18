import {useEffect, useState, } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import {convToBase64} from '../Helpers/convToBase64.js'
import {rootRoute} from '../Axios/axiosRoot.js'
import {notify} from '../Notify/notify.js'
import { bindActionCreators } from 'redux';
import { actionCreator } from '../../state/index.js';
export const NewReview = () =>{
    const navigate = useNavigate()
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    const action = bindActionCreators(actionCreator, dispatch)
    const {productId} = useParams()
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [images, setImages] = useState([])
    const [rating, setRating] = useState(0)
    const [uploadImageLoader, setUploadImageLoader] = useState(false)

    useEffect(()=>{
        if(!login.isLoggedIn){
            navigate('/login')
            notify('You need to be logged in to do that!', 'error')
        }
    }, [])

    const uploadImage = async(e) =>{
        const dataPict = await convToBase64(e.target.files[0])
        setUploadImageLoader(true)
        await rootRoute.post(`/product/${productId}/review/uploadImages`, {myFile: dataPict})
        .then(res => {
            setUploadImageLoader(false)
            notify('Image Uploaded!', 'success')
            setImages([...images, res.data.secure_url])
        })
        .catch(err => {
            setUploadImageLoader(false)
            notify(err.toString(), 'error')
        })
    }
    const onSubmit=async (e) =>{
        e.preventDefault()
        const newReview = {
            title: title,
            text: desc,
            images: images,
            productId: productId,
            productRating: rating,
            author: login.userStatus.user,
            upVote: 0,
            downVote: 0,
        }
        await rootRoute.post(`/product/${productId}/review/new`, newReview)
        .then(res => {
            if(res.data.msg === 'Token expired!'){
                notify('Id expired', 'error')
                rootRoute.post('/login/refToken', login.userStatus)
                .then(data => {

                    if(data.data.msg === 'RefToken expired'){
                        rootRoute.post('/login/deleteRefToken', login.userStatus)
                        .then(data => console.log(data))
                        .catch(err  => console.log(err))
                        notify('Error occured! Login required', 'error')
                        navigate('/login')
                    }else{
                        action.onLogout()
                        action.onLogin(data.data)
                        rootRoute.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
                        navigate(-1)
                        notify('New Id registered!', 'success')
                        notify("Could not submit your post. Try again.", 'error')
                    }
                })
                .catch(err => console.log(err))
            }else{
                notify(res.data.msg, 'success')
                navigate(`/product/${productId}`)
            }
        })
        .catch(res => notify(res.data.err, 'error'))
    }
    const removeImage = (e, i) => {
        images.splice(i, 1)
        setImages(images => {
            return images.filter(value => value!== e.target.value)
        })
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
                    <h3>Add review</h3>
                    <div class="form-floating mb-3">
                        <input 
                            type="text" 
                            class="form-control" 
                            id="floatingInput"
                            placeholder='Enter title'
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            required
                            />
                        <label for="floatingInput">Title</label>
                    </div>
                    <div class="form-floating">
                        <textarea 
                            class="form-control" 
                            id="floatingTextarea2"
                            placeholder='Enter text'
                            value={desc}
                            onChange={(e)=>setDesc(e.target.value)}
                            style={{height: '100px'}}
                            required
                            >
                        </textarea>
                        <label for="floatingTextarea2">Description</label>
                    </div>
                    <div className='mb-3 mt-3'>
                        {
                            uploadImageLoader===true ? 
                            <div class="d-flex align-items-center"
                            style={{
                                backgroundColor: 'rgba(0,0,0,.4)', 
                                padding:'6px 10px', 
                                borderRadius:'100px'
                            }}>
                                Uploading Image...
                                <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                            </div>

                            : <label for='review images' className='btn btn-info w-auto' style={{cursor: 'pointer'}}>Upload images</label>

                        }
                        <input 
                            type='file' 
                            className='form-control' 
                            id='review images' 
                            accept='image/*' 
                            multiple='true' 
                            hidden='true'
                            onChange={(e)=>{uploadImage(e)}}
                            />
                            <div className='row'>
                                <div style={{overflow: 'auto'}}>
                                {
                                    images.map((data, index)=>{
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
                    </div>
                    <div class="form-floating mb-3">
                        <input 
                            type="number" 
                            class="form-control" 
                            id="floatingInput" 
                            min='0'
                            max='5'
                            placeholder='Rate product'
                            value={rating}
                            onChange={(e)=>setRating(e.target.value)}
                            />
                        <label for="floatingInput">Rate product</label>
                    </div>
                    <div 
                        style={{
                            display: 'flex', 
                            justifyContent: 'center', 
                            flexDirection: 'row', 
                            gap: '15px',
                    }}>
                        <button type="submit" class="btn btn-primary" 
                            style={{
                                width: '100%', 
                                borderRadius: '20px'
                            }}>Add review
                        </button>
                        <button class="btn btn-danger" onClick={()=>navigate(-1)} 
                            style={{
                                width: '100%', 
                                borderRadius: '20px'
                            }} >Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}