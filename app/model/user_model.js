import { decorate, observable, action, computed } from "mobx";

class userModel {
    id = Math.random();
    uid;
    username;
    telephone;
    address;
    privatekey;
    verifyed;
    eth_rpc_url = 'https://ropsten.infura.io/2HYjJPg60m2fP9SjrEI8';
    img_url = '';
    get getAllData() {
        const data = {
            uid: this.uid,
            username: this.username,
            telephone: this.telephone,
            address: this.address,
            privatekey: this.privatekey,
            verifyed:this.verifyed,
            img_url:this.img_url,
            eth_rpc_url:this.eth_rpc_url,
        };
        return data;
    }

    allSet(jsonData) {
       
        if (jsonData['uid']) {
            this.uid = jsonData['uid'];
        }

        if (jsonData['username']) {
            // console.log(jsonData['username']);
            this.username = jsonData['username'];
        }

        if (jsonData['telephone']) {
            this.telephone = jsonData['telephone'];
        }

        if (jsonData['address']) {
            this.address = jsonData['address'];
        }

        if (jsonData['privatekey']) {
            this.privatekey = jsonData['privatekey'];
        }
        
        if (jsonData['verifyed']) {
            this.verifyed = jsonData['verifyed'];
        }

        if(jsonData['img_url']) {
            this.img_url = jsonData['img_url'];
        }
    }

    uidSet(uid) {
        this.uid = uid;
    }

    usernameSet(username) {
        this.username = username;
    }

    telephoneSet(telephone) {
        this.telephone = telephone;
    }

    addressSet(address) {
        this.address = address;
    }
    privatekeySet(privatekey) {
        this.privatekey = privatekey;
    }

    verifyedSet(verifyed) {
        this.verifyed = verifyed;
    }

    clearAll() {
        this.uid = '';
        this.username = '';
        this.telephone = '';
        this.address = '';
        this.privatekey = '';
    }
}

decorate(userModel, {
    uid: observable,
    username: observable,
    telephone: observable,
    address: observable,
    privatekey: observable,
    verifyed:observable,
    eth_rpc_url:observable,
    img_url:observable,
    allSet: action,
    uidSet: action,
    usernameSet: action,
    telephoneSet: action,
    addressSet: action,
    privatekeySet: action,
    verifyedSet:action,
    clearAll:action,
    getAllData: computed

});

export default new userModel();