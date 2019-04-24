import { combineReducers } from 'redux';
import authReducers from './authReducers';
import errorReducer from './errorReducer';
import profileReducers from './profileReducers';

export default combineReducers({
    auth: authReducers,
    error: errorReducer,
    profile: profileReducers
});