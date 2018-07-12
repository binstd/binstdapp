import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Avatar, ListItem, Input, Button } from 'react-native-elements'
import { getUserData } from '../utils/login';

import { observer } from 'mobx-react/native';
import tokenModel from '../model/token_model';
import userModel from '../model/user_model';
import queryString from 'query-string'
import { SERVER_URL } from '../utils/config/setting';
import { allStyles } from '../utils/config/style';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default payIndex = observer(class payIndex extends Component {
	static navigationOptions = {
		title: '转账',
	};
	constructor(props) {
		super(props);
		this.state = {
			sendAdreess: '',
			contactList: [],
			addreess:'',
			loading:true
		};
	}

	async getData() {	
		if(!tokenModel.getContactList || tokenModel.getContactList.length == 0 || tokenModel.getContactList === undefined ){
			let params = {
				uid: userModel.uid
			};
			fetch(`${SERVER_URL}/api/contact?${queryString.stringify(params)}`, {
				method: 'get'
			  }).then(res => res.json()).then(data => {
			
				if (data['status'] == 1) {
				  tokenModel.contactListSet(data['data']);
				  this.setState({
					contactList: tokenModel.getContactList,
					loading:false
				  });
				}
				return data;
			  }).catch(function (e) {
				console.log("fetch fail");
			  });
		}else{
			this.setState({
				contactList: tokenModel.getContactList,
				loading:false
			});
		}

	}

	toPay() {
		let sendAdreess = this.state.sendAdreess
		if(sendAdreess == ""){
			return;
		}
		this.props.navigation.navigate(
			'payMain',
			{ 
				sendAdreess: sendAdreess,
				token: this.props.navigation.state.params.token
			}
		);
	}

	// backgroundColor: '#000000'
	componentDidMount() {
		console.log(this.props.navigation.state.params.token);
		this.getData();
	}

	renderAddress(oneaddress, index) {
		// this.state.contactList.map 
		const { contact_name, contact_address } = oneaddress;
		return (
			<ListItem
				leftAvatar={{ rounded: true, source: { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg' } }}
				// leftIcon={{ name: 'user' }}
				onPress={() => this.props.navigation.navigate(
					'payMain',
					{ sendAdreess: contact_address,
					  token: this.props.navigation.state.params.token
					 }
				)}
				key={index}
				title={contact_name}
				subtitle={contact_address}
				chevron
				titleStyle={{ color: 'white' }}
				subtitleStyle={{ color: '#808080' }}
				chevronColor="#808080"
				containerStyle={{
					marginHorizontal: 5,
					marginVertical: 5,
					borderRadius: 8,
					backgroundColor: '#000000',
					borderBottomWidth: 0
				}}
			/>
		);
	}

	renderList() {
		return this.state.contactList.map((oneaddress, index) => {
			//打印每个token
			return this.renderAddress(oneaddress, index);
		});
	}

	render() {
		const { sendAdreess } = this.state;
		return (
			<View style={styles.container} >

				<View style={styles.headerContainer} >
					<Input 
					    inputContainerStyle={allStyles.inputStyle} 
						iconContainerStyle={{ marginLeft: 20 }}
						placeholder="转账地址"
						placeholderTextColor="white"
						inputStyle={{ marginLeft: 20, color: "white" }}
						autoCapitalize="none"
						autoCorrect={false}
						keyboardAppearance="light"
						keyboardType="email-address"
						returnKeyType="next"
						ref={input => (this.email2Input = input)}
						onSubmitEditing={() => this.toPay()}
						blurOnSubmit={true}
						onChangeText={sendAdreess => this.setState({ sendAdreess })}
						value={sendAdreess}
					/>
					{/* <Button
						title='提交'
						onPress={() => this.toPay()}
						activeOpacity={1}
						underlayColor="transparent"
						loadingProps={{ size: 'small', color: 'white' }}
						buttonStyle={allStyles.buttonStyle}
						// buttonStyle={{ height: 50, width: 150, backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', borderRadius: 30 }}
						containerStyle={{ marginVertical: 10 }}
						titleStyle={{ fontWeight: 'bold', color: 'white' }}
					/> */}
				</ View>
				<ScrollView style={styles.list}>
					{this.renderList()}
					<ActivityIndicator
                                animating={this.state.loading}
                                style={[styles.centering, { height:60 }]}
                                size="large"
                     /> 
				</ScrollView>
			</View>
		);
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		// alignItems: 'center',
		// justifyContent: 'center',
	},

	text: {
		color: '#F5F5F5'
	},
	headerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		// height:50,
		backgroundColor: '#000000',
	},
	heading: {
		color: 'white',
		marginTop: 10,
		fontSize: 12,
	},
	list: {
		paddingLeft: 5,
		paddingRight: 5,
		marginTop: 5,
		backgroundColor: '#000000',
		borderBottomWidth: 0,
	},
	centering: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	}
});

// export default payIndex;
