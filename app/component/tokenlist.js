import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Dimensions,ActivityIndicator } from 'react-native';
import { getWalletAddress, getWalletgetBalance, getErc20Balance } from '../utils/wallet';
import { Avatar, Button } from 'react-native-elements';

import { observer } from 'mobx-react/native';
import tokenModel from '../model/token_model';
import userModel from '../model/user_model';

import queryString from 'query-string'
import { SERVER_URL } from '../utils/config/setting';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
// import { Font } from 'expo';
// import Icon from 'react-native-vector-icons/FontAwesome';


export default Tokenlist = observer(class Tokenlist extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tokens: [],
			loading:true
		};
	}
	async getBlance() {
		let tokenDatas = [];
		var address = userModel.getAllData.address; //await getWalletAddress();
		var balance = await getWalletgetBalance(address);
		for (let item of tokenModel.getTokenData) {
			if (item['name'] == 'ETH') {
				item['value'] = balance;
				item['showed'] = true;
			} else {
				let ecr20balance = await getErc20Balance(item['contract_address'], address);
				item['value'] = JSON.parse(ecr20balance) / 100000000;
				item['showed'] = true;
			}
			if (item['showed']) {
				tokenDatas.push(item);
			}
		}
	
		tokenModel.tokensSet(tokenDatas);
		this.setState({
			tokens: tokenModel.getTokenData,
			loading:false
		});
		
	}
	onContentSizeChange(){
		this.setState({
			loading:true
		});
		this.getBlance();
	}

	componentDidMount() {
		let params = {
			uid: userModel.uid
		};
		fetch(`${SERVER_URL}/api/tokens?${queryString.stringify(params)}`, {
			method: 'get'
		}).then(res => res.json()).then(data => {
			if (data['status'] == 1) {
				console.log(data);
				tokenModel.tokensSet(data['data']);
				this.getBlance();
			}
			return data;
		}).catch(function (e) {
			console.log("fetch fail");
		});	
		
		// console.log('已登陆，查看用户信息:',user_model.getAllData);
	}

	renderValue(token) {
		const { value, positive } = token;
		if (positive) {
			return (
				<View style={{ backgroundColor: '#000000', width: 100, height: 28, borderRadius: 3, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 10 }}>
					
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 5 }}>{value}</Text>
				</View>
			);
		} else {
			return (
				<View style={{ backgroundColor: '#000000', width: 100, height: 28, borderRadius: 3, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 10 }}>
				
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 5 }}>{value}</Text>
				</View>
			);
		}
	}

	renderCard(token, index) {
		const { name, icon_url } = token;
		return (
			<TouchableOpacity onPress={() => this.props.toTokenInfo(token)} key={index} style={{ height: 60, marginHorizontal: 20, marginTop: 10, backgroundColor: '#1C1C1C', borderRadius: 5, alignItems: 'center', flexDirection: 'row' }}>
				<View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ marginLeft: 15 }}>
						<Avatar
							small
							rounded
							source={{
								uri: icon_url,
							}}
							activeOpacity={0.7}
						/>
					</View>
					<Text style={{ fontSize: 15, marginLeft: 10, color: '#FFFFFF' }}>
						{name}
					</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 10 }}>
					{this.renderValue(token)}
				</View>
			</TouchableOpacity>
		);
	}

	renderListCards() {
		return this.state.tokens.map((token, index) => {
			//打印每个token
			return this.renderCard(token, index);
		});
	}
	render() {
		return (
			<ScrollView style={{height: Dimensions.get('window').height-200,paddingTop: 30, backgroundColor: '#000000'}} onTouchEnd={()=>this.onContentSizeChange()} onResponderRelease={()=>this.onContentSizeChange()}>
				{/* <ScrollView style={styles.boxOne} scrollEventThrottle={1} overScrollMode='always' onScroll={()=>this.onsc()}>> */}
					<View style={styles.container}>
						{this.renderListCards()}
					</View>
					<ActivityIndicator
						animating={this.state.loading}
						style={[styles.centering, {height: 200}]}
						size="large"
					/>
				{/* </ScrollView> */}
		  </ScrollView>
			
		);
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	boxOne: {
		width: SCREEN_WIDTH,
		backgroundColor: '#000000',
		// paddingBottom: 100,
		paddingTop: 30,
		
	},
	centering: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	}
});

// export default Tokenlist;
