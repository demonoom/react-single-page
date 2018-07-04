import React from 'react';
// import './wxLogin.less'
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

export default class wxLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appId: 'wx181574f3ea687daf',
            // appId: 'wx9d076742b77044dd',
            // local: window.location.href,  //回调跳转的页面
            // local:"http://192.168.50.186:8091/#/wxBindIndex",  //回调跳转的页面
            local:"http://jiaoxue.maaee.com:8091/#/wxBindIndex",  //回调跳转的页面
            info:'###',
            openid:0,
            scope:"snsapi_base",//静默授权
            jsp:'http://www.maaee.com/elearning/common/weChatLoginOpenId.jsp',
            // jsp:'http://192.168.50.15:8080/elearning/common/weChatLoginOpenId.jsp'
            // scope:"snsapi_userinfo",//非静默授权

        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var openid = locationSearch.split("&")[0].split('=')[1];
        console.log();
            if(openid){
                this.setState({
                    info:'页面已跳转回来',
                })
                this.setState({
                    openid: JSON.parse(openid).openid,
                })

            }else{
                this.setState({
                    info:'微信授权发起,正在跳转至授权链接...',
                })
                setTimeout(function () {
                    console.log(this.state.local);
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.state.appId + "&redirect_uri=" + encodeURIComponent(this.state.jsp) + "&response_type=code&scope="+this.state.scope+"&state="+encodeURIComponent(this.state.local)+"#wechat_redirect";
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
