import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Input, SearchBar, Icon, Button } from 'react-native-elements'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import queryString from 'query-string';
import { SERVER_URL } from '../../utils/config/setting';
import { observer } from 'mobx-react/native';
import userModel from '../../model/user_model';
import { allStyles } from '../../utils/config/style';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default telephoneSet = observer( class telephoneSet extends Component {
  static navigationOptions = {
    title: '修改手机号',
  };

  constructor(props) {
    super(props);
    this.state = {
      telephone: '',
      sendAdreess: '',
      sentamount: '',
      tokeninfo: {
        name: 'ETH'
      }
    };
  }

  updateTelephone() {
    console.log(this.props.navigation.state.params.uid);
    let params = {
      uid: this.props.navigation.state.params.uid,
      phone: this.state.telephone
    };
    console.log(queryString.stringify(params));
    //    ?uid=2&phone=189
    fetch(`${SERVER_URL}/api/updatephone?${queryString.stringify(params)}`, {
      method: 'POST'
    }).then(res => res.json()).then(data => {
      console.log(data);
      if (data['changedRows'] == 1) {
        userModel.telephoneSet(params.phone);
        alert('修改成功');
      }
      return data;
    }).catch(function (e) {
      console.log("fetch fail");
    });
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params.uid);
    // let sendAdreess = this.props.navigation.state.params.sendAdreess;
    // // alert(this.props.navigation.state.params.token.name);
    this.setState({
      telephone:this.props.navigation.state.params.telephone
    });
  }
  render() {
    const { telephone } = this.state;
    return (
      <View style={styles.container}>
        <Text>Entry Detail - {JSON.stringify(this.props.navigation.state.params.entryId)}</Text>
        <Input 
          inputContainerStyle={allStyles.inputStyle} 
          leftIcon={<MaterialIcon name="email-outline" color="white" size={25} />} 
          iconContainerStyle={{ marginLeft: 20 }} 
          placeholder="手机号" 
          placeholderTextColor="white" 
          inputStyle={{ marginLeft: 10, color: "white" }} 
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
          onChangeText={telephone => this.setState({ telephone })}
          value={telephone}
        />
        <Button
          title='保存'
          activeOpacity={1}
          underlayColor="transparent"
          onPress={() => this.updateTelephone()}
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
    paddingBottom: 30,
    paddingTop: 100,
    paddingLeft: 25,
    paddingRight: 25,
  },

});
// export default telephoneSet