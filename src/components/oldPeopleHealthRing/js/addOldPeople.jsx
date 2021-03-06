import React from "react";
import {
    Toast,
    InputItem,
    List,
    Button
} from 'antd-mobile';
import '../css/addOldPeople.less';

var calm;

/**
 * 字符串两两切割
 * @param str
 * @returns {Array|{index: number, input: string}}
 */
function splitStrTo2(str) {
    var reg = /.{2}/g, rs = str.toUpperCase().match(reg);
    rs.push(str.substring(rs.join('').length));
    return rs
}
export default class addOldPeople extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            stNameValue: '',
            heartWarnValue:90
        }
    }

    componentDidMount() {
        var resultStr = "hhahahahhahh"
        var mes;
        if (resultStr.indexOf(":") == -1) {
            var string = splitStrTo2(resultStr).join(":");
            console.log(string.length,"string.length")
            mes = string.substr(0, string.length - 1);
            console.log(mes,"mes1")

        }else {
            mes = resultStr;
            console.log(mes,"mes2")
        }
       
        Bridge.setShareAble("false");
        document.title = '老人健康手环绑定';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var refresh = locationSearch.split("&")[1].split("=")[1];
        if(refresh=="true"){
            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + "addOldPeople?uid=" + uid+"&refresh=false");
            location.reload();
        }else{
            // alert('null')
        }
        this.setState({ "uid": uid });
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', this.onWindowResize);
        this.wxchatConfig(locationHref);
       
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
     获取openID
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
                    debug: false,
                    appId: 'wx181574f3ea687daf',  // 线上用的
                    // appId: 'wx9d076742b77044dd',   //测试用的
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
                    alert(JSON.stringify(res))
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
                var mes;
                if (res.resultStr.indexOf(":") == -1) {
                    var string = splitStrTo2(res.resultStr).join(":");
                    mes = string.substr(0, string.length - 1)
                }else {
                    mes = res.resultStr;
                }
                calm.setState({
                    macId: mes.toUpperCase()
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
    * 输入框改变的回调
    */
   heartValue(e) {
    this.setState({ heartWarnValue: e });
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
                // "macAddress": "BE:BE:78:eh:67:37:11",
                "braceletName": calm.state.stNameValue,
            },
            "heartRate":calm.state.heartWarnValue
        };
        console.log(param,"param")
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('绑定成功', 1);

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
                    <div className='stName macAddress'>
                        <InputItem
                            placeholder="请扫码获取"
                            value={this.state.macId}
                            editable={false}
                        >手环ID：</InputItem>
                        <span className="scanBtn" onClick={this.scanQRCode}>扫描</span>
                    </div>
                    <div className='stName textDiv'>
                        <InputItem
                            placeholder=""
                            data-seed="logId"
                            onChange={this.heartValue.bind(this)}
                            value={this.state.heartWarnValue}
                        >预警阀值：</InputItem>
                        <span className='text'>可自定义心率预警阀值</span>
                    </div>
                </List>
                <div className="binding">
                    <span className="bindingBtn" onClick={this.binding}>提交</span>
                </div>

            </div>
        )
    }
}