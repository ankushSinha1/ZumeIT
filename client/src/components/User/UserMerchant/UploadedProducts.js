import {useEffect, useState} from 'react'
import { rootRoute } from '../../Axios/axiosRoot'
import { Link, useParams } from 'react-router-dom'
import {notify} from '../../Notify/notify'
export const UploadedProducts = () => {
    const {userId} = useParams()
    const [allProducts, setAllProducts] = useState([])
    useEffect(()=>{
        rootRoute.get(`/product/${userId}/products-uploaded`)
        .then(res => setAllProducts(res.data))
        .catch(err => notify(err, 'error'))
    }, [])
    console.log(allProducts)
    return(
        <div className='container' style={{display: 'flex', justifyContent: 'center', padding: '25px'}}>
            <div className='row p-4'>
            <h2>All uploaded products</h2>
                <div className='col-sm-12'>
                    {allProducts.map(product => {
                        return (
                            <div>
                            <div className='row'  style={{padding: "10px"}}>
                                <div className='col-md-2' style={{padding: '5px'}}>
                                    <Link to={`/product/${product._id}`}>
                                        <img src={product.images[0]} alt='Product image' style={{width: '100%', borderRadius: '10px'}}/>
                                    </Link>
                                </div>
                                <div className='col-md-10'>
                                    <h3>{product.brand}</h3>
                                    <p>{product.description.substr(0, 100)}...</p>
                                    <div className='mb-3'>₹ {product.price}</div>
                                    <div>
                                        {product.inStock ? 
                                            <button className='btn btn-success disabled' style={{color: '#00ff00'}}>In stock</button>
                                            : <button className='btn btn-danger disabled' style={{color: '#7f0000'}}>Out of stock</button>
                                        }
                                    </div>
                                </div>
                            </div>
                                <hr/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}