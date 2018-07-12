import { decorate, observable, action, computed } from "mobx";

class tokenModel {
    id = Math.random();
    contactlist;//联系人
    tokens;
    
    
    get getContactList() {
        // const  contactlist = this.contactlist,
        return this.contactlist;
    }

    //获取所有token值的方法
    get getTokenData() {
        let tokens = [];
        tokens = this.tokens
        return tokens;
    }

    //设置token值的方法
    contactListSet(contactlist) {
        this.contactlist = contactlist;
    }

    // token设定
    tokensSet(tokens) {
        this.tokens = tokens;
    }
    
    //添加联系人
    contactListPush(onecontact){
        console.log(onecontact);
        this.contactlist.push(onecontact); 
    }

    //添加币种
    tokensPush(onetoken){
        this.tokens.push(onetoken);
    }

    clearAll() {
        this.contactlist = [];
        this.tokens = [];
    }
}

decorate(tokenModel, {
    contact_list: observable,
    tokens: observable,
    contactListSet: action,
    tokensSet: action,
    contactListPush: action,
    tokensPush: action,
    getTokenData: computed,
    getContactList: computed

});

export default new tokenModel();