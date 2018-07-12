import React, { Component } from 'react'
import { Alert, View, Text, StyleSheet, Clipboard, Dimensions } from 'react-native'
import { Button, Overlay} from 'react-native-elements'
import QRCode from 'react-native-qrcode';
import { getWalletAddress} from '../utils/wallet';
import userModel from '../model/user_model';

// import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
class Payment extends Component {
    static navigationOptions = {
        title: 'token收款地址',
    };

    constructor(props) {
        super(props);
        this.state = {
            address: '11',
            isVisible:true
        };
    }
    
    async copyAddress(){
        Clipboard.setString(this.state.address);
        let  str = await Clipboard.getString();
        // alert(str);
        Alert.alert('已复制：',str,
            [{text:"好的", onPress:this.confirm}]
        );
    }

    
    componentDidMount() {    
        var address = userModel.address;
		this.setState({
			address
		});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.qrcode}>
                    <QRCode
                        value={this.state.address}
                        size={250}
                        bgColor='#000000'
                        fgColor='white' />
                </View >
         
                <Text style={styles.text}>{this.state.address}</Text>
                    <Button
                        containerStyle={{ marginVertical: 10 }}
                        title="复制"
                        buttonStyle={{backgroundColor: 'white', borderColor: 'white', borderWidth: 1}}
                        titleStyle={{color: '#000000',marginHorizontal: 15}}
                        onPress={() => this.copyAddress()}
                    />      
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        paddingBottom: 30,
        paddingTop: 60,
    },
    text: {
        color: 'white'
    },
    inputContainerStyle: {
        marginTop: 16,
        width: '90%',
    },
    qrcode: {
        // flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        width:280,
        height:280,
        // paddingBottom: 10,
        paddingTop: 15,  
        marginVertical:20
    }
});
export default Payment