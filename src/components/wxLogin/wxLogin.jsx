import React from 'react';
// import './wxLogin.less'
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

export default class wxLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appId: 'wx9d076742b77044dd',
            local: window.location.href,
            info:'###',
            openid:0
        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var openid = locationSearch.split("&")[0].split('=')[1];
            if(openid){
                this.setState({
                    info:'页面已跳转回来',
                })
                this.setState({
                    openid: openid,
                })
            }else{
                this.setState({
                    info:'微信授权发起,正在跳转至授权链接...',
                })
                setTimeout(function () {
                    console.log(this.state.local);
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.state.appId + "&redirect_uri=" + encodeURIComponent('http://192.168.50.15:8080/elearning//common/weChatLoginOpenId.jsp') + "&response_type=code&scope=snsapi_userinfo&state="+encodeURIComponent(this.state.local)+"#wechat_redirect";
                }.bind(this), 2000)
            }

    }

    render() {
        return (
            <div id="wxLogin">
                <div style={{color:'red'}}>info :  {this.state.info}</div>
                <div style={{color:'green'}}>openId : {this.state.openid}</div>
                <div style={{color:'pink'}}>openId : {this.state.local}</div>
            </div>
        );
    }
}
