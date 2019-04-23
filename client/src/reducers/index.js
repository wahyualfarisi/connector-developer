import { combineReducers } from 'redux';
import authReducers from './authReducers';
import errorReducer from './errorReducer';

export default combineReducers({
    auth: authReducers,
    error: errorReducer
});