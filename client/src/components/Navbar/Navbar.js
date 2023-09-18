import './Navbar.css';
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { bindActionCreators } from 'redux';
import { actionCreator } from '../../state/index.js';
import { notify } from '../Notify/notify';
import {rootRoute} from '../Axios/axiosRoot';
import { useEffect, useState } from 'react';
export const Navbar = () => {
    const navigate = useNavigate()
    const login = useSelector(state => state.login)
    const dispatch = useDispatch()
    const actions = bindActionCreators(actionCreator, dispatch);
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [search, setSearch] = useState('')

    useEffect(()=>{
        rootRoute.get('/')
        .then((res) => setProducts(res.data))
        .catch(err => console.log(err))
    }, [])
    var token =''
    if(login.isLoggedIn){
        token = login.userStatus.token
        rootRoute.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    const renderEndButtons = () => {
        if(login.isLoggedIn){
            if('shopCategory' in login.userStatus.user){
                return (
                    <ul className='navbar-nav mb-lg-0 ' >
                    <li>
                        <div>
                            <Link className='nav-link' to="product/new" style={{display: 'flex', alignItems: 'center'}} data-bs-dismiss="offcanvas" onClick={()=>navigate('/product/new')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-seam me-2" viewBox="0 0 16 16">
  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
</svg>    
                                Add new product
                            </Link>
                        </div>
                    </li>
                        <li className='nav-item '>
                            <div>
                                <Link className='nav-link' to={`/user-m/${login.userStatus.user._id}`} style={{display: 'flex', alignItems: 'center'}} data-bs-dismiss="offcanvas" onClick={()=>navigate(`/user-m/${login.userStatus.user._id}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    width="22" 
                                    height="22" 
                                    fill="currentColor" 
                                    className="bi bi-person me-2" 
                                    viewBox="2 0 16 16"
                                >
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2
                                    2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516
                                    10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
                                    />
                                </svg>
                                    {login.userStatus.user.firstName} {login.userStatus.user.lastName}
                                </Link>
                            </div>
                        </li>
                        <li className='nav-item' >
                            <div style={{display: 'flex', alignItems: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#999999" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                                <button className='nav-link' onClick={()=>logout()} data-bs-dismiss="offcanvas" >Logout</button>    
                            </div>
                        </li>
                    </ul>
                )
            }else{
                return (
                    <ul className='navbar-nav mb-lg-0 ' >
                        <li className='nav-item' >
                            <div >
                                <Link className='nav-link' to={`/user/${login.userStatus.user._id}/cart`} style={{display: 'flex', alignItems: 'flex-start'}} data-bs-dismiss="offcanvas" onClick={()=>navigate(`/user/${login.userStatus.user._id}/cart`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart me-2" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                    Cart
                                </Link>
                            </div>
                        </li>
                        <li className='nav-item' >
                            <div >
                                <Link className='nav-link' to={`/user/${login.userStatus.user._id}`} style={{display: 'flex', alignItems: 'center'}} data-bs-dismiss="offcanvas" onClick={()=>navigate(`/user/${login.userStatus.user._id}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    width="20" 
                                    height="20" 
                                    fill="currentColor" 
                                    className="bi bi-person me-2" 
                                    viewBox="2 1 16 16"
                                >
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2
                                    2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516
                                    10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
                                    />
                                </svg>
                                    {login.userStatus.user.firstName} {login.userStatus.user.lastName}
                                </Link>
                            </div>
                        </li>
                        <li className='nav-item '>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#999999" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                            <button className='nav-link' onClick={()=>logout()} data-bs-dismiss="offcanvas" >Logout</button>    
                            </div>
                        </li>
                    </ul>
                )

            }
        }else{
            return(
                <ul className='navbar-nav d-flex justify-content-end flex-grow-1 pe-3' >
                    <li className='nav-item '>
                        <div>
                            <Link className='nav-link ' to='/login' style={{display: 'flex',alignItems: 'center'}} data-bs-dismiss="offcanvas" onClick={()=>navigate(`/login`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    width="22" 
                                    height="22  " 
                                    fill="currentColor" 
                                    className="bi bi-box-arrow-in-left me-2" 
                                    viewBox="0 0 16 16"
                                >
                                    <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 
                                    0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 
                                    2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"
                                    />
                                    <path fillRule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5
                                     0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                                    />
                                </svg>
                                Login
                            </Link>
                        </div>
                    </li>
                    <li className='nav-item '>
                        <div>
                            <Link className='nav-link ' to='/register' style={{display: 'flex', alignItems:'center'}} data-bs-dismiss="offcanvas" onClick={()=>navigate(`/register`)}>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="22" 
                                    height="22" 
                                    fill="currentColor" 
                                    className="bi bi-person-add me-2" 
                                    viewBox="2 1 16 16"
                                >
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 
                                    1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 
                                    1 -6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 
                                    10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 
                                    9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                                </svg>
                                Register
                            </Link>
                        </div>
                    </li>
                </ul>
            )
        }
    }
    const logout = () =>{
        actions.onLogout('');
        notify('Logged out successfully', 'success')
        rootRoute.defaults.headers.common['Authorization'] = ''
        navigate('/')
    }
    const searchResults = (event) =>{
        event.preventDefault()
        let searchWord = (event.target.value)
        var newFilter = products.filter((product) => {
            return product.brand.toLowerCase().includes(searchWord.toLowerCase());
        })
        if (searchWord === "") {
            setFilteredProducts([]);
        }else{
            setFilteredProducts(newFilter)
        }
    }
    
    return(
        <div className='navbar-parent' style={{marginBottom: '30px'}}>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid collapse navbar-collapse">
                    <img src={require('../../ZumeIT.png')} 
                        style={{
                            width: '150px', 
                            cursor: 'pointer',
                            opacity: '90%',
                            filter: 'brightness(150%)'
                        }} 
                        onClick={()=>navigate('/')}
                    />
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#offcanvasDarkNavbar" 
                        aria-controls="offcanvasDarkNavbar" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div 
                        className="offcanvas offcanvas-end text-bg-dark" 
                        tabIndex="-1" 
                        id="offcanvasDarkNavbar" 
                        aria-labelledby="offcanvasDarkNavbarLabel"
                    >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                            <div className= "nav-link active">ZumeIT</div>
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body" id="navbarSupportedContent">
                        <ul className="navbar-nav flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link className="nav-link" to="/"  data-bs-dismiss="offcanvas" onClick={()=>navigate('/')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        width="20" 
                                        height="20" 
                                        fill="currentColor" 
                                        className="bi bi-house me-2 mb-1" 
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2
                                        8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 
                                        0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707
                                        1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                                        />
                                    </svg>    
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown me-3" >
                                <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded='false' style={{display: 'flex',alignItems: 'center'}}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="18" 
                                        height="18" 
                                        fill="currentColor" 
                                        className="bi bi-inboxes me-2" 
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M4.98 1a.5.5 0 0 0-.39.188L1.54 5H6a.5.5 0 0 1 
                                        .5.5 1.5 1.5 0 0 0 3 0A.5.5 0 0 1 10 5h4.46l-3.05-3.812A.5.5 
                                        0 0 0 11.02 1H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 
                                        2.562A.5.5 0 0 0 1.884 9h12.234a.5.5 0 0 0 .496-.438L14.933 
                                        6zM3.809.563A1.5 1.5 0 0 1 4.981 0h6.038a1.5 1.5 0 0 1 1.172.563l3.7 
                                        4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 10H1.883A1.5 
                                        1.5 0 0 1 .394 8.686l-.39-3.124a.5.5 0 0 1 .106-.374L3.81.563zM.125 
                                        11.17A.5.5 0 0 1 .5 11H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0 .5.5 0 0 
                                        1 .5-.5h5.5a.5.5 0 0 1 .496.562l-.39 3.124A1.5 1.5 0 0 1 14.117 16H1.883a1.5 
                                        1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .121-.393zm.941.83.32 2.562a.5.5 
                                        0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438l.32-2.562H10.45a2.5 2.5 0 0 1-4.9 
                                        0H1.066z"/>
                                    </svg>
                                    Categories
                                </div>
                                <ul className="dropdown-menu mb-3  navbar-nav-scroll" >
                                    <li>
                                        <Link className="dropdown-item" to="/categories/electronics" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/electronics')}>Electronic products</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/books" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/books')}>Books</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/stationary" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/stationary')}>Stationary</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/gaming" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/gaming')}>Gaming</Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>


                                    <li>
                                        <Link className="dropdown-item" to="/categories/beauty" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/beauty')}>Beauty</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/health" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/health')}>Health care</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/fashion" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/fashion')}>Fashion</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/handicrafts" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/handicrafts')}>Handicrafts</Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>


                                    <li>
                                        <Link className="dropdown-item" to="/categories/groceries" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/groceries')}>Groceries</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/kitchen" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/kitchen')}>Kitchen</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/household" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/household')}>Household supplies</Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>


                                    <li>
                                        <Link className="dropdown-item" to="/categories/furniture" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/furniture')}>Furniture</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/home-appliances" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/home-appliances')}>Home appliances</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/garden" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/garden')}>Garden</Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>

                                    
                                    <li>
                                        <Link className="dropdown-item" to="/categories/kids-accs" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/kids-accs')}>Kid's Accessories</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/kids-fashion" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/kids-fashion')}>Kid's Fashion</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/kids-toys" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/kids-toys')}>Toys for children</Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>

                                    
                                    <li>
                                        <Link className="dropdown-item" to="/categories/sports" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/sports')}>Sports</Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item" to="/categories/travel" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/travel')}>Travel</Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>


                                    <li>
                                        <Link className="dropdown-item" to="/categories/industrial" data-bs-dismiss="offcanvas" onClick={()=>navigate('/categories/industrial')}>Industrial and Scientific</Link>
                                    </li>

                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex mt-3 mb-3" role="search">
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search brand name" 
                                aria-label="Search" 
                                value={search} 
                                onChange={e => {
                                    setSearch(e.target.value)
                                    searchResults(e)
                                }}
                            />
                        </form>
                        <div className='nav-item'>
                            <ul className='navbar-nav justify-content-end flex-grow-1 pe-3' style={{
                                width: '100%',
                                backgroundColor: 'rgb(87, 87, 87)',
                                borderRadius: '5px'
                            }}>
                            {
                                filteredProducts.slice(0,5).length !== 0 && (
                                    filteredProducts.map((value) => {
                                        return (
                                            <>
                                            <li className='nav-item' style={{
                                                height:"40px",
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                <Link to={`/product/${value._id}`} 
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'rgb(203, 200, 200)',
                                                        padding: '4px 16px'
                                                    }}
                                                    data-bs-dismiss="offcanvas" onClick={()=>navigate(`/product/${value._id}`)}
                                                >
                                                    {value.brand} 
                                                </Link>
                                            </li>
                                            </>
                                            )
                                        }
                                    )
                                )
                            } 
                            </ul>
                        </div>
                        {renderEndButtons()}
                    </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}