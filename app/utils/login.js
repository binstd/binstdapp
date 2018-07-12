import { AsyncStorage } from 'react-native';
// import { wallet_name } from './config/setting';
// 获取用户信息
export function getUserData() {
    // return AsyncStorage.getItem(WALLET_NAME+'_PRIVATEKEY');
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('USERDATA', (error, result) => {
            if (!error && result !== null && result !== '') {
                try {
                    resolve(JSON.parse(result));
                } catch (e) {
                    reject(error);
                }
            } else {
                resolve(false);
            }
        });
    });
}

