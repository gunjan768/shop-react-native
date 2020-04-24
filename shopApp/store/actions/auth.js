export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

// AsyncStorage is similar to localStorage but it is available in android and ios i.e with the help of AsyncStorage we can access the
// local storage of android and ios.
import { AsyncStorage } from 'react-native';

let timer;

export const authenticate = (userId, token, expiryTime, isLoginAllowed) => 
{
	return dispatch => 
	{
		dispatch(setLogoutTimer(expiryTime, isLoginAllowed));
		dispatch({ type: AUTHENTICATE, userId: userId, token: token });
	};
}

export const signup = (email, password, isLoginAllowed) =>
{
	return async dispatch => 
	{
		const response = await fetch(
		'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCyhH2XRRxyeEXJ6ZDb65Bv-ga156GjJPs',
		{
			method: 'POST',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
			{
				email: email,
				password: password,
				returnSecureToken: true
			})
		});

		if(!response.ok) 
		{
			const errorResData = await response.json();
			const errorId = errorResData.error.message;

			let message = 'Something went wrong!';

			if(errorId === 'EMAIL_EXISTS') 
			message = 'This email exists already!';
		
			throw new Error(message);
		}

		const resData = await response.json();
		
		console.log(resData);

		// If you don't dispatch the authenticate() function ( which acts as an action creator ) then the function which is retuned from the 
		// action creator ( acts as an action ) will never get executed.
		dispatch(authenticate(
			resData.localId, 
			resData.idToken, 
			parseInt(resData.expiresIn) * 1000,
			isLoginAllowed
		));

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
}

export const login = (email, password, isLoginAllowed) => 
{ 
	// console.log("l1",isLoginAllowed);

	// This anonymous function ( which will be maintained by redux thunk ) receives dispatch and getState as an arguments by the redux thunk.
	// This function acts as an action and will be returned to the AuthScreen.js page. This function will only be returned and will only be
	// executed when this function is dispatched using dispatch function.
	return async dispatch => 
	{
		// console.log("l2");

		const response = await fetch(
		'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCyhH2XRRxyeEXJ6ZDb65Bv-ga156GjJPs',
		{
			method: 'POST',
			headers: 
			{
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(
			{
				email: email,
				password: password,
				returnSecureToken: true
			})
		});

		if(!response.ok) 
		{
			const errorResData = await response.json();
			const errorId = errorResData.error.message;

			let message = 'Something went wrong!';

			if(errorId === 'EMAIL_NOT_FOUND') 
			message = 'This email could not be found!';
			
			else if(errorId === 'INVALID_PASSWORD')
			message = 'This password is not valid!';
			
			throw new Error(message);
		}

		const resData = await response.json();
		
		console.log(resData);

		dispatch(authenticate(
			resData.localId, 
			resData.idToken, 
			parseInt(resData.expiresIn) * 1000,
			isLoginAllowed
		));

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
}

const setLogoutTimer = (expirationTime, isLoginAllowed) => 
{
	return dispatch => 
	{
		timer = setTimeout(() => 
		{
			dispatch(logout());

			isLoginAllowed(false);

		}, expirationTime);
	};
}

export const logout = () => 
{
	clearLogoutTimer();
	AsyncStorage.removeItem('userData');
	
	return { type: LOGOUT };
}

const clearLogoutTimer = () => 
{	
	if(timer)
	clearTimeout(timer);
}

const saveDataToStorage = (token, userId, expirationDate) => 
{
	AsyncStorage.setItem('userData', JSON.stringify(
	{
		token: token,
		userId: userId,
		expiryDate: expirationDate.toISOString()
	}));
}