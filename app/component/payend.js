import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Input, SearchBar, Icon, Button } from 'react-native-elements'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { observer } from 'mobx-react/native';
import userModel from '../model/user_model';
import tokenModel from '../model/token_model';
const SCREEN_WIDTH = Dimensions.get('window').width;
import { allStyles } from '../utils/config/style';
import { StackActions, NavigationActions } from 'react-navigation';
// const navigationAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({
//             routeName: 'Home', //这个是tabs
//             action: NavigationActions.navigate({
//                 routeName: 'Wallet', // 这个是tabs 里面的任何一个tab
//             })
//         }
//         )]
// });
const navigationAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});
export default Payend = observer(class Payend extends Component {
    static navigationOptions = {
        title: '转账进度',
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            hasContact: false
        };
    }

    componentDidMount() {
        console.log('this.props.navigation.state.params.sendAdreess:', this.props.navigation.state.params.sendAdreess);
        if (tokenModel.getContactList) {
            let getData = tokenModel.getContactList;
            for (let value of getData) {
                console.log(value);
                if (value['contact_address'].toLowerCase() == this.props.navigation.state.params.sendAdreess.toLowerCase()) {
                    // console.log();
                    this.setState({
                        hasContact: true
                    });
                }
            }
        }

    }

    render() {
        var payEndInfo;
        if (!this.state.hasContact) {
            payEndInfo = <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
                <Text style={styles.addressText}>转账地址:{this.props.navigation.state.params.sendAdreess}</Text>
                <Text style={styles.addressTextFoot}>嫌弃地址太长：</Text>
                <Button
                    title="添加到联系人"
                    buttonStyle={allStyles.buttonStyle}
                    // buttonStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 26, height: 45, width: 200 }}
                    containerStyle={{ height: 30 }}
                    titleStyle={{ color: 'white', marginHorizontal: 20 }}

                    onPress={() => this.props.navigation.navigate(
                        'addCantact',
                        { sendAdreess: this.props.navigation.state.params.sendAdreess }
                    )}
                />
            </View>

        } else {
            payEndInfo = <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
                <Button
                    title="OK"
                    buttonStyle={allStyles.buttonStyle}
                    // buttonStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 26, height: 45, width: 200 }}
                    containerStyle={{ height: 30 }}
                    titleStyle={{ color: 'white', marginHorizontal: 20 }}
                    //onPress={() => this.props.navigation.navigate("SignedIn")}
                    onPress={() => this.props.navigation.dispatch(navigationAction)}
                />
            </View>

        }
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#000000' }}>

                    <View style={styles.navBar}>
                        <Text style={styles.nameHeader}>
                            转账已提交网络处理..
                            </Text>
                    </View>

                </View>
                {payEndInfo}
            </View>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingBottom: 30,
        paddingTop: 30,
    },
    addressText: {
        color: 'white',
        marginVertical: 10
    },
    addressTextFoot: {
        color: 'white',
        fontSize: 18,
        marginVertical: 10,

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
    },
    navBar: {
        height: 50,
        marginVertical:100,
        marginLeft: 20,
        marginRight:20 ,
        backgroundColor: '#363636',
        // width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: '#1C1C1C',
        borderRadius: 5,
        borderWidth: 3, 
        // borderColor: '#363636', 
        // height: 80
    },
    nameHeader: {
        color: 'white',
        fontSize: 18,
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
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        // width: '100%',
        height: 150,
        marginLeft: 20,
        marginRight:20 ,
        paddingBottom: 20,
        // marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#1C1C1C',
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    }
});
