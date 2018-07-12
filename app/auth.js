import { AsyncStorage } from "react-native";
import userModel from './model/user_model';
export const USER_KEY = "USER_AUTH";

// export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true");

export const onSignIn = (params) => {
  
  userModel.allSet(params);
  console.log('onSignIn:',params);
  return AsyncStorage.setItem(USER_KEY, JSON.stringify(params));
};

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY).then(res => {
      if (res !== null) {
        userModel.allSet(JSON.parse(res));
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch(err => reject(err));
  });
};
