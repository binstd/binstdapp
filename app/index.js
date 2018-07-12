import React from "react";
import { createRootNavigator } from "./router";
import { isSignedIn } from "./auth";

/**
 * 启动函数
 * @export
 * @class App
 * @extends {React.Component}
 */
/* 启动页 =============================================================== */
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    // 检测是否登陆
    isSignedIn().then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;
    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }
    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }

}
