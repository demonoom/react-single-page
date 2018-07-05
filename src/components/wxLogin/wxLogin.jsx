import React from 'react';
import {Toast} from 'antd-mobile';

export default class wxLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appId: 'wx181574f3ea687daf',
            // appId: 'wx9d076742b77044dd',
            // local:'http://192.168.50.186:8091/#/',
            local:'http://jiaoxue.maaee.com:8091/#/',
            info: '###',
            jsp: 'http://www.maaee.com/elearning/common/weChatLoginOpenId.jsp',
            // jsp:'http://192.168.50.15:8080/elearning/common/weChatLoginOpenId.jsp',
            // scope:"snsapi_userinfo",//非静默授权
            scope: "snsapi_base",//静默授权

        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var local = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            local: this.state.local+local,
        }, () => {
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.state.appId + "&redirect_uri=" + encodeURIComponent(this.state.jsp) + "&response_type=code&scope=" + this.state.scope + "&state=" + encodeURIComponent(this.state.local) + "#wechat_redirect";
        })
    }

    render() {
        return (
            <div id="wxLogin">
            </div>
        );
    }
}
