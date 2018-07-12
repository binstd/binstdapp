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

export default passwordSet = observer(class passwordSet extends Component {
    static navigationOptions = {
        title: '修改密码',
    };

    constructor(props) {
        super(props);
        this.state = {
            password:'',
            repassword:''
        };
    }
    updatePaypassword() {
        // console.log(this.props.navigation.state.params.uid);
        let params = {
          uid: this.props.navigation.state.params.uid,
          password: this.state.password
        };
        if(this.state.password!=this.state.repassword){
            alert('两个密码需一样');
            return;
        }
        fetch(`${SERVER_URL}/api/updatepaypassword?${queryString.stringify(params)}`, {
          method: 'POST'
        }).then(res => res.json()).then(data => {
          console.log(data);
          if (data['changedRows'] == 1) {
            // userModel.();
            alert('修改成功');
          }
          return data;
        }).catch(function (e) {
          console.log("fetch fail");
        });
      }
    componentDidMount() {
        
    }
    render() {
        const { password, repassword } = this.state;
        return (
            <View style={styles.container}>
            <Text>passwordSet - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text>
              
                <Input inputContainerStyle={allStyles.inputStyle} leftIcon={<SimpleIcon name="lock" color="white" size={25} />} iconContainerStyle={{ marginLeft: 20 }} placeholder="密码" placeholderTextColor="white" inputStyle={{ marginLeft: 10, color: "white" }} autoCapitalize="none" keyboardAppearance="light" secureTextEntry={true} autoCorrect={false} keyboardType="default" returnKeyType="next" ref={input => (this.password2Input = input)} onSubmitEditing={() => {
                    this.confirmPassword2Input.focus();
                }} blurOnSubmit={false} 
                onChangeText={password => this.setState({ password })}
                value={password}
                />
                <Input 
                    inputContainerStyle={allStyles.inputStyle} 
                    leftIcon={<SimpleIcon name="lock" color="white" size={25} />} 
                    iconContainerStyle={{ marginLeft: 20 }} 
                    placeholder="请再输入一次" 
                    placeholderTextColor="white" 
                    inputStyle={{ marginLeft: 10, color: "white" }} 
                    autoCapitalize="none" 
                    keyboardAppearance="light" 
                    secureTextEntry={true} 
                    autoCorrect={false} 
                    keyboardType="default" 
                    returnKeyType="done" 
                    ref={input => (this.confirmPassword2Input = input)} 
                    blurOnSubmit={true} 
                    onChangeText={repassword => this.setState({ repassword })}
                    value={repassword}
                />
                <Button
                    title='保存'
                    activeOpacity={1}
                    underlayColor="transparent"
                    onPress={() => this.updatePaypassword()}
                    // onPress={this.getUserInfo.bind(this)}
                    // loading={showLoading}
                    loadingProps={{ size: 'small', color: 'white' }}
                    // disabled={!telephone_valid && password.length < 8}
                    buttonStyle={allStyles.buttonStyle}
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
        paddingTop: 100,
        paddingLeft: 25 ,
        paddingRight: 25 ,
    },
    inputStyle: {
        borderWidth: 1, 
        borderColor: "white", 
        height: 45,  
        // marginVertical: 10
    }
});
// export default passwordSet

