import React from "react";
import {
    
    InputItem,
    List,
} from 'antd-mobile';

export default class addOldPeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientHeight: document.body.clientHeight,
            stNameValue: '',
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '老人健康手环绑定';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', this.onWindowResize)
    }


    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            bindDing.setState({clientHeight: document.body.clientHeight, calmHeight: document.body.clientHeight - 296});
        }, 100)
    }

     /**
     * 调用客户端扫码
     */
    scanMac() {
        var param = {
            "method": 'getWeChatSignature',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result.response);
                let res = result.response;
                wx.config({
                    debug: true,
                    appId: 'wx9d076742b77044dd',
                    timestamp: res.timestamp,
                    nonceStr: res.noncestr,
                    signature: res.signature,
                    jsApiList: [
                        'checkJsApi',
                        'chooseImage',
                        'scanQRCode'
                    ]
                });
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: [
                            'chooseImage',
                            'previewImage',
                            'scanQRCode'
                        ],
                        success: function (res) {

                        }
                    });
                })
                wx.error(function (res) {
                    // Toast.info(res);
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });

            },
            onError: function (error) {

            },
        });
    };

     /**
     * 输入框改变的回调
     */
    inputOnChange(e) {
        this.setState({stNameValue: e});
    }

    /**
     * 绑定
     */
    binding = () => {
        var _this = this;
        if (this.state.searchCheckValue == '' || this.state.macId == '') {
            Toast.fail('未选择学生或手环',3)
            return
        }
        var param = {
            "method": 'bindWatch',
            "name": this.state.stNameValue,
            "mac": this.state.macId,
            "opId": this.state.uid,
        };
        console.log(param);
        return
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('绑定成功', 1);
                    $('.tableDiv').show("fast");
                    _this.state.macId = '';
                    _this.state.stNameValue = '';
                    _this.setState({chooseResultDiv: 'none'});
                    _this.viewWatchPage(_this.state.loginUser);
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
    render() {
        return (
            <div style={{ height: this.state.clientHeight }}>


                <List>
                    

                    <div className='stName'>
                        <InputItem
                            placeholder="请输入学生姓名并搜索"
                            data-seed="logId"
                            onChange={this.inputOnChange.bind(this)}
                            value={this.state.stNameValue}
                        >手环名称：</InputItem>
                    </div>
                    <div className='macAddress'>
                        <InputItem
                            value={this.state.macId}
                            editable={false}
                        >手环：</InputItem>
                        <span onClick={this.scanMac}>扫描</span>
                    </div>
                </List>
                <div className="bottomBox">
                    <span className="bind" onClick={this.binding}>提交</span>
                </div>

            </div>
        )
    }
}