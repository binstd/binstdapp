import React from 'react';
import { Alert, LayoutAnimation, KeyboardAvoidingView, StyleSheet, Text, View, Dimensions, TouchableOpacity, AsyncStorage, Image, StatusBar } from 'react-native';
import { Input, Button } from 'react-native-elements'
import { observer } from 'mobx-react/native';
import userModel from '../model/user_model';

import { createWalletKey, getWalletAddress, importWalletKey, getWalletPrivateKey } from '../utils/wallet';
import { SERVER_URL, LOGO_URL } from '../utils/config/setting';
import queryString from 'query-string';
import { onSignIn } from "../auth";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../style/img/icon500.png');
export default Login = observer(class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			address: '',
			privatekey: '',
			selectedCategory: 0,
			telephone: '',
			password: '',
			passwordConfirmation: '',
			login_failed: false,
			isLoading: false,
			isTelephoneValid: true,
			isPasswordValid: true,
			isConfirmationValid: true,
		};
	}

	//登录
	SignIn() {
		const {
			telephone,
			password
		} = this.state;

		if (!this.validateTelephone(telephone) || password.length < 8) {
			this.setState({
				isLoading: false,
				isTelephoneValid: this.validateTelephone(telephone),
				isPasswordValid: password.length >= 8,
			});
			return;
		}
		const post_data = { 'telephone': telephone, 'password': password };
		this.setState({ isLoading: true });
		fetch(`${SERVER_URL}/api/signin`, {
			method: 'POST',
			body: JSON.stringify(post_data), // stringify JSON
			headers: new Headers({ "Content-Type": "application/json" }) // add headers
		}).then(res => res.json()).then(data => {
			this.setState({
				isLoading: false,
			});
			if (data['status'] == 1) {
				onSignIn(data['data']).then(() => this.props.navigation.navigate("SignedIn"));
			} else {
				Alert.alert('', data['message'],
					[{ text: "好的", onPress: this.confirm }]
				);
			}
			return data;
		});
	}

	// 注册
	async SignUp() {
		const {
			telephone,
			password,
			passwordConfirmation,
		} = this.state;

		if (!this.validateTelephone(telephone) || password.length < 8 || password != passwordConfirmation) {

			this.setState({
				isLoading: false,
				isTelephoneValid: this.validateTelephone(telephone),
				isPasswordValid: password.length >= 8,
				isConfirmationValid: password == passwordConfirmation
			});
			return;
		}

		await createWalletKey();
		let address = await getWalletAddress();
		let privatekey = await getWalletPrivateKey();

		let userData = {
			telephone,
			password,
			privatekey,
			address
		};
		userModel.allSet(userData);
		this.props.navigation.navigate(
			"VerifyLogin",
			{
				password: password
			}
		);
	}

	validateTelephone(telephone) {
		var re = /^1\d{10}$/;
		return re.test(telephone);
	}

	onChangeTelephone(telephone) {
		this.setState({
			telephone,
			isTelephoneValid: true
		});
	}

	onChangePassword(password) {
		this.setState({
			password,
			isPasswordValid: true
		});


	}
	onChangepasswordConfirmation(passwordConfirmation) {
		this.setState({
			passwordConfirmation,
			isConfirmationValid: true
		});
	}
	// 选择登录或注册  
	selectCategory(selectedCategory) {
		LayoutAnimation.easeInEaseOut();
		this.setState({
			selectedCategory,
			isLoading: false,
		});
		console.log(selectedCategory);
	}

	render() {
		const { telephone, password, isPasswordValid, passwordConfirmation, isConfirmationValid, isTelephoneValid, isLoading, selectedCategory } = this.state;
		const isLoginPage = selectedCategory === 0;
		const isSignUpPage = selectedCategory === 1;

		return (
			<KeyboardAvoidingView style={styles.container} behavior='position' >

				<StatusBar
					barStyle={'light-content'} 
				>
				</StatusBar>

				<View style={styles.loginView}>

					<View style={styles.loginTitle}>
						<TouchableOpacity style={styles.headerContainer} >
							<Image
								style={{ width: 120, height: 120, borderRadius: 50 }}
								source={BG_IMAGE}
								// source={{ uri: LOGO_URL }}
							/>
						</TouchableOpacity>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.travelTitle}>B I N S T D</Text>
						</View>
					</View>

					<View style={{ flexDirection: 'row', height: 40, marginTop: 50 }}>
						<Button
							clear
							activeOpacity={0.7}
							onPress={() => this.selectCategory(0)}
							containerStyle={{ flex: 1 }}
							titleStyle={[styles.categoryText, isLoginPage && styles.selectedCategoryText]}
							title={'登录'}
						/>

						<Button
							clear
							activeOpacity={0.7}
							onPress={() => this.selectCategory(1)}
							containerStyle={{ flex: 1 }}
							titleStyle={[styles.categoryText, isSignUpPage && styles.selectedCategoryText]}
							title={'注册'}
						/>
					</View>

					<View style={styles.loginInput}>
						<Input
							containerStyle={{ marginVertical: 5, marginTop: 5 }}
							onChangeText={telephone => this.onChangeTelephone(telephone)}
							value={telephone}
							inputStyle={{ marginLeft: 10, color: 'white' }}
							keyboardAppearance="light"
							placeholder="手机号"
							autoFocus={false}
							autoCapitalize="none"
							autoCorrect={false}
							shake={true}
							keyboardType="default"
							returnKeyType="next"
							ref={input => this.telephoneInput = input}
							blurOnSubmit={false}
							placeholderTextColor="white"
							errorStyle={{ textAlign: 'center', fontSize: 16, color: 'white' }}
							errorMessage={isTelephoneValid ? null : "手机号不合法！"}
						/>
						<Input
							containerStyle={{ marginVertical: 5, marginTop: 5 }}
							shake={true}
							onChangeText={(password) => this.onChangePassword(password)}
							value={password}
							inputStyle={{ marginLeft: 10, color: 'white' }}
							secureTextEntry={true}
							keyboardAppearance="light"
							placeholder="密码"
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="default"
							returnKeyType="done"
							ref={input => this.passwordInput = input}
							blurOnSubmit={true}
							placeholderTextColor="white"
							errorStyle={{ textAlign: 'center', fontSize: 16, color: 'white' }}
							errorMessage={isPasswordValid ? null : '密码至少8位数'}
						/>
						{isSignUpPage &&
							<Input
								value={passwordConfirmation}
								secureTextEntry={true}
								keyboardAppearance='light'
								autoCapitalize='none'
								autoCorrect={false}
								keyboardType='default'
								returnKeyType={'done'}
								blurOnSubmit={true}
								// shake={true}
								containerStyle={{ marginTop: 5, borderBottomColor: 'rgba(0, 0, 0, 0.38)' }}
								inputStyle={{ marginLeft: 10, color: 'white' }}
								placeholder={'再输入一次密码'}
								ref={input => this.confirmationInput = input}
								onSubmitEditing={this.SignUp}
								onChangeText={passwordConfirmation => this.onChangepasswordConfirmation(passwordConfirmation)}
								errorStyle={{ textAlign: 'center', fontSize: 16, color: 'white' }}
								errorMessage={isConfirmationValid ? null : '请输入一样的密码'}
								placeholderTextColor="white"
							/>}
					</View>
					<Button
						title={isLoginPage ? '登录' : '注册'}
						activeOpacity={1}
						underlayColor="transparent"
						onPress={isLoginPage ? this.SignIn.bind(this) : this.SignUp.bind(this)}
						loading={isLoading}
						loadingProps={{ size: 'small', color: 'white' }}
						// disabled={!isTelephoneValid && password.length < 8}
						buttonStyle={{ height: 50, width: 250, backgroundColor: '#009BFF', borderWidth: 2, borderColor: '#009BFF', borderRadius: 30 }}
						containerStyle={{ marginVertical: 10 }}
						titleStyle={{ fontWeight: 'bold', color: 'white' }}
					/>
				</View>

			</KeyboardAvoidingView>
		);
	}
});


