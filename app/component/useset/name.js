import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Input, SearchBar, Icon, Button } from 'react-native-elements'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import queryString from 'query-string'
import { SERVER_URL } from '../../utils/config/setting';
import { allStyles } from '../../utils/config/style';
import { observer } from 'mobx-react/native';
import userModel from '../../model/user_model';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default nameSet = observer(class nameSet extends Component {
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
        
        // let sendAdreess = this.props.navigation.state.params.sendAdreess;
        // alert(this.props.navigation.state.params.token.name);
        this.setState({
            username:this.props.navigation.state.params.username
        });
    }

    updateName(){
        console.log(this.props.navigation.state.params.uid);
        // http://127.0.0.1:3000/api/updatename?uid=2&username=189
        let params = {
            uid:this.props.navigation.state.params.uid,
            username: this.state.username
        };
        fetch(`${SERVER_URL}/api/updatename?${queryString.stringify(params)}`,{
			method: 'POST'
		}).then(res=>res.json()).then( data => {
            console.log(data);
            if(data['changedRows']== 1){
                // alert('修改成功');
                userModel.usernameSet(params.username);
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
                {/* <Text style={styles.text}>Ename - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text> */}
                <Input 
                    inputContainerStyle={allStyles.inputStyle} 
                    leftIcon={<SimpleIcon name="user" color="white" size={25} />} 
                    iconContainerStyle={{ marginLeft: 20 }} 
                    placeholder="昵称" 
                    placeholderTextColor="white" 
                    inputStyle={{ marginLeft: 10, color: "white" }} 
                    autoCapitalize="none" 
                    autoCorrect={false} 
                    keyboardAppearance="light" 
                    keyboardType="email-address" 
                    returnKeyType="next11" 
                    ref={input => (this.usernameInput = input)} 
                    onSubmitEditing={() => {
                        this.email2Input.focus();
                    }} 
                    blurOnSubmit={false}
                    onChangeText={username => this.setState({ username })}
                    value={username}
                />
                
                <Button
                    title='保存'
                    activeOpacity={1}
                    underlayColor="transparent"
                    onPress={() => this.updateName()}
                    // loading={showLoading}
                    buttonStyle={allStyles.buttonStyle }
                    containerStyle={{ marginVertical: 20 }}
                    loadingProps={{ size: 'small', color: 'white' }}
                   
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
        // justifyContent: 'center',
        alignItems: 'center',
        // paddingBottom: 30,
        paddingTop: 100,
        paddingLeft: 25 ,
        paddingRight: 25 ,
        
    },
    text: {
        color: 'white'
    },
    inputStyle:{
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: "white", 
        height: 45, 
        marginVertical:10 
    },
    buttonStyle: {
        height: 45, 
        width: 200, 
        backgroundColor: '#1C1C1C', 
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: 30,
    }
});
// export default nameSet