import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';

//parent routes
import { Navbar } from './components/Navbar/Navbar.js';
import { Homepage } from './components/Homepage/Homepage.js';

//auth routes
import { Login } from './components/Auth/Login.js';
import { LoginCustomer } from './components/Auth/LoginCustomer';
import { LoginMerchant } from './components/Auth/LoginMerchant.js';
import { Register } from './components/Auth/Register.js';
import { RegisterCustomer } from './components/Auth/RegisterCustomer.js';
import { RegisterMerchant } from './components/Auth/RegisterMerchant.js';

//producct routes
import { NewProduct } from './components/Product/NewProduct.js';
import {ShowProduct} from './components/Product/ShowProduct.js'
import { EditProduct } from './components/Product/EditProduct';
import { DeleteProduct } from './components/Product/DeleteProduct';

//user routes
import { ShowUserCustomer } from './components/User/UserCustomer/ShowUserCustomer.js';
import { CartUserCustomer } from './components/User/UserCustomer/CartUserCustomer';
import { ShowUserMerchant } from './components/User/UserMerchant/ShowUserMerchant';
import { UploadedProducts } from './components/User/UserMerchant/UploadedProducts';
import { EditUserCustomer } from './components/User/UserCustomer/EditUserCustomer';
import { DeleteUserCustomer } from './components/User/UserCustomer/DeleteUserCustomer';
import { EditUserMerchant } from './components/User/UserMerchant/EditUserMerchant';
import { DeleteUserMerchant } from './components/User/UserMerchant/DeleteUserMerchant';

//review routes
import { NewReview } from './components/Review/NewReview';
import { EditReview } from './components/Review/EditReview';
import { DeleteReview } from './components/Review/DeleteReview';

//misc. routes
import { Checkout } from './components/Checkout/Checkout';
import { OrdersUserCustomer } from './components/User/UserCustomer/OrdersUserCustomer';
import { Categories } from './components/Categories/Categories';

import { ToastContainer } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <Routes>
          {/*Homepage */}
          <Route path='/' element={<Homepage/>}/>
          
          {/*Auth */}
          <Route path='/register' element={<Register/>}/>
          <Route path='/register/customer' element={<RegisterCustomer/>}/>
          <Route path='/register/merchant' element={<RegisterMerchant/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/login/customer' element={<LoginCustomer/>}/>
          <Route path='/login/merchant' element={<LoginMerchant/>}/>

          {/*User Customer*/}
          <Route path='/user/:userId' element={<ShowUserCustomer/>}/>
          <Route path='/user/:userId/edit' element={<EditUserCustomer/>}/>
          <Route path='/user/:userId/orders' element={<OrdersUserCustomer/>}/>
          <Route path='/user/:userId/cart' element={<CartUserCustomer/>}/>
          <Route path='/user/:userId/delete' element={<DeleteUserCustomer/>}/>
          
          {/*User Merchant*/}
          <Route path='/user-m/:userId' element={<ShowUserMerchant/>}/>
          <Route path='/user-m/:userId/edit' element={<EditUserMerchant/>}/>
          <Route path='/user-m/:userId/uploaded-products' element={<UploadedProducts/>}/>
          <Route path='/user-m/:userId/delete' element={<DeleteUserMerchant/>}/>

          {/*Categories */}
          <Route path='/categories/:productCategory' element={<Categories/>}/>
          
          {/*Product */} 
          <Route path='/product/new' element={<NewProduct/>}/>
          <Route path='/product/:productId' element={<ShowProduct/>}/>
          <Route path='/product/:productId/edit' element={<EditProduct/>}/>
          <Route path='/product/:productId/delete' element={<DeleteProduct/>}/>
          
          {/*Checkout */}
          <Route path='/user/:userId/checkout' element={<Checkout/>}/>
          
          {/*Reviews */}
          <Route path='/product/:productId/review/new' element={<NewReview/>}/>
          <Route path='/product/:productId/review/:reviewId/edit' element={<EditReview/>}/>
          <Route path='/product/:productId/review/:reviewId/delete' element={<DeleteReview/>}/>

        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;
