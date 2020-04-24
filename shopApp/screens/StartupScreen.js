import React, { useEffect } from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet,
	AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => 
{
	const dispatch = useDispatch();

	// It's dangerous to use async keyword before useEffect parenthesis or you can't just use the async keyword so we created a new 
	// function ( tryLogin ) so that we can async keyword.
	useEffect(() => 
	{
		const tryLogin = async () => 
		{
			const userData = await AsyncStorage.getItem('userData');

			if(!userData) 
			{
				props.isLoginAllowed(false);

				return;
			}

			const transformedData = JSON.parse(userData);
			const { token, userId, expiryDate } = transformedData;
			const expirationDate = new Date(expiryDate);

			if(expirationDate <= new Date() || !token || !userId) 
			{
				props.isLoginAllowed(false);

				return;
			}

			const expirationTime = expirationDate.getTime() - new Date().getTime();

			props.isLoginAllowed(true);

			dispatch(authActions.authenticate(userId, token, expirationTime));
		};

		tryLogin();

	}, [dispatch]);

	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
};

const styles = StyleSheet.create(
{
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default StartupScreen;