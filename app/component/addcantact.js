import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import { Input, SearchBar, Icon, Button } from 'react-native-elements'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import queryString from 'query-string'
import { SERVER_URL } from '../utils/config/setting';
import { observer } from 'mobx-react/native';
import userModel from '../model/user_model';
import tokenModel from '../model/token_model';
import { allStyles } from '../utils/config/style';

const SCREEN_WIDTH = Dimensions.get('window').width;

import { StackActions,NavigationActions } from 'react-navigation';

const navigationAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});
export default addCantact = observer(class addCantact extends Component {
    static navigationOptions = {
        title: '添加联系人',
    };
    
    constructor(props) {
        super(props);
        this.state = {
            contactname: '',
            Loading:false,
        };
    }

    componentDidMount() {
        
    }

    updateName(){
        this.setState({
            Loading:true,
        });
        // this.props.navigation.navigate("SignedIn");
        let params = {
            uid:userModel.uid,
            contact_name: this.state.contactname,
            contact_address:this.props.navigation.state.params.sendAdreess
        };
        fetch(`${SERVER_URL}/api/addcontact?${queryString.stringify(params)}`,{
			method: 'POST'
		}).then(res=>res.json()).then( data => {
            console.log('addcontact:',data);
            if(data['status']== 1){
                // alert('设置成功');
                tokenModel.contactListPush(params);
                
                // this.props.navigation.dispatch(navigationAction);
            }
            this.setState({
                Loading:false,
            });
            this.props.navigation.dispatch(navigationAction);
            // this.props.navigation.navigate("SignedIn");
			return data;
		}).catch(function (e) {
            console.log("fetch fail");
        });
    }
    render() {
        const { contactname } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor:'#000000'}}>
            {!this.state.Loading ? 
            <View style={styles.container}>
                <Text style={styles.travelTitle}>给地址一个备注名称:</Text>
                {/* <Text style={styles.text}>Ename - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text> */}
                <Input 
                    inputContainerStyle={allStyles.inputStyle} 
                    // inputContainerStyle={{ borderRadius: 2, borderWidth: 1, borderColor: "white", height: 50, width: SCREEN_WIDTH - 50 }} 
                    leftIcon={<SimpleIcon name="user" color="white" size={25} />} 
                    iconContainerStyle={{ marginLeft: 10 }} 
                    placeholder="备注名" 
                    placeholderTextColor="white" 
                    inputStyle={{ marginLeft: 30, color: "white" }} 
                    autoCapitalize="none" 
                    autoCorrect={false} 
                    keyboardAppearance="light" 
                    keyboardType="email-address" 
                    returnKeyType="next" 
                    ref={input => (this.contactnameInput = input)} 
                    onSubmitEditing={() => {
                        this.email2Input.focus();
                    }} 
                    blurOnSubmit={false}
                    onChangeText={contactname => this.setState({ contactname })}
                    value={contactname}
                />
                <Button
                    title='确认'
                    activeOpacity={10}
                    underlayColor="transparent"
                    onPress={() => this.updateName()}
                    // loading={showLoading}
                    
                    loadingProps={{ size: 'small', color: 'white' }}
                    // disabled={!telephone_valid && password.length < 8}  
                    buttonStyle={allStyles.buttonStyle}
                    // buttonStyle={{ height: 50, width: 200, backgroundColor: 'transparent', marginTop:30, borderWidth: 1, borderColor: 'white', borderRadius: 5 }}
                    containerStyle={{ marginVertical: 10 }}
                    titleStyle={{ fontWeight: 'bold', color: 'white' }}
                />
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30,
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30 ,
    },
    text: {
        color: 'white'
    },
    travelTitle: {
		color: 'white',
        fontSize: 18,
        marginVertical: 20,
		// fontFamily: 'bold'
	},
    inputContainerStyle: {
        marginTop: 16,
        width: '90%',
    }
});
