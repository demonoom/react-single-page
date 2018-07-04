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
        var param = {
            "method": 'getAccessTokenForPublicWx',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, 'access');
                if (result.success) {
                    console.log(result.response.access_token);
                    this.setState({
                        access: result.response,
                    })
                } else {
                    Toast.info('获取token失败');
                }
            },
            onError: function (error) {
                Toast.info('请求access_token失败');
            }
        });
    }

    sendTemplate = () => {
        var param = {
            "method": 'postTemplateMessageForPublicWx',
            "accessToken": this.state.access,
            "messageJson": {
                "touser": "oHVXv0TFo3DMoDAsjIWPduYtG3x4",
                "template_id": "i2POFltLLGjGhgMp0elwcGWlOU2IIFZE4lA8yWiabPA",
                "url": "http://weixin.qq.com/download",
                "miniprogram": {
                    // "appid":"xiaochengxuappid12345",
                    // "pagepath":"index?foo=bar"
                },
                "data": {
                    "first": {
                        "value":"~~~~~~",
                        "color":"#173177"
                    },
                    "keyword1":{
                        "value":"学生张三心率超出100",
                        "color":"#173177"
                    },
                    "keyword2": {
                        "value":"2018-06-08",
                        "color":"#173177"
                    },
                    //    "keyword3": {
                    //        "value":"2014年9月22日",
                    //        "color":"#173177"
                    //    },
                    "remark":{
                        "value":"",
                        "color":"#173177"
                    }
                }
            }
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, 'access');
                if (result.success) {

                } else {
                    Toast.info('发送失败');
                }
            },
            onError: function (error) {
                Toast.info('请求发送模板消息失败');
            }
        });
        // console.log('开始发送template');
        // var url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=11_V5wlcn7QXlLtl9zEvM86Rc8Z28BbztQHZrIH-LdS3VAXiR_3S6egRSffWMpLGuMjM7hJt4AQykas1b9Q31muX0yOmCOXCR1-LNUbkiZt-eRqRQImYGplTHSXSDMXz4QAFgbFStBYs-8ysycBTJReAAAWMU"
        // $.ajax(url,{
        //     data:{
        //         "touser":"oAYBW0kTVTiqF4t0yVQYXqrZetvI",
        //         "template_id":"arw6Po189Sx_CrwavyNjfvvW8wKwpMpiw_oshpLj4C4",
        //         "url":"http://weixin.qq.com/download",
        //         "miniprogram":{
        //             // "appid":"xiaochengxuappid12345",
        //             // "pagepath":"index?foo=bar"
        //         },
        //         "data":{
        //             "first": {
        //                 "value":"恭喜你购买成功！",
        //                 "color":"#173177"
        //             },
        //             "keyword1":{
        //                 "value":"巧克力",
        //                 "color":"#173177"
        //             },
        //             "keyword2": {
        //                 "value":"39.8元",
        //                 "color":"#173177"
        //             },
        //             "keyword3": {
        //                 "value":"2014年9月22日",
        //                 "color":"#173177"
        //             },
        //             "remark":{
        //                 "value":"欢迎再次购买！",
        //                 "color":"#173177"
        //             }
        //         }
        //     },
        //     function(res){
        //         console.log(res);
        //     },
        //     function(res){
        //         console.log(res);
        //     }
        // })
    }

    render() {
        return (
            <div id="wxTemplate">
                <button onClick={this.getAccess}>请求access_token</button>
                <div>access_token:{this.state.access}</div>
                <button onClick={this.sendTemplate}>发送模板</button>
                <div>发送结果:{this.state.template}</div>
                {/*<iframe id="ifame" src="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx9d076742b77044dd&secret=1381cd42ea0584ec81ab44c9b41593ec"></iframe>*/}
            </div>
        );
    }
}
