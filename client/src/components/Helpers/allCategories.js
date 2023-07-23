import { Link } from "react-router-dom";
export const allCategories = ( ) => {
    const allCategoriesWithParams = {
        'electronics' : 'Electronic products',
        'books' : 'Books',
        'stationary': 'Stationary',
        'gaming': 'Gaming',
        'beauty' : 'Beauty',
        'health' :'Health care',
        'fashion': 'Fashion',
        'handicrafts' : 'Handicrafts',
        'groceries' : 'Groceries',
        'kitchen' : 'Kitchen',
        'household' : 'Household supplies',
        'furniture' : 'Furniture',
        'home-appliances' : 'Home appliances',
        'garden' : 'Garden',
        'kids-accs' : "Kid's Accessories",
        'kids-fashion' : "Kid's Fashion",
        'kids-toys' : 'Toys for children',
        'sports' : 'Sports',
        'travel' : 'Travel',
        'industrial' : 'Industrial and Scientific',
    }
    return(
        Object.keys(allCategoriesWithParams).forEach( (key, index) => {
            return(
                <>
                {console.log('asdas')}
                    <li><Link className="dropdown-item" to={`/categories/${key}`}>{allCategoriesWithParams[key]}</Link></li>
                </>
            )
        })
    )
}