const styles = StyleSheet.create({
	headerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		flex: 1,
		top: 0,
		left: 0,
		backgroundColor: '#000000',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		alignItems: 'center'
	},
	bgImage: {
		flex: 1,
		top: 0,
		left: 0,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		// justifyContent: 'center',
		alignItems: 'center'
	},
	loginView: {
		marginTop: 10,
		justifyContent: 'center',
		// alignItems: 'center',
		// backgroundColor: 'transparent',
		width: 250,
		height: 480,
	},
	categoryText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 22,
		// fontFamily: 'light',
		backgroundColor: 'transparent',
		opacity: 0.54,
	},
	selectedCategoryText: {
		opacity: 1,
	},
	loginTitle: {
		// flex: 1,
		// justifyContent: 'center',
		alignItems: 'center',
	},
	travelTitle: {
		color: 'white',
		fontSize: 16,
		// fontFamily: 'bold'
	},
	travelText: {
		color: 'white',
		fontSize: 16,
		// fontFamily: 'bold'
	},
	plusText: {
		color: 'white',
		fontSize: 30,
		// fontFamily: 'regular'
	},
	loginInput: {
		height: 400,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loginButton: {
		backgroundColor: '#000000',
		borderRadius: 20,
		height: 50,
		// width: 200,
	},
	footerView: {
		marginTop: 20,
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
	}
});

// export default Login;