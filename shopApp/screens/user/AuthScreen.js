import React, { useState, useEffect, useReducer, useCallback, useLayoutEffect } from 'react';
import {
	ScrollView,
	View,
	KeyboardAvoidingView,
	StyleSheet,
	Button,
	ActivityIndicator,
	Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => 
{
	if(action.type === FORM_INPUT_UPDATE) 
	{
		const updatedValues = 
		{
			...state.inputValues,
			[action.input]: action.value
		};

		const updatedValidities = 
		{
			...state.inputValidities,
			[action.input]: action.isValid
		};

		let updatedFormIsValid = true;

		for(const key in updatedValidities)
		updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
	
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues
		};
	}

	return state;
}

const AuthScreen = props => 
{ 
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [isSignup, setIsSignup] = useState(false);

	const dispatch = useDispatch();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: ''
		},
		inputValidities: {
			email: false,
			password: false
		},
		formIsValid: false
	});

	useEffect(() => 
	{
		if(error) 
		Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);

	}, [error]);

	const authHandler = async () => 
	{
		let action;

		if(isSignup) 
		{
			action = authActions.signup(
						formState.inputValues.email,
						formState.inputValues.password,
						props.route.params.isLoginAllowed
					);
		} 
		else 
		{
			// authActions.login() is an action creator ( more precisely it is an asynchronous action creator ) which is used to have the side
			// effects which is asynchrounous in nature ( here to fetch data and save data to server ). This action creator will return the
			// function instead of an object as an action.
			action = authActions.login(
						formState.inputValues.email,
						formState.inputValues.password,
						props.route.params.isLoginAllowed
					);
		}

		// console.log("Action",action);

		setError(null);
		setIsLoading(true);

		try 
		{
			// console.log("Hello");

			// Here the action ( here action is a function and not an object ) returned by the action creator will get dispatched. Now the
			// action which is a function will execute and will reach to the reducer.
			await dispatch(action);

			// console.log("Hello11");

			props.route.params.isLoginAllowed(true);
		} 
		catch(error) 
		{
			setError(error.message);
			setIsLoading(false);
		}
	}

	const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => 
	{
		dispatchFormState(
		{
			type: FORM_INPUT_UPDATE,
			value: inputValue,
			isValid: inputValidity,
			input: inputIdentifier
		});

	}, [dispatchFormState]);

	useLayoutEffect(() => 
	{
		props.navigation.setOptions(configureHeaderBar(props));

	}, [props.navigation]);

	return (
		<KeyboardAvoidingView
		keyboardVerticalOffset={50}
		style={styles.screen}
		>
			<LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						
						<Input
							id="email"
							label="E-Mail"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Please enter a valid email address."
							onInputChange={inputChangeHandler}
							initialValue=""
						/>

						<Input
							id="password"
							label="Password"
							keyboardType="default"
							secureTextEntry
							required
							minLength={5}
							autoCapitalize="none"
							errorText="Please enter a valid password."
							onInputChange={inputChangeHandler}
							initialValue=""
						/>

						<View style={styles.buttonContainer}>
							{
								isLoading ?
									<ActivityIndicator size="small" color={Colors.primary} />
								: 
									<Button
										title={isSignup ? 'Sign Up' : 'Login'}
										color={Colors.primary}
										onPress={authHandler}
									/>
							}
						</View>

						<View style={styles.buttonContainer}>
							<Button
								title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
								color={Colors.accent}
								onPress={() => {
									setIsSignup(prevState => !prevState);
								}}
							/>
						</View>

					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
}

const configureHeaderBar = newProps =>
{	
	return (
	{
		headerTitle: 'Authenticate'
	});
}

const styles = StyleSheet.create(
{
	screen: 
	{
		flex: 1
	},
	gradient: 
	{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	authContainer: 
	{
		width: '80%',
		maxWidth: 400,
		maxHeight: 400,
		padding: 20
	},
	buttonContainer: 
	{
		marginTop: 10
	}
})

export default AuthScreen;