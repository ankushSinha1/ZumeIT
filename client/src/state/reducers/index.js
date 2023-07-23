import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
const reducer = combineReducers({
    login: loginReducer
})
export default reducer;