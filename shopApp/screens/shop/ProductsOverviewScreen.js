import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import {
	View,
	Text,
	FlatList,
	Button,
	Platform,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';


const ProductsOverviewScreen = props => 
{
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState(null);

	const products = useSelector(state => state.products.availableProducts);
	
	const dispatch = useDispatch();

	const loadProducts = useCallback(async () => {

		console.log("l1");

		setError(null);
		setIsRefreshing(true);
	
		try
		{
			await dispatch(productsActions.fetchProducts());

			// loader will be shown once only when you visit this page first time else you will never see loader. You can change this 
			// by setting isLoading to true again.
			setIsLoading(false);
			
			// console.log("Products");
		} 
		catch(error) 
		{
		  	setError(error.message);
		}

		setIsRefreshing(false);

	}, [dispatch, setIsLoading, setError]);
	
	useEffect(() => {

		// console.log("pahele");

		// This is the event listener. There are many events which gets fired as per their structure and some of them are :
		// 'focus' - This event is emitted when the screen comes into focus, 'blur' - This event is emitted when the screen goes out of focus,
		// 'state (advanced)' - This event is emitted when the navigator's state changes.
		const unsubscribe =  props.navigation.addListener('focus',loadProducts);
		
		// console.log("baad me");

		return unsubscribe;

	}, [loadProducts]);
	
	// useEffect(() => {

	// 	setIsLoading(true);
	// 	console.log("load");
	// 	// This will return promise as we used async keyword in loadProducts.
	// 	loadProducts()
	// 	.then(() => 
	// 	{
	// 		setIsLoading(false); console.log("load then");
	// 	});

	// }, [dispatch, loadProducts]);

	const selectItemHandler = (id, title) => {

		props.navigation.navigate('ProductDetail', 
		{
			productId: id,
			productTitle: title
		});
	};

	useLayoutEffect(() => 
	{
		props.navigation.setOptions(configureHeaderBar(props));

	}, [props.navigation]);

	if(error) 
	{
		return (
			<View style={styles.centered}>
				<Text>An error occurred!</Text>
				<Button
					title="Try again"
					onPress={loadProducts}
					color={Colors.primary}
				/>
			</View>
		);
	}

	if(isLoading) 
	{
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
	
	if(!isLoading && !products.length) 
	{
		return (
			<View style={styles.centered}>
				<Text>No products found. Maybe start adding some!</Text>
			</View>
		);
	}

	// console.log("Last");

	return (
		<FlatList
		onRefresh={loadProducts}
		refreshing={isLoading}
		data={products}
		keyExtractor={item => item.id}
		renderItem={itemData => (
			<ProductItem
				image={itemData.item.imageUrl}
				title={itemData.item.title}
				price={itemData.item.price}
				onSelect={() => {
					selectItemHandler(itemData.item.id, itemData.item.title);
				}}
			>
				<Button
					color={Colors.primary}
					title="View Details"
					onPress={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}
				/>
				<Button
					color={Colors.primary}
					title="To Cart"
					onPress={() => {
						dispatch(cartActions.addToCart(itemData.item));
					}}
				/>
			</ProductItem>
		)}
		/>
	);
}

const configureHeaderBar = newProps =>
{	
	return (
	{
		headerTitle: 'All Products',
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => {
						newProps.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Cart"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => {
						newProps.navigation.navigate('Cart');
					}}
				/>
			</HeaderButtons>
		)
	});
}

const styles = StyleSheet.create(
{
	centered: 
	{ 
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center' 
	}
})

export default ProductsOverviewScreen;