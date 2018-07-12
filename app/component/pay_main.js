import React, { Component } from 'react'
import { View, Text, StyleSheet, Clipboard, Dimensions, ScrollView, Image, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { Input, SearchBar, Button } from 'react-native-elements'
import { sendTransaction, sendERC20Transaction, getWalletPrivateKey } from '../utils/wallet';


import { observer } from 'mobx-react/native';
import tokenModel from '../model/token_model';
import userModel from '../model/user_model';
import { allStyles } from '../utils/config/style';
const SCREEN_WIDTH = Dimensions.get('window').width;

// 设置重置返回
export default payMain = observer(class payMain extends Component {
    // static navigationOptions = {
    //     title: 'token详情页',
    // };
    constructor(props) {
        super(props);
        this.state = {
            sendAdreess: '',
            sentamount: '',
            Loading:false,
            tokeninfo: {
                name: 'ETH'
            }
        };
    }

    async copyAddress() {
        Clipboard.setString(this.state.sendAdreess);
        let str = await Clipboard.getString();
        Alert.alert('已复制：', str,
            [{ text: "好的", onPress: this.confirm }]
        );
    }
    // 发送交易
    sentToken() {
        this.setState({
            Loading:true,
        });
        // alert(this.state.tokeninfo.name);
        console.log('buxing?', this.props.navigation.state.params.token);
        let tokenName = this.props.navigation.state.params.token.name;
        if (tokenName == 'ETH') {
            this.sentEthtoken();
        } else {
            this.sentErc20Token();
        }
    }

    sentEthtoken() {
        const tokenName = 'ETH';
        var privateKey = userModel.privatekey; // await getWalletPrivateKey();
        console.log('privateKey:', privateKey);
        sendTransaction(privateKey, this.state.sendAdreess, this.state.sentamount).then(hash => {
            console.log('you,hash', hash);
            if (hash['data']) {
                let tokens = [];
                let getData = tokenModel.getTokenData;
                console.log(getData);
                for (let value of getData) {
                    let onetoken = value;
                    if (value['name'] == tokenName) {
                        onetoken['value'] = value['value'] - hash['tx_cost'] - this.state.sentamount;
                        console.log('剩余value:', onetoken['value']);
                    }
                    tokens.push(onetoken);
                }
         
                this.setState({
                    Loading:false,
                });
                tokenModel.tokensSet(tokens);
                this.props.navigation.navigate(
                    'Payend',
                    { sendAdreess: this.state.sendAdreess }
                );
            }
        });
    }

    sentErc20Token() {
        let tokenName = this.props.navigation.state.params.token.name;
        var privateKey = userModel.privatekey; //await getWalletPrivateKey();
        var contractAddress = this.props.navigation.state.params.token.contract_address.toLowerCase();
        sendERC20Transaction(privateKey, contractAddress, this.state.sendAdreess, this.state.sentamount).then(hash => {
            console.log('sendERC20Transaction:', hash);
            if (hash['data']) {
                let tokens = [];
                let getData = tokenModel.getTokenData;
                for (let value of getData) {

                    let onetoken = value;
                    if (value['name'] == tokenName) {
                        onetoken['value'] = value['value'] - this.state.sentamount;
                        console.log('剩余value:', onetoken['value']);
                    }
                    if (value['name'] == 'ETH') {
                        console.log(value);
                        onetoken['value'] = value['value'] - hash['tx_cost'];
                    }
                    tokens.push(onetoken);
                }
                this.setState({
                    Loading:false,
                });
                
                tokenModel.tokensSet(tokens);
                this.props.navigation.navigate(
                    'Payend',
                    { sendAdreess: this.state.sendAdreess }
                );
            }
        });
    }

    // componentDidMount
    componentDidMount() {
        console.log(this.props.navigation.state.params.token);
        let sendAdreess = this.props.navigation.state.params.sendAdreess.toLowerCase();
        console.log('sendAdreess:', sendAdreess);
        // alert(this.props.navigation.state.params.token.name);
        this.setState({
            sendAdreess: sendAdreess
        });
    }

    render() {
        const { sentamount } = this.state;
        {/* <Text style={styles.text}>Ename - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text> */ }
        return (
            <View style={{ flex: 1, backgroundColor:'#000000'}}>
                {!this.state.Loading ? 
                <View style={styles.container}>
                    
                        <View style={{ flex: 1, backgroundColor: '#000000' }}>
                            <ScrollView style={{ flex: 1 }}>
                                <View style={{ flex: 1, marginTop: 50, width: SCREEN_WIDTH - 20, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                                  
                                    <Text style={styles.text}>{this.state.sendAdreess}</Text>
                                        <Button
                                            containerStyle={{ marginVertical: 2 }}
                                            style={{ flex: 1 }}
                                            buttonStyle={{backgroundColor: '#4F4F4F', borderColor: '#4F4F4F', borderWidth: 1,  height: 35, }}
                                            titleStyle={{color: 'white',marginHorizontal: 15}}
                                            title="复制"
                                            onPress={() => this.copyAddress()}
                                            activeOpacity={0.5}
                                        />
                                </View>
                            </ScrollView>
                        </View>
                    <KeyboardAvoidingView style={{ flex: 1, marginTop: 100 }}>
                        {/* <Text style={{ flex: 1, fontSize: 18, color: 'white', marginLeft: 30 }}>
                                转账记录:
                            </Text> */}
                        <View style={styles.loginInput}>
                            <Input 
                                inputContainerStyle={allStyles.inputStyle} 
                                // inputContainerStyle={{ borderRadius: 10, borderWidth: 1, borderColor: "white", height: 50 }}
                                // leftIcon={<MaterialIcon name="email-outline" color="white" size={25} />}
                                iconContainerStyle={{ marginLeft: 30 }}
                                placeholder="输入金额"
                                placeholderTextColor="white"
                                inputStyle={{ marginLeft: 30, color: "white" }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardAppearance="light"
                                keyboardType="email-address"
                                returnKeyType="next"
                                ref={input => (this.email2Input = input)}
                                onSubmitEditing={() => {
                                    this.password2Input.focus();
                                }}
                                blurOnSubmit={false}
                                onChangeText={sentamount => this.setState({ sentamount })}
                                value={sentamount}
                            />

                        </View>


                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, marginHorizontal: 10 }}>
                            {/* <View style={{ flex: 1, flexDirection: 'row'}}>
                                            <Text style={{  fontSize: 18, color: 'white', textAlign: 'left', marginLeft: 10 }}>
                                                    转帐费：
                                            </Text>
                                            <Text style={{  fontSize: 18, color: 'white', textAlign: 'left', marginLeft: 10 }}>
                                                0.004eth
                                            </Text>
                                </View> 
                                <Text style={{ flex: 1, fontSize: 16, color: 'red', textAlign: 'right' }}>
                                    想调整手续费？
                                </Text> */}
                        </View>
                    </KeyboardAvoidingView>
                    <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
                        <Button
                            title="转账"
                            buttonStyle={allStyles.buttonStyle}
                            // buttonStyle={{ backgroundColor: 'white', borderColor: '#000000', borderWidth: 1, height: 40, width: 200, }}
                            containerStyle={{ height: 100 }}
                            titleStyle={{ color: 'white', marginHorizontal: 30 }}
                            // buttonStyle={{  backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', borderRadius: 30 }}
                            onPress={() => this.sentToken()}
                        />
                    </View>

                </View>
                :
                <ActivityIndicator
                animating={this.state.loading}
                style={[styles.centering, {height: 200}]}
                size="large"
                />
            }
            </View>
        )
    }
});
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
        marginVertical: 10,
        color: 'white'
    },
    inputContainerStyle: {
        marginTop: 16,
        width: '90%',
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
    loginInput: {
        // width: 400,
        // height: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    travelTitle: {
        color: 'white',
        fontSize: 26,
        justifyContent: 'center',
        alignItems: 'center'
        // fontFamily: 'bold'
    },
});


// export default payMain