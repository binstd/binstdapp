import React, { Component } from 'react';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { Button, ButtonGroup } from 'react-native-elements';
import Tokenlist from '../component/tokenlist';

import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

class Wallet extends Component {
    
    toTokenInfo(token) {
        this.props.navigation.navigate(
            'tokenInfo',
            { token: token }
        );
    }
    
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
                >
                </StatusBar>
                <View style={styles.userTypesContainer}>
                    <UserTypeItem
                        label="扫一扫"
                        labelColor="white"
                        icon='qrcode'
                        onPress={() => this.props.navigation.navigate(
                            // 'TelephoneSet'
                            'Scanner'
                        )}
                        
                    />
                    <UserTypeItem
                        label="转账"
                        labelColor="#FFFFFF"
                        icon='send'
                        onPress={() => this.props.navigation.navigate(
                            'payIndex',
                            { token: {name:'ETH' }}
                          )}
                    />
                    <UserTypeItem
                        label="收款"
                        labelColor="#FFFFFF"
                        icon='level-down'
                        onPress={() => this.props.navigation.navigate(
                            'Payment',
                            { entryId: {name: 'ETH' }}
                          )}
                    />

                </View>
                <Tokenlist toTokenInfo={(token) => {
					this.toTokenInfo(token)
				}} />
            </View>
        );
    }
}

export const UserTypeItem = props => {
    const { icon, label, labelColor, selected, ...attributes } = props
    return (
        <TouchableOpacity {...attributes}>
            <View
                style={[
                    styles.userTypeItemContainer,
                    selected && styles.userTypeItemContainerSelected,
                ]}
            >
                <Icon color="#FFFFFF" name={icon} size={26} />
              
                <Text style={[styles.userTypeLabel, { color: labelColor }]}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        // alignItems: 'center',
        paddingBottom: 30,
        paddingTop: 30,
        // justifyContent: 'center',
    },
    text: {
        color: '#F5F5F5'
    },
    userTypesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: SCREEN_WIDTH,
        // alignItems: 'center',
    },
    userTypeItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
    },
    userTypeItemContainerSelected: {
        opacity: 1,
    },
    userTypeMugshot: {
        margin: 4,
        height: 70,
        width: 70,
    },
    userTypeMugshotSelected: {
        height: 100,
        width: 100,
    },
    userTypeLabel: {
        color: 'yellow',
        // fontFamily: 'bold',
        // margin:'2',
        paddingTop: 3,
        fontSize: 16,
    },


});

export default Wallet;
