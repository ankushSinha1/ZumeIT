import {Link} from 'react-router-dom';
import './Login.css'
export const Login = () => {
    return (
        <div className='container'>
            <div className='row col-12'>
                <div>
                    <Link to ="/login/customer" className='btn btn-info btn-lg'>Login as a customer</Link>
                </div>
                <div>
                    <Link to ="/login/merchant" className='btn btn-info btn-lg'>Login as a merchant</Link>
                </div>
            </div>
        </div>
    )
}