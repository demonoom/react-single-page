import React from 'react';
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

export default class wxTempalte extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            access: '不存在',
            template: '未发送'
        };

    }

    componentDidMount() {
        var appId = "";
        var sercret = "";
        var openId = "";

    }

    getAccess = () => {
        console.log('开始获取access');
        var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential';
        $.ajax(url, {
            data: {
                'appid': 'wx9d076742b77044dd',
                'secret': '1381cd42ea0584ec81ab44c9b41593ec'
            },
            // dataType: 'jsonp',
            // crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            success: function(data) {
                console.log(data);
                if(data && data.resultcode == '200'){
                    console.log(data.result.today);
                }
            }
        });
        // $.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx9d076742b77044dd&secret=1381cd42ea0584ec81ab44c9b41593ec",function(res){
        //    console.log(res);
        // });
    }

    sendTemplate = () => {
        console.log('开始发送template');
    }

    render() {
        return (
            <div id="wxTemplate">
                <button onClick={this.getAccess}>请求access_token</button>
                <div>access_token:{this.state.access}</div>
                <button onClick={this.sendTemplate}>发送模板</button>
                <div>发送结果:{this.state.template}</div>
                <iframe src="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx9d076742b77044dd&secret=1381cd42ea0584ec81ab44c9b41593ec"></iframe>
            </div>
        );
    }
}
