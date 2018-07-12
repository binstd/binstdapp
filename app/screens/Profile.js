import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Avatar, ListItem, Button } from 'react-native-elements'
import { getUserData } from '../utils/login';

import { observer } from 'mobx-react/native';
import userModel from '../model/user_model';
import tokenModel from '../model/token_model';
import { onSignOut } from "../auth";

export default Profile = observer(class My extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      telephone: '',
      addreess: ''
    };
  }
  getUser() {
    const userinfo = userModel.getAllData;
    console.log(userinfo['username']);
    console.log('userinfo:',userModel.getAllData);
    this.setState({
      uid: userinfo['uid'],
      username: userinfo['username'],
      telephone: userinfo['telephone'],
      addreess: userinfo['addreess'],
      img_url: userinfo['img_url'],
    });
  }
  // backgroundColor: '#000000'
  componentDidMount() {
    this.getUser();
  }

  clearAll() {
    AsyncStorage.clear();
    userModel.clearAll();
    tokenModel.clearAll();
    onSignOut().then(() => this.props.navigation.navigate("SignedOut"))
  }
  render() {
    return (
      <View style={styles.container} >
      
        <TouchableOpacity style={styles.headerContainer} >
          {/* <Image
            style={{width: 100, height: 100, borderRadius:50}}
            source={{uri:userModel.img_url}}
          /> */}
         
          {/* <Text style={styles.heading}>更换头像</Text> */}
        </TouchableOpacity>

        <View style={styles.list}>
          <ListItem
            // leftIcon={{ name: 'user' }}
            onPress={() => this.props.navigation.navigate(
              'nameSet',
              {
                uid: this.state.uid,
                username: userModel.getAllData.username
              }
            )}
            title='昵称'
            subtitle={userModel.getAllData.username}
            chevron
            titleStyle={{ color: 'white' }}
            subtitleStyle={{ color: '#808080' }}
            chevronColor="white"
            containerStyle={{
              marginHorizontal: 16,
              marginVertical: 8,
              borderRadius: 8,
              backgroundColor: '#000000',
              borderBottomWidth: 0
            }}
          />
          <ListItem
            onPress={() => this.props.navigation.navigate(
              'telephoneSet',
              {
                uid: this.state.uid,
                telephone: userModel.getAllData.telephone
              }
            )}
            title='手机号'
            subtitle={userModel.getAllData.telephone}
            chevron

            titleStyle={{ color: 'white' }}
            subtitleStyle={{ color: '#808080' }}
            chevronColor="white"
            containerStyle={{
              marginHorizontal: 16,
              marginVertical: 8,
              borderRadius: 8,
              backgroundColor: '#000000',
              borderBottomWidth: 0
            }}
          />
          <ListItem
            // leftIcon={{ name: 'mobile' }}
            onPress={() => this.props.navigation.navigate(
              'passwordSet',
              { uid: this.state.uid }
            )}
            title='支付密码'
            subtitle='*******'
            chevron
            // bottomDivider
            titleStyle={{ color: 'white' }}
            subtitleStyle={{ color: '#808080' }}
            chevronColor="white"
            containerStyle={{
              marginHorizontal: 16,
              marginVertical: 8,
              borderRadius: 8,
              backgroundColor: '#000000',
              borderBottomWidth: 0
            }}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button
              title='退出登录'
              activeOpacity={1}
              underlayColor="transparent"
              onPress={() => this.clearAll()}
              // onPress={this.getUserInfo.bind(this)}
              // loading={showLoading}
              loadingProps={{ size: 'small', color: 'white' }}
              // disabled={!telephone_valid && password.length < 8}
              buttonStyle={{ height: 35, width: 120, backgroundColor: '#000000', borderWidth: 1, borderColor: 'white', borderRadius: 30 }}
              containerStyle={{ marginVertical: 20 }}
              titleStyle={{ fontWeight: 'bold', color: 'white' }}
            />
          </View>

        </View>
       
        
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: '#000000',
  // alignItems: 'center',
      justifyContent: 'center',
  },
  text: {
    color: '#F5F5F5'
  },
  headerContainer: {
    // justifyContent: 'center',
     alignItems: 'center',
    // padding: 10,
    // backgroundColor: '#000000',
  },
  heading: {
    color: 'white',
    marginTop: 15,
    fontSize: 15,
  },
  list: {
    backgroundColor: '#000000',
    borderBottomWidth: 0,
  }
});


