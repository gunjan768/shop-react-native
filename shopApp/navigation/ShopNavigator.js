import React,{ useState, useEffect } from 'react';

import { Platform, SafeAreaView, Button, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from '@react-navigation/drawer';

import { Drawer } from 'react-native-paper';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import Colors from '../constants/Colors';
import StartupScreen from '../screens/StartupScreen';
import AuthScreen from '../screens/user/AuthScreen';
import * as authActions from '../store/actions/auth';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


const ProductStack = createStackNavigator();
const OrderStack = createStackNavigator();
const AdminStack = createStackNavigator();
const AuthStack = createStackNavigator();

const Drawers = createDrawerNavigator();


const defaultStackNavOptions = (navigation, route) => 
{
	return (
	{	
		// headerTitle: "Home Screen", 
		headerStyle: 
		{
			backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
		},
		headerTintColor: Platform.OS === 'android' ? 'black' : Colors.primaryColor,
		headerTitleStyle: 
		{
			fontFamily: 'open-sans-bold'
		},
		headerBackTitleStyle: 
		{
			fontFamily: 'open-sans'
		},
		// drawerIcon: drawerConfig => (
		// 	<Ionicons
		// 		name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
		// 		size={23}
		// 		color={drawerConfig.tintColor}
		// 	/>
		// )
	})
}

const CustomDrawerContent = props =>
{
	const dispatch = useDispatch();

	return (
		<DrawerContentScrollView { ...props }>
			<View style={{ flex: 1, paddingTop: 20 }}>
				<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>

					<Drawer.Section>
						<DrawerItem
							icon = 
							{
								({ color, size }) => (
									<Ionicons
										name = { Platform.OS === 'android' ? 'md-cart' : 'ios-cart' }
										size = { size }
										color = { color }
									/>
								)
							}
							label="See your Cart"
							onPress={() => {}}
							activeBackgroundColor="green"
						/>
					</Drawer.Section>
					
					{
						// DrawerItemList is used for the default screens that we set as screen option.
					}

					<DrawerItemList { ...props } />

					<Button
						title="Logout"
						color = { Colors.primary }
						onPress = 
						{ 
							() => 
							{ 
								dispatch(authActions.logout()) 

								props.isLoginAllowed(false);
							}
						}
					/>

				</SafeAreaView>
			</View>
		</DrawerContentScrollView>
	);
}

const ProductsNavigator = props =>
{
	return (
		<ProductStack.Navigator 
			initialRouteName="ProductsOverview"
			screenOptions = { ({navigation, route}) => 
			{
				return defaultStackNavOptions(navigation, route)
			}}
		>
			<ProductStack.Screen name="ProductsOverview" component = { ProductsOverviewScreen }/>
			<ProductStack.Screen name="ProductDetail" component = { ProductDetailScreen }/>
			<ProductStack.Screen name="Cart" component = { CartScreen }/>

		</ProductStack.Navigator>
	);
}

const OrdersNavigator = props =>
{
	return (
		<OrderStack.Navigator 
			initialRouteName="Orders"
			screenOptions = { ({navigation, route}) => 
			{
				return defaultStackNavOptions(navigation, route);
			}}
		>
			<OrderStack.Screen name="Orders" component = { OrdersScreen }/>
		</OrderStack.Navigator>
	);
}

const AdminNavigator = props =>
{
	return (
		<AdminStack.Navigator 
			initialRouteName="UserProducts"
			screenOptions = { ({navigation, route}) => 
			{
				return defaultStackNavOptions(navigation, route);
			}}
		>
			<AdminStack.Screen name="UserProducts" component = { UserProductsScreen }/>
			<AdminStack.Screen name="EditProduct" component = { EditProductScreen }/>
		</AdminStack.Navigator>
	);
}

const ShopNavigator = props =>
{
	return (
		<Drawers.Navigator
			initialRouteName="Products"
			drawerStyle =
			{{
				backgroundColor: '#c6cbef',
				width: 240,
			}}
			drawerContentOptions =
			{{
				activeTintColor: "#e91e63",
				labelStyle: 
				{
					fontFamily: 'open-sans-bold'
				}
			}}
			drawerType='slide'
			overlayColor="transparent"
			screenOptions = { ({navigation, route}) => 
			{
				useEffect(() =>
				{
					navigation.setParams({ isLoginAllowed : props.isLoginAllowed })
				},[navigation])
			}}
			drawerContent = { prop => <CustomDrawerContent {...prop } { ...props } /> }
		>

			<Drawers.Screen 
				name="Products"  
				component = { ProductsNavigator }
				options = 
				{{ 
					drawerLabel: 'Products Screen',
					drawerIcon: drawerConfig => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
							size={23}
							color={drawerConfig.tintColor}
						/>
					),
					
				}}
			/>
			<Drawers.Screen 
				name="Orders" 
				component = { OrdersNavigator } 
				options = 
				{{ 
					drawerLabel: 'Orders Screen',
					drawerIcon: drawerConfig => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
							size={23}
							color={drawerConfig.tintColor}
						/>
					)
				}} 
			/>
			<Drawers.Screen 
				name="Admin" 
				component = { AdminNavigator } 
				options = 
				{{ 
					drawerLabel: 'Admin Screen',
					drawerIcon: drawerConfig => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
							size={23}
							color={drawerConfig.tintColor}
						/>
					) 
				}} 
			/>
		</Drawers.Navigator>
	);
}

const AuthNavigator = props =>
{
	return (
		<AuthStack.Navigator 
			initialRouteName="ProductsOverview"
			screenOptions = { ({navigation, route}) => 
			{
				return defaultStackNavOptions(navigation, route);
			}}
		>
			<AuthStack.Screen 
				name="Auth" 
				component = { AuthScreen } 
				initialParams = {{ isLoginAllowed : props.isLoginAllowed }} 
			/>

		</AuthStack.Navigator>
	); 
}


const MixtureComponents = props =>
{
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const loginHandler = value =>
	{
		setIsLoading(false);
		setIsLoggedIn(value);
	}

	return (
		isLoading  ? 
			(
				<StartupScreen  isLoginAllowed = { loginHandler }/> 
			)
		:
			isLoggedIn ? 
				( 	<NavigationContainer >
						<ShopNavigator isLoginAllowed = { loginHandler }/> 
					</NavigationContainer>
				)
			:
				(	<NavigationContainer >
						<AuthNavigator isLoginAllowed = { loginHandler }/>
					</NavigationContainer>
				)
			
	);

}

export default MixtureComponents;