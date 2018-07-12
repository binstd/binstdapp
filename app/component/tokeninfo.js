import React, { Component } from 'react'
import { Alert, View, Text, StyleSheet, Clipboard, Dimensions, ScrollView, Image, ActivityIndicator } from 'react-native'
import { Input, SearchBar, Button } from 'react-native-elements'
import { getWalletAddress, getWalletgetBalance, getErc20Balance } from '../utils/wallet';

import Icon from 'react-native-vector-icons/FontAwesome';
import queryString from 'query-string';
import { TOKENTXLIST_API_URL, TXLIST_API_URL, API_KEY } from '../utils/config/setting';
import userModel from '../model/user_model';
const SCREEN_WIDTH = Dimensions.get('window').width;

class tokenInfo extends Component {
    static navigationOptions = {
        title: 'token详情页',
    };
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            txdata: [],
            loading:true
        };
    }
    
    async copyAddress() {
        Clipboard.setString(this.state.address);
        let str = await Clipboard.getString();
        // alert('复制成功！');
        Alert.alert('','已复制',
            [{text:"好的", onPress:this.confirm}]
        );
    }

    //this.props.navigation.state.params.entryId
    async getData() {
        var address = userModel.getAllData.address; //await getWalletAddress();
        if(this.props.navigation.state.params.token.name == 'ETH'){
            this.getEth(address.toLowerCase());
        }else{
            this.getECR20(address.toLowerCase());
        }
    }

    getEth(address) {
        var txdata = [];
        let paramsEth = {
            uid: this.props.navigation.state.params.uid,
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 6,
            sort: 'desc',
            apikey: API_KEY
        };
        fetch(`${TXLIST_API_URL}&${queryString.stringify(paramsEth)}`).then(res => res.json()).then(data => {
            // console.log('tokendate:', data);
            txdata = data['result'];
            this.setState({
                address: address,
                txdata: txdata,
                loading:false
            });
        }).catch(function (e) {
            console.log("失败");
        });
    }

    getECR20(address){
        var txdata = [];
        let paramsEth = {
            contractaddress:this.props.navigation.state.params.token.contract_address,
            address: address,
            page: 1,
            offset: 6,
            sort: 'desc',
            apikey: API_KEY
        };
        fetch(`${TOKENTXLIST_API_URL}&${queryString.stringify(paramsEth)}`).then(res => res.json()).then(data => {
            // console.log('tokendate:', data);
            txdata = data['result'];
            this.setState({
                address: address,
                txdata: txdata,
                loading:false
            });
        }).catch(function (e) {
            console.log("失败");
        });
    }

    componentDidMount() {
        this.getData();
        console.log(this.props.navigation.state.params.token);
        // console.log(this.state.txdata);
    }

    renderTx(oneTx, index) {
        // this.state.addresss.map 
        const { from, to, value } = oneTx;
        let amount = '';
        if(this.props.navigation.state.params.token.name == 'ETH'){
            amount = value/1000000000000000000;
        }else{
            amount = value/100000000;
        }
        if (from == this.state.address) {
            return (
                <View key={index} style={{ flex: 1, flexDirection: 'row', marginTop: 20, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Icon color="red" name='send' size={10} />
                        <Text style={{ fontSize: 18, color: 'gray', textAlign: 'left', marginLeft: 10 }}>
                           {to.substr(0,5)}...{to.substr(37,42)} 
                    </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, color: 'red', textAlign: 'right' }}>
                        -{amount} {this.props.navigation.state.params.token.name}
                    </Text>
                </View>
            );
        } else {
            return (
                <View key={index} style={{ flex: 1, flexDirection: 'row', marginTop: 20, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Icon color="green" name='level-down' size={15} />
                        <Text style={{ fontSize: 18, color: 'gray', textAlign: 'left', marginLeft: 10 }}>
                          {from.substr(0,5)}...{from.substr(37,42)} 
                    </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, color: 'green', textAlign: 'right' }}>
                        +{amount} {this.props.navigation.state.params.token.name}
                    </Text>
                </View>
            );
        }
        // {/* 转出 */}
    }

    renderTxList() {
        return this.state.txdata.map((oneTx, index) => {
            //打印每个token
            return this.renderTx(oneTx, index);
        });
    }

    render() {
        {/* <Text style={styles.text}>Ename - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text> */ }
        return (
            <View style={styles.container}>
                
                <View style={{ flex: 1, backgroundColor: '#000000' }}>
                    <View style={styles.statusBar} />
                    <View style={styles.navBar}>
                        <Text style={styles.nameHeader}>
                            {this.props.navigation.state.params.token.value} {this.props.navigation.state.params.token.name}
                        </Text>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, marginTop: 20, width: SCREEN_WIDTH - 80, marginLeft: 40 }}>
                            <Text style={styles.text}>{this.state.address}</Text>
                           
                            <Button
                                containerStyle={{ marginVertical: 10 }}
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                buttonStyle={{ backgroundColor: '#4F4F4F', borderColor: '#4F4F4F', borderWidth: 1, height: 36, width: 100, borderRadius: 1, justifyContent: 'center', alignItems: 'center' }}
                                title="复制"
                                titleStyle={{ fontSize: 18, color: 'white', textAlign: 'center' }}
                                onPress={() => this.copyAddress()}
                                // onPress={() => console.log('Message Theresa')}
                                activeOpacity={0.5}
                            />

                        </View>

                        <View style={{ flex: 1, marginTop: 10 }}>
                        
                            <Text style={{ flex: 1, fontSize: 18, color: 'white', marginLeft: 30 }}>
                                转账记录:
                            </Text>
                            
                            {this.renderTxList()}
                            <ActivityIndicator
                                animating={this.state.loading}
                                style={[styles.centering, { height:80 }]}
                                size="large"
                                /> 
                        </View>
                       
                    </ScrollView>
                </View>
                <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
                    <Button
                        title="收钱"
                        buttonStyle={{ backgroundColor: '#000000' }}
                        containerStyle={{ height: 40 }}
                        titleStyle={{ color: '#CFCFCF', marginHorizontal: 20 }}
                        onPress={() => this.props.navigation.navigate(
                            'Payment',
                            { entryId: { name: 'ETH' } }
                        )}
                    />
                    <Button
                        title="转账"
                        buttonStyle={{ backgroundColor: '#000000' }}
                        containerStyle={{ height: 40 }}
                        titleStyle={{ color: '#CFCFCF', marginHorizontal: 20 }}
                        onPress={() => this.props.navigation.navigate(
                            'payIndex',
                            { token: this.props.navigation.state.params.token }
                        )}
                    />
                </View>         
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        // alignItems: 'center',
        // paddingBottom: 30,
        // paddingTop: 50,
    },
    addresssContainer: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        height: 100
        // paddingBottom: 30,
        // paddingTop: 60,
    },

    text: {
        color: 'white'
    },
    inputContainerStyle: {
        marginTop: 16,
        width: '90%',
    },
    statusBar: {
        height: 10,
    },
    navBar: {
        height: 60,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignContent: 'center'
    },
    nameHeader: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
    infoTypeLabel: {
        fontSize: 15,
        textAlign: 'right',
        color: 'rgba(126,123,138,1)',
        // fontFamily: 'regular',
        paddingBottom: 10,
    },
    infoAnswerLabel: {
        fontSize: 15,
        color: 'white',
        // fontFamily: 'regular',
        paddingBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        backgroundColor: '#000000',
    },
    centering: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	}
});


export default tokenInfo