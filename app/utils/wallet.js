import ethers from 'ethers';
import { AsyncStorage } from 'react-native';
import { wallet_name } from './config/setting';
import { erc20_abi } from './config/abi';
import userModel  from '../model/user_model';
const { HDNode, providers, utils, Wallet} = ethers;
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';
// let network = (process.env.NODE_ENV === 'production') ?
//     { name: 'mainnet', ensAddress: '0x314159265dd8dbb310642f98f50c066173c1259b', chainId: 1 } :
//     { name: 'rinkeby', ensAddress: '0xe7410170f87102df0055eb195163a03b7f2bff4a', chainId: 4 };

const PROVIDER = providers.getDefaultProvider(network);


// Connect to a local Parity instance
var provider = new providers.JsonRpcProvider(userModel.eth_rpc_url, 'ropsten');
// 钱包名称
const WALLET_NAME = wallet_name;


// 创建钱包，持久化保存钱包地址和私钥
export function createWalletKey() {
    const wallet = Wallet.createRandom();
    AsyncStorage.setItem(WALLET_NAME+'_ADDRESS', JSON.stringify(wallet.address));
    AsyncStorage.setItem(WALLET_NAME+'_PRIVATEKEY', JSON.stringify(wallet.privateKey));
}

// 创建钱包，持久化保存钱包地址和私钥
export function importWalletKey(pkey) {
    removeWallet();
    const wallet =  new Wallet(pkey);
    AsyncStorage.setItem(WALLET_NAME+'_ADDRESS', JSON.stringify(wallet.address));
    AsyncStorage.setItem(WALLET_NAME+'_PRIVATEKEY', JSON.stringify(wallet.privateKey));
}

// 获取钱包地址
export function getWalletAddress() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(WALLET_NAME+'_ADDRESS', (error, result) => {
            if (!error && result !== null && result !== '') {
                try {
                    resolve(JSON.parse(result));
                } catch (e) {
                    reject(error);
                }
            } else {
                reject(error);
            }
        });
    });
   
}

// 获取私钥
export function getWalletPrivateKey() {
    // return AsyncStorage.getItem(WALLET_NAME+'_PRIVATEKEY');
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(WALLET_NAME+'_PRIVATEKEY', (error, result) => {
            if (!error && result !== null && result !== '') {
                try {
                    resolve(JSON.parse(result));
                } catch (e) {
                    reject(error);
                }
            } else {
                reject(error);
            }
        });
    });
}

// 删除当前钱包
export function removeWallet() {
    AsyncStorage.removeItem(WALLET_NAME+'_ADDRESS');
    AsyncStorage.removeItem(WALLET_NAME+'_PRIVATEKEY');
}

//获取以太坊余额
export function getWalletgetBalance(address) {
    // const provider = providers.getDefaultProvider('ropsten');
    return new Promise((resolve, reject) => {
        provider.getBalance(address).then( balance => {
            // balance is a BigNumber (in wei); format is as a sting (in ether)
            var etherString = ethers.utils.formatEther(balance);
            // console.log("Balance: " + etherString);
            resolve(etherString);
        }); 
    });
}


// 获取ecr20token额度 
export function getErc20Balance(ContractAddress, address){
    // console.log(ContractAddress);
    const abi = erc20_abi;
    // const provider = providers.getDefaultProvider('ropsten');
    // 创建智能合约
    const contract = new ethers.Contract(ContractAddress, abi, provider);
    return contract.balanceOf(address);
    // return new Promise((resolve, reject) => {
    //     contract.balanceOf(address).then( ercBalance => { 
    //         console.log(ecrBalance);       
    //         resolve(ecrBalance);
    //     }); 
    // });

}

// 发送一笔交易请求
export function sendTransaction(privatekey, sendaddress, eth_amount){
    console.log(sendaddress);
    console.log(eth_amount);
    var privateKey = privatekey;
    var wallet = new ethers.Wallet(privateKey);
    wallet.provider = provider; //ethers.providers.getDefaultProvider('ropsten');
    var amount = ethers.utils.parseEther(eth_amount);
    // var address = '0x88a5c2d9919e46f883eb62f7b8dd9d0cc45bc290';
    var sendPromise = wallet.send(sendaddress, amount);
    return new Promise((resolve, reject) => {
        sendPromise.then( transactionHash => {
            transactionHash['gas_limit'] = transactionHash['gasLimit'].toNumber();
            transactionHash['gas_price'] = ethers.utils.formatEther(transactionHash['gasPrice']);//toNumber();
            transactionHash['tx_cost'] = transactionHash['gas_limit']*transactionHash['gas_price'];
            resolve(transactionHash);
        });
    });
    
}

// 发送一笔交易请求
export function sendERC20Transaction(privatekey, ContractAddress, sendaddress, erc_amount){
    console.log(sendaddress);

    var privateKey = privatekey;
    var wallet = new ethers.Wallet(privateKey);
    const abi = erc20_abi;
    wallet.provider = provider; //ethers.providers.getDefaultProvider('ropsten');

    const contract = new ethers.Contract(ContractAddress, abi, wallet);
    var sendPromise = contract.transfer(sendaddress, erc_amount*100000000);
    return new Promise((resolve, reject) => {
        sendPromise.then( transactionHash => {
            console.log(transactionHash);
            transactionHash['gas_limit'] = transactionHash['gasLimit'].toNumber();
            transactionHash['gas_price'] = ethers.utils.formatEther(transactionHash['gasPrice']);//toNumber();
            transactionHash['tx_cost'] = transactionHash['gas_limit']*transactionHash['gas_price'];
            transactionHash['token_value'] = ethers.utils.formatEther(transactionHash['value']);
            resolve(transactionHash);
        });
    });
    
}