import React, { useEffect, useCallback, useReducer, useLayoutEffect, useState } from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	Platform,
	Alert,
	KeyboardAvoidingView,
	ActivityIndicator
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {

	if(action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid
		};
		let updatedFormIsValid = true;
		for(const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues
		};
	}
	return state;
}

const EditProductScreen = props => {

	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	let editedProduct = null;

	// If there is no product with the given id ( editedProduct = undefined ) then it means we have entered here regarding creation 
	// of new product and not for editing the existing product.
	let prodId = props.route.params ? ( props.route.params.productId ? props.route.params.productId : null ) : null ;
	
	if(props.route.params && props.route.params.productId) {
		editedProduct = useSelector(state =>
			state.products.userProducts.find(prod => prod.id === prodId)
		);
	}

	const dispatch = useDispatch();
	
	// userReducer() is the reducer function maintained by React and works same as Redux-reducer. It return an array of exactly two 
	// elements same as useState(). useReducer() takes two arguments : 1st --> reducer function , 2nd --> initial state.
	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editedProduct ? editedProduct.title : '',
			imageUrl: editedProduct ? editedProduct.imageUrl : '',
			description: editedProduct ? editedProduct.description : '',
			price: ''
		},
		inputValidities: {
			title: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			description: editedProduct ? true : false,
			price: editedProduct ? true : false
		},
		formIsValid: editedProduct ? true : false
	});

	useEffect(() => {

		if(error)
		Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
		
	}, [error]);

	const submitHandler = useCallback(async () => {
		
		if(!formState.formIsValid) {
			Alert.alert('Wrong input!', 'Please check the errors in the form.', [
				{ text: 'Okay' }
			]);
			return;
		}

		setError(null);
		setIsLoading(true);
		
		try 
		{
			if(editedProduct) {
				console.log(formState.inputValues.title);
				dispatch(productsActions.updateProduct(
					prodId,
					formState.inputValues.title,
					formState.inputValues.description,
					formState.inputValues.imageUrl
				));
			} 
			else {
				dispatch(productsActions.createProduct(
					formState.inputValues.title,
					formState.inputValues.description,
					formState.inputValues.imageUrl,
					+formState.inputValues.price
				));
			}
	
			props.navigation.goBack();

		} 
		catch(error) 
		{
      		setError(err.message);
    	}
		
		setIsLoading(false);

	}, [dispatch, formState]);

	useEffect(() => {

		props.navigation.setParams({ submit: submitHandler });

	}, [submitHandler]);


	// inputChangeHandler executes while you are in writing mode and once touched the current input box. Value from Input.js comes here
	// and we update our state with this value. 
	const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => 
	{ 	
		// console.log("inp",inputValue);

		dispatchFormState({
			type: FORM_INPUT_UPDATE,
			value: inputValue,
			isValid: inputValidity,
			input: inputIdentifier
		});
	},[dispatchFormState]);

	useLayoutEffect(() => 
	{
		props.navigation.setOptions(configureHeaderBar(props));

	}, [props.route.params]);

	if(isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			// behavior="padding"
			keyboardVerticalOffset={30}
		>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id="title"
						label="Title"
						errorText="Please enter a valid title!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.title : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						id="imageUrl"
						label="Image Url"
						errorText="Please enter a valid image url!"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.imageUrl : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					{
						editedProduct ? null : (
							<Input
								id="price"
								label="Price"
								errorText="Please enter a valid price!"
								keyboardType="decimal-pad"
								returnKeyType="next"
								onInputChange={inputChangeHandler}
								required
								min={0.1}
							/>
						)
					}
					<Input
						id="description"
						label="Description"
						errorText="Please enter a valid description!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.description : ''}
						initiallyValid={!!editedProduct}
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const configureHeaderBar = newProps =>
{	
	return (
	{
		headerTitle: newProps.route.params != undefined ? 
						newProps.route.params.productId != undefined ? 'Edit Product' : 'Add Product'
					:
						'Add Product'
					,
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Save"
					iconName={
						Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
					}
					onPress = 
					{ 
						newProps.route.params != undefined ? 
							newProps.route.params.submit != undefined ?
								newProps.route.params.submit
							: 
								console.log("Sorry for this approach again")
						:
							console.log("Sorry for this approach") 
					}
				/>
			</HeaderButtons>
		)
	});
}

const styles = StyleSheet.create({
	form: {
		margin: 20
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default EditProductScreen;