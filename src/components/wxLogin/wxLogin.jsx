import React from 'react';
// import './wxLogin.less'
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

export default class wxLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appId: 'wx9d076742b77044dd',
            code: '无code值',
            local: window.location.href,
            info:'###'
        };
        // Toast.info(localStorage.getItem('userInfo'));
        // localStorage.setItem('userInfo','123');
        // localStorage.clear()

    }

    componentDidMount() {
        console.log(this.state.local)
        if (this.GetQueryString('code')) {
            this.setState({
                info:'微信授权成功,已登录,准备获取openId',
            })
            var code = this.GetQueryString('code');
            this.setState({
                code: code,
            })
            //发送请求
        } else {
            this.setState({
                info:'微信授权发起,正在跳转至授权链接...',
            })
            setTimeout(function () {
                console.log(this.state.local);
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.state.appId + "&redirect_uri=" + encodeURIComponent(this.state.local) + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
            }.bind(this), 5000)
        }

    }


    login() {
        try {
            var params = {
                secret: '1381cd42ea0584ec81ab44c9b41593ec',
                appid: 'wx9d076742b77044dd',
                code: this.state.code
            }
            $.ajax({
                type: "get",
                url: 'http://192.168.50.15:8080/elearning//common/weChatLoginOpenId.jsp',
                data: params,
                // dataType: "jsonp",
                // jsonp: "callback",
                success: function (result) {
                    console.log(result, 'success');
                    Toast.info(result, 'success');
                    this.setState({
                        info:'获取openId已成功,请绑定',
                    })
                }.bind(this),
                error: function(error){
                    Toast.info('请求openId失败');
                    this.setState({
                        info:'请求获取openId已失败..'
                    })
                }.bind(this)
            });
        }catch(error){
            Toast.info('报错');
            this.setState({
                info:'请求方法体出错...'
            })
        }

    }

    //获取地址栏指定参数
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    render() {
        return (
            <div id="wxLogin">
                <button onClick={this.login.bind(this)}>请求openId</button>
                <div>code: {this.state.code}</div>
                <p style={{color:'green'}}>local: {this.state.local}</p>
                <div style={{color:'red'}}>info :  {this.state.info}</div>
            </div>
        );
    }
}
