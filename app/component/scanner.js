import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { BarCodeScanner, Permissions } from 'expo';

class Scanner extends Component {
  state = {
    hasCameraPermission: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  // 这里首先判定是否拥有相机权限，有我们才能正大光明的调用
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  // 扫描成功自动调用，这里先返回上一页，再调用回调函数，显示扫描内容
  handleBarCodeRead = ({ data }) => {
    // const { goBack, state } = this.props.navigation;
    // goBack();
    // state.params.onRead(data);
    // alert(data);
    this.props.navigation.navigate(
      'payMain',
      { sendAdreess: data,
        token: {name:'ETH' }
      }
    )
  };

  render() {
    const { hasCameraPermission } = this.state;

    return (
      <View style={[StyleSheet.container,{ flex: 1 }]}>
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeRead}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
}

export default Scanner;

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: '#000000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	absoluteFill: {
    width:300,
    height:300,
	},
	text: {
		color: '#F5F5F5'
	},
});
