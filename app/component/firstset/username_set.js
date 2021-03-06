import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Input, SearchBar, Icon, Button } from 'react-native-elements'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import queryString from 'query-string'
import { SERVER_URL } from '../../utils/config/setting';
import { observer } from 'mobx-react/native';
import userModel from '../../model/user_model';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default FirstNameSet = observer(class FirstNameSet extends Component {
    static navigationOptions = {
        title: '修改称呼',
    };
    
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    componentDidMount() {
   
    }

    updateName(){
        let params = {
            uid:userModel.getAllData.uid,
            username: this.state.username
        };
        fetch(`${SERVER_URL}/api/updatename?${queryString.stringify(params)}`,{
			method: 'POST'
		}).then(res=>res.json()).then( data => {
            console.log(':::::',data);
            if(data['changedRows']== 1){
                // alert('设置成功');
                userModel.usernameSet(params.username);
                userModel.pagenumSet(0);
                console.log(userModel.getAllData.pagenum);
                this.props.doLogin(userModel.getAllData);
            }
			return data;
		}).catch(function (e) {
            console.log("fetch fail");
        });
    }
    render() {
        const { username } = this.state;
        return (
          
            <View style={styles.container}>
                <Text style={styles.travelTitle}>设置您的昵称</Text>
                {/* <Text style={styles.text}>Ename - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text> */}
                <Input 
                    inputContainerStyle={{ borderRadius: 2, borderWidth: 1, borderColor: "white", height: 50, width: SCREEN_WIDTH - 50 }} 
                    leftIcon={<SimpleIcon name="user" color="white" size={25} />} 
                    iconContainerStyle={{ marginLeft: 10 }} 
                    placeholder="用户名" 
                    placeholderTextColor="white" 
                    inputStyle={{ marginLeft: 30, color: "white" }} 
                    autoCapitalize="none" 
                    autoCorrect={false} 
                    keyboardAppearance="light" 
                    keyboardType="email-address" 
                    returnKeyType="next" 
                    ref={input => (this.usernameInput = input)} 
                    onSubmitEditing={() => {
                        this.email2Input.focus();
                    }} 
                    blurOnSubmit={false}
                    onChangeText={username => this.setState({ username })}
                    value={username}
                />
                <Button
                    title='下一步'
                    activeOpacity={10}
                    underlayColor="transparent"
                    onPress={() => this.updateName()}
                    // loading={showLoading}
                    
                    loadingProps={{ size: 'small', color: 'white' }}
                    // disabled={!telephone_valid && password.length < 8}
                    buttonStyle={{ height: 50, width: 200, backgroundColor: 'transparent', marginTop:30, borderWidth: 1, borderColor: 'white', borderRadius: 5 }}
                    containerStyle={{ marginVertical: 10 }}
                    titleStyle={{ fontWeight: 'bold', color: 'white' }}
                />
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
    },
    text: {
        color: 'white'
    },
    travelTitle: {
		color: 'white',
        fontSize: 26,
        marginVertical: 20,
		// fontFamily: 'bold'
	},
    inputContainerStyle: {
        marginTop: 16,
        width: '90%',
    }
});
