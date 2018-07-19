import React from "react";
import {
    Toast,
    InputItem,
    List,
} from 'antd-mobile';
import '../css/addOldPeople.less';

var calm;
export default class addOldPeople extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
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
        this.wxchatConfig(locationHref);
        console.log(uid)
    }


    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            bindDing.setState({ clientHeight: document.body.clientHeight, calmHeight: document.body.clientHeight - 296 });
        }, 100)
    }


    /**
     *微信配置
     */
    wxchatConfig(locationHref) {
        var param = {
            "method": 'getWeChatSignature',
            "url": locationHref
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result)
                // Toast.info(result.response);
                let res = result.response;
                wx.config({
                    debug: true,
                    appId: 'wx181574f3ea687daf',
                    timestamp: res.timestamp,
                    nonceStr: res.noncestr,
                    signature: res.signature,
                    jsApiList: [
                        'checkJsApi',
                        'scanQRCode'
                    ]
                });
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: [
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
    }
    /**
    * 调用微信扫描
    */

    scanQRCode() {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                calm.setState({
                    macId: res.resultStr
                })
                // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            }
        });
    }

    /**
    * 输入框改变的回调
    */
    inputOnChange(e) {
        this.setState({ stNameValue: e });
    }

    /**
     * 绑定
     */
    binding = () => {
        if (calm.state.stNameValue == "") {
            Toast.info("请输入手环名称")
            return
        }
        var param = {
            "method": 'bindOldManBraceletToWeChat',
            "bracelet": {
                "weChatOpenId": calm.state.uid,
                "macAddress": calm.state.macId,
                "braceletName": calm.state.stNameValue
            }
        };
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('绑定成功', 1);
                   
                    // $(function () {
                    //     pushHistory();
                    //     window.addEventListener("popstate", function (e) {
                    //         window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + "bindPeopleList?uid=" + calm.state.uid);
                    //     }, false);
                    //     function pushHistory() {
                    //         var state = {
                    //             title: "title",
                    //             url: "#"
                    //         };
                    //         window.history.pushState(state, "title", "#");
                    //     }
                    // });

                    location.replace(encodeURI(WebServiceUtil.mobileServiceURL + "bindPeopleList?uid=" + calm.state.uid))

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
            <div id="addOldPeople" style={{ height: this.state.clientHeight }}>
                <List>
                    <div className='stName'>
                        <InputItem
                            placeholder="请输入名称"
                            data-seed="logId"
                            onChange={this.inputOnChange.bind(this)}
                            value={this.state.stNameValue}
                        >手环名称：</InputItem>
                    </div>
                    <div className='macAddress'>
                        <InputItem
                            placeholder="请扫码获取"
                            value={this.state.macId}
                            editable={false}
                        >手环ID：</InputItem>
                        <span className="scanBtn" onClick={this.scanQRCode}>扫描</span>
                    </div>
                </List>
                <div className="binding">
                    <span className="bindingBtn" onClick={this.binding}>提交</span>
                </div>

            </div>
        )
    }
}