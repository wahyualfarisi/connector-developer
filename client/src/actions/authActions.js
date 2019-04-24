import { GET_ERRORS ,SET_CURRENT_USER} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';



//register user  
export const registerUser = (userData, history) => {
   return dispatch => {
       axios.post('/api/users/register', userData)
            .then(res => history.push('/login'))
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            })
   }
}

export const loginUser = userData => {
    return dispatch => {
        axios.post('/api/users/login', userData)
            .then(res => {
                //save to localstorage
                const { token } = res.data;

                //set token to localstorage
                localStorage.setItem('jwtToken', token);

                //set auth header
                setAuthToken(token);

                //decode token to get user data
                const decode = jwt_decode(token);

                //set current user
                dispatch(setCurrentUser(decode));
                

            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            })
    }
}

//set logged in user
export const setCurrentUser = decode => {
    return {
        type: SET_CURRENT_USER,
        payload: decode
    }
}

export const setLogout = () => {
    return dispatch => {
        
        //remove item in localstorage
        localStorage.removeItem('jwtToken');

        //remove auth header for feature request 
        setAuthToken(false) // because if paramater is null / false , authorization will deleted

        //set current user to {} or empty object which will set isAuthenticated to false 
        dispatch(setCurrentUser({}))

    }
}