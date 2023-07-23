import {useState, useEffect} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import {rootRoute} from '../Axios/axiosRoot.js'

export const Categories = () =>{
    const navigate = useNavigate()
    const {productCategory} = useParams()
    const [particularProducts, setParticularProducts] = useState([])
    useEffect(() => {
        rootRoute.get(`/category/${productCategory}`)
        .then(res => {
            setParticularProducts(res.data)})
        .catch(err => console.log(err))
    }, [productCategory])
    console.log(particularProducts)
    const showAllProducts = () =>{
        return(
            <div className="container">
            <div >
              <div class="row">
              {particularProducts.map(product => {
                return (
                  <div className="col-sm-4">
                    <div className="product" onClick={()=>navigate(`/product/${product._id}`)} style={{cursor: 'pointer'}}>
                      <img src={`${product.images[0]}`}  alt="No image" style={{width: '100%', height: '90%', borderRadius: '5px'}}/>
                      <div className="p-1" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{color: 'black'}}>{product.brand}</div>
                        <div style={{color: 'black', position: 'sticky'}}>₹ {product.price}</div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
            <div className="row"></div>
          </div>
        )
    }
    if(particularProducts[0]){
        return(
            <>
                <div>
                    {showAllProducts()}
                </div>
            </>
        )
    }else{
        return (
            <div className="d-flex justify-content-center align-items-center" style={{gap: '10px', marginTop: '100px '}}>
                <div class="spinner-border spinner-border-sm" role="status"></div>
                Loading 
            </div>
        )
    }
}