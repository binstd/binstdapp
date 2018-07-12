import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native'
import { Input, SearchBar, Icon, Button, Badge } from 'react-native-elements'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import queryString from 'query-string';
import { SERVER_URL } from '../../utils/config/setting';
import { observer } from 'mobx-react/native';
import userModel from '../../model/user_model';

import CodeInput from 'react-native-confirmation-code-input';
import SMSVerifyCode from 'react-native-sms-verifycode';
import { white } from 'ansi-colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default VerifyLogin = observer(class VerifyLogin extends Component {
	static navigationOptions = {
		title: '输入验证码',
	};

	constructor(props) {
		super(props);
		this.state = {
			verifycode: '09876',
			inputcode: '',
			time: 180,
			tokeninfo: {
				name: 'ETH'
			}
		};
	}

	updateTelephone() {

		let params = {
			uid: userModel.getAllData.uid,
			phone: this.state.telephone
		};
		console.log(queryString.stringify(params));
		//    ?uid=2&phone=189
		fetch(`${SERVER_URL}/api/updatephone?${queryString.stringify(params)}`, {
			method: 'POST'
		}).then(res => res.json()).then(data => {
			console.log(data);
			if (data['changedRows'] == 1) {
				userModel.telephoneSet(params.phone);
				userModel.pagenumSet(0);
				this.props.doLogin(userModel.getAllData);
			}
			return data;
		}).catch(function (e) {
			console.log("fetch fail");
		});
	}

	resetVerify() {
		this.verifycode.reset();
		fetch(`${SERVER_URL}/api/verify`, {
			method: 'get'
		}).then(res => res.json()).then(data => {
			console.log(data);
			this.setState({
				verifycode: data['code']
			});
			
		}).catch(function (e) {
			console.log("fetch fail");
		});
		
		let siv = setInterval(() => {
			this.setState({
				time: this.state.time--,
			}, () => {
				if (this.state.time == 0) {
					clearInterval(siv);
					this.setState({
						time: 180,
					});
				
				}
			});
		}, 1000);
	}

	completed(text) {

		if (text == this.state.verifycode) {

			if (userModel.getAllData.pagenum == 'loginverify') {
				userModel.pagenumSet(0);
			} else {
				userModel.pagenumSet('firstname');
			}
			this.props.doLogin(userModel.getAllData);
		} else {

			this.verifycode.reset();
			
		}
		this.verifycode.reset();
	}

	componentDidMount() {
		fetch(`${SERVER_URL}/api/verify`, {
			method: 'get'
		}).then(res => res.json()).then(data => {
			console.log(data);
			//   alert(data);
			this.setState({
				verifycode: data['code']
			});
		}).catch(function (e) {
			console.log("fetch fail");
		});

		let siv = setInterval(() => {
			this.setState({
				time: this.state.time--,
			}, () => {
				if (this.state.time == 0) {
					clearInterval(siv);
					this.setState({
						time: 180,
					});
				
				}
			});
		}, 1000);

	}

	render() {
		const { telephone } = this.state;
		var timebutton;
        if (this.state.time == 0) {
			timebutton= <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
			<Text style={styles.travelTitle}>请输入验证码</Text>
			<Button
				title='重新发送'
				activeOpacity={1}
				underlayColor="transparent"
				onPress={() => this.resetVerify()}
				// onPress={this.getUserInfo.bind(this)}
				// loading={showLoading}
				loadingProps={{ size: 'small', color: 'white' }}
				// disabled={!telephone_valid && password.length < 8}
				buttonStyle={{ height: 50, width: 100, backgroundColor: 'white', borderWidth: 0, borderColor: 'white', borderRadius: 30 }}
				containerStyle={{ marginVertical: 0 }}
				titleStyle={{ fontWeight: 'bold', color: '#000000' }}
			/>
			</View>
		}else{
			timebutton = <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
				<Badge containerStyle={{ height: 26, marginVertical: 4}} value={this.state.time}>
				</Badge>
				<Text style={{ marginVertical: 14, fontSize: 16, color: 'white' }}>秒后,可再次发送</Text>

				
				</View>
		}
		return (
			<View style={styles.container}>
				{timebutton}
				<SMSVerifyCode
					ref={ref => (this.verifycode = ref)}
					verifyCodeLength={5}
					onInputCompleted={(text) => this.completed(text)}
					codeFontSize={26}
					codeFontColor={'white'}
					containerBackgroundColor={'#000000'}
					codeFocusedBorderColor='white'
					codeBorderColor='grey'
					codeViewWidth={45}
					codeBorderRadius={20}
				// secureTextEntry='false'
				/>
			</View>
		)
	}
});
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		// alignItems: 'center',
		paddingBottom: 30,
		paddingTop: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	travelTitle: {
		color: 'white',
		fontSize: 22,
		// marginVertical: 10,
		// fontFamily: 'bold'
	},
	inputContainerStyle: {
		marginTop: 16,
		width: '90%',
	},
	buttonsContainer: {
		// flexDirection: 'row',
		// justifyContent: 'space-around',
		width: '100%',
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
		// width:200,
		// backgroundColor: '#000000',
	}
});
// export default telephoneSet