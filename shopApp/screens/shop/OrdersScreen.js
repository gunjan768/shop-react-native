import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
	View,
	FlatList,
	Text,
	Platform,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => 
{
	const [isLoading, setIsLoading] = useState(false);
	const orders = useSelector(state => state.orders.orders);

	const dispatch = useDispatch();
	
	useEffect(() => 
	{
		setIsLoading(true);

		dispatch(ordersActions.fetchOrders())
		.then(() => 
		{
		  	setIsLoading(false);
		});

	}, [dispatch]);
	
	useLayoutEffect(() => 
	{
		props.navigation.setOptions(configureHeaderBar(props));

	}, [props.navigation]);

	if(isLoading) 
	{
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
	
	if(!orders.length) 
	{
		return (
			<View style={styles.centered}>
				<Text>No order found, maybe start ordering some products?</Text>
			</View>
		);
	}

	return (
		<FlatList
		data={orders}
		keyExtractor={item => item.id}
		renderItem={itemData => (
			<OrderItem
				amount={itemData.item.totalAmount}
				date={itemData.item.readableDate}
				items={itemData.item.items}
			/>
		)}/>
	);
}

const configureHeaderBar = newProps =>
{	
	return (
	{
		headerTitle: 'Your Orders',
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

export default OrdersScreen;