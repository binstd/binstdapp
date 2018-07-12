import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, AsyncStorage,ActivityIndicator } from 'react-native'
import { Input, SearchBar, Icon, Button, Badge } from 'react-native-elements'

import queryString from 'query-string';
import { SERVER_URL } from '../../utils/config/setting';
import { observer } from 'mobx-react/native';
import userModel from '../../model/user_model';

import SMSVerifyCode from 'react-native-sms-verifycode';
import user_model from '../../model/user_model';
import timerModel from '../../model/timer';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default VerifyLogin = observer(class VerifyLogin extends Component {
	static navigationOptions = {
		title: '输入验证码',
	};

	constructor(props) {
		super(props);
		this.state = {
			verifycode: '09876',
			loading:false,
			inputcode: '',
			tokeninfo: {
				name: 'ETH'
			}
		};
	}

	//提交服务器-注册
	signUp() {
		let params = user_model.getAllData;
		this.setState({
			loading: true
		});
		params['password'] = this.props.navigation.state.params.password;
		fetch(`${SERVER_URL}/api/signup?${queryString.stringify(params)}`, {
			method: 'POST'
		}).then(res => res.json()).then(data => {
			this.setState({
				loading: false
			});
			if (data['status'] == 1) {
                params['uid'] = data['insertId'];
				params['verifyed'] = true,
				userModel.allSet(params);
				this.props.navigation.navigate("LoginNameSet")
			}
			return data;
		}).catch(function (e) {
			console.log("fetch fail");
			this.setState({
				loading: false
			});
        });
        
       
	}

	//重置激活码
	resetVerify() {
		this.verifycode.reset();
		timerModel.reset();
		this.setState({
			loading: true
		});
		fetch(`${SERVER_URL}/api/verify`, {
			method: 'get'
		}).then(res => res.json()).then(data => {
			console.log(data);
			this.setState({
				verifycode: data['code'],
				loading: false
			});
			
		}).catch(function (e) {
			console.log("异常错误");
		});
		
		
	}

	//输入完成
	completed(text) {
		if (text == this.state.verifycode) {
			this.signUp();
		} else {
			this.verifycode.reset();
		}
		this.verifycode.reset();
	}

	componentDidMount() {
		this.setState({
			loading: true
		});
		fetch(`${SERVER_URL}/api/verify`, {
			method: 'get'
		}).then(res => res.json()).then(data => {
			timerModel.reset();
			this.setState({
				verifycode: data['code'],
				loading: false
			});
		}).catch(function (e) {
			this.setState({
				loading: true
			});
		});


	}

	render() {
		const { telephone } = this.state;
		var timebutton, showview;
        if (timerModel.timer > 0) {
			timebutton = <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
				<Badge containerStyle={{ height: 26, marginVertical: 4}} value={timerModel.timer}>
				</Badge>
				<Text style={{ marginVertical: 14, fontSize: 16, color: 'white' }}>秒后,可再次发送</Text>				
				</View>
			
		}else{
			timebutton= <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
				<Button
					title='重新发送'
					activeOpacity={1}
					underlayColor="transparent"
					onPress={() => this.resetVerify()}
					// onPress={this.getUserInfo.bind(this)}
					// loading={showLoading}
					loadingProps={{ size: 'small', color: 'white' }}
					// disabled={!telephone_valid && password.length < 8}
					buttonStyle={{ height: 50, width: 100, backgroundColor: '#000000', borderWidth: 0, borderColor: '#000000', borderRadius: 30 }}
					containerStyle={{ marginVertical: 0 }}
					titleStyle={{ fontWeight: 'bold', color: 'white' }}
				/>
				</View>
		}
		if(this.state.loading){
			showview = 
				<ActivityIndicator
					animating={this.state.loading}
					style={[styles.centering, {height: 200}]}
					size="large"
				/>
			
		}else{
			showview = 	<View>
				<Text style={styles.travelTitle}>请输入验证码</Text>
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
				/>
			</View>
		}
		
		return (
			<View style={styles.container}>
				{showview}
			</View>
		)
	}
});
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		alignItems: 'center',
		paddingBottom: 30,
		paddingTop: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	travelTitle: {
		color: 'white',
		fontSize: 26,
		marginVertical: 10,
	},
	inputContainerStyle: {
		marginTop: 16,
		width: '90%',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
		// width:200,
		backgroundColor: '#000000',
	}
});
// export default telephoneSet