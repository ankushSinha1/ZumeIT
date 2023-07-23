import { Link } from "react-router-dom"

export const Register = () =>{
    return (
        <div className='container'>
            <div className='row col-12'>
                <div>
                    <Link to ="/register/customer" className='btn btn-info btn-lg'>Register as a customer</Link>
                </div>
                <div>
                    <Link to ="/register/merchant" className='btn btn-info btn-lg'>Register as a merchant</Link>
                </div>
            </div>
        </div>
    )

}