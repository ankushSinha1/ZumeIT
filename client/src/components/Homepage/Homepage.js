import { useEffect, useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import {rootRoute} from "../Axios/axiosRoot.js";
import './Homepage.css'
export const Homepage = () => {
  const navigate = useNavigate()
    const [allProducts, setAllProducts] = useState([]);
    useEffect(()=>{
        rootRoute.get('/')
        .then(res =>setAllProducts(res.data))
        .catch(err => console.log(err))
    }, [])
    if(allProducts[0]){
        return(
          <div className="container">
            <div >
              <div className="row">
              {allProducts.map(product => {
                return (
                  <div className="col-sm-4" key={product._id}>
                    <div className="product" style={{}} onClick={()=>navigate(`/product/${product._id}`)}>
                      <img src={`${product.images[0]}`}  alt="No image" style={{width: '100%', height: '90%', borderRadius: '5px'}}/>
                      <div className="p-1" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{textDecoration: 'none', color: 'black'}}>{product.brand}</div>
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
    }else{
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '50px '}}>
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Loading 
          </div>
        )
    }
}