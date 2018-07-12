import React from "react";
import { Platform, StatusBar } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator
} from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";
import { Icon, Header } from 'react-native-elements';

import Profile from "./screens/Profile";
import Wallet from './screens/Wallet';
import Login from './screens/Login';
import VerifyLogin from './screens/login/VerifyLogin';
import LoginNameSet from './screens/login/LoginNameSet';

import telephoneSet from './component/useset/telephone';
import passwordSet from './component/useset/password';
import nameSet from './component/useset/name';
import tokenInfo from './component/tokeninfo';
import Payment from './component/payment';

import payIndex from './component/pay_index';
import payMain from './component/pay_main';
import Scanner from './component/scanner';
import Payend from './component/payend';
import addCantact from './component/addcantact';

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = createStackNavigator({
  Login: Login,
  VerifyLogin: {
    screen: VerifyLogin,
  },
  LoginNameSet:{
    screen: LoginNameSet,
  },
}, {
    navigationOptions: {
      headerTintColor: "#FFFFFF",
      headerStyle: {
        backgroundColor: "#000000",
        borderBottomWidth: 0,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        }
      }
    }
  });
// export const SignedOut = createStackNavigator({
//   SignUp: {
//     screen: SignUp,
//     navigationOptions: {
//       title: "Sign Up",
//       headerStyle
//     }
//   },
//   SignIn: {
//     screen: SignIn,
//     navigationOptions: {
//       title: "Sign In",
//       headerStyle
//     }
//   }
// });

// export const SignedIn = createBottomTabNavigator(
//   {
//     Home: {
//       screen: Home,
//       navigationOptions: {
//         tabBarLabel: "Home",
//         tabBarIcon: ({ tintColor }) => (
//           <FontAwesome name="home" size={30} color={tintColor} />
//         )
//       }
//     },
//     Profile: {
//       screen: Profile,
//       navigationOptions: {
//         tabBarLabel: "Profile",
//         tabBarIcon: ({ tintColor }) => (
//           <FontAwesome name="user" size={30} color={tintColor} />
//         )
//       }
//     }
//   },
//   {
//     tabBarOptions: {
//       style: {
//         paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
//       }
//     }
//   }
// );


const Tabs = createBottomTabNavigator({
  Wallet: {
    screen: Wallet,
    navigationOptions: {
      tabBarLabel: '资产',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name='currency-btc'
          size={30}
          type="material-community"
          color={tintColor}
        />
      ),
    },

  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon name="brightness-7" size={30} type="material-community" color={tintColor} />
      ),
    },
  }
},
  {
    initialRouteName: 'Wallet',
    animationEnabled: false,
    swipeEnabled: true,
    // Android's default option displays tabBars on top, but iOS is bottom
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      // Android's default showing of icons is false whereas iOS is true
      showIcon: true,
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#000000',
      },
      indicatorStyle: {
        height: 0
      }
    },
  }

);

//整站路由

// export const SignedIn = createBottomTabNavigator
export const SignedIn = createStackNavigator({
  Home: {
    screen: Tabs
  },
  telephoneSet: {
    screen: telephoneSet,

  },
  nameSet: {
    screen: nameSet,

  },
  passwordSet: {
    screen: passwordSet,
  },
  Payment: {
    screen: Payment,
  },
  tokenInfo: {
    screen: tokenInfo,
  },
  payIndex: {
    screen: payIndex,
  },
  payMain: {
    screen: payMain,
  },
  Scanner: {
    screen: Scanner,
  },
  Payend: {
    screen: Payend,
  },
  addCantact: {
    screen: addCantact,
  },
}, {
    navigationOptions: {
      headerTintColor: "#FFFFFF",
      headerStyle: {
        backgroundColor: "#000000",
        borderBottomWidth: 0,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        }
      }
    }
  });

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
