import React from 'react';
import '../css/wxBindProperly.less'
import { Toast, Button, InputItem, WhiteSpace, Modal} from 'antd-mobile';
var timer = null;
const prompt = Modal.prompt;
export default class wxBindProperly extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openid: '',
            tel: '',
            sendButton: true,
            code: '',
            sendButtonText: '发送验证码',
            telSuccess: 'none',
            textFlag: true,
            // pending:true\
            openidFlag: false,//判断openid是否有效 true已绑定  false 未绑定
            colAccount: '',
            phoneNumber: '',
        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var openid = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            openid: openid,
        }, () => {
            this.getBindWechatByOpenId();
        });

    }

    //根据openid判断绑定情况
    getBindWechatByOpenId() {
        var param = {
            "method": 'getBindWechatByOpenId',
            "openId": this.state.openid,
        };
        WebServiceUtil.requestArPaymentApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result);
                if (result.success) {
                    if (result.response) {
                        this.setState({
                            openidFlag: true,
                            userName: result.response.user.userName,
                            phoneNumber: result.response.phoneNumber
                        })
                    } else {   //openid 未绑定
                        this.setState({
                            openidFlag: false,
                        })
                    }
                } else {

                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }


    // 手机号码change事件
    inputOnChange = (value) => {
        this.setState({
            tel: value,
            sendButton: true,
            telSuccess: '',
        }
        , () => {
            if (value.length == 11) {
                this.setState({
                    sendButton:false,
                })
                // this.setState({
                //     pending: true,
                // }, () => {
                //     //验证手机号码
                //     this.validationTel();
                // })
            }else{
                this.setState({
                    sendButton:true
                })
            }
        }
        );

    }

    // 验证码输入框change事件
    inputOnChangeForCode = (value) => {
        this.setState({
            code: value,
        });
    }

    //验证手机号码
    // validationTel() {
    //     var param = {
    //         "method": 'verifyUserPhoneNumber',
    //         "phoneNumber": this.state.tel,
    //     };
    //     WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
    //         onResponse: (result) => {
    //             console.log(result, 'tel');
    //             if (result.success) {
    //                 this.setState({
    //                     telSuccess: 'success',
    //                     sendButton: false,
    //                     pending: false,
    //                 })
    //             } else {
    //                 this.setState({
    //                     telSuccess: 'error',
    //                     pending: false,
    //                 })
    //             }
    //         },
    //         onError: function (error) {
    //             Toast.info('验证手机号码请求失败');
    //         },
    //     });
    // }

    // 发送
    getVerifyCodeForLittleVideoBinded = (code) => {
        var param = {
            "method": 'getVerifyCodeForLittleVideoBinded',
            "phoneNumber": this.state.tel,
        };
        WebServiceUtil.requestArPaymentApi(JSON.stringify(param), {
            onResponse: (result) => {

            },
            onError: function (error) {

            }
        });
    }

    // 发送验证码
    sendCode = () => {
        var number = 60;
        timer = setInterval(function () {
            // console.log(number);
            if (number < 0) {
                this.setState({
                    sendButton: false,
                    sendButtonText: '重新发送',
                })
                clearInterval(timer);
            } else {
                this.setState({
                    sendButtonText: '重新发送(' + number + ')'
                })
                number--;
            }
        }.bind(this), 1000)
        this.setState({
            sendButton: true,
        });
        //在此发送验证码
        this.getVerifyCodeForLittleVideoBinded();

    }

    bindUser = () => {
        var warn = "";
        if (this.state.tel == '') {
            warn = '请输入手机号码';
        } else if (this.state.code == '') {
            warn = '请输入验证码';
        }
        if (warn !== "") {
            Toast.info(warn, 1);
            return;
        }
        var param = {
            "method": 'bindWechatToLittleVideo',
            "phoneNumber": this.state.tel,
            "openId": this.state.openid,
            "verifyCode": this.state.code
        };
        WebServiceUtil.requestArPaymentApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success) {
                    this.setState({
                        textFlag: false,
                    })
                } else {
                    Toast.info('' + result.msg);
                }
            },
            onError: function (error) {
                Toast.info('请求失败');
            }
        });
    }

    unBindAccount = () => {
        var param = {
            "method": 'unBindWechatToLittleVideo',
            "openId": this.state.openid,
        };
        WebServiceUtil.requestArPaymentApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success && result.response) {
                    Toast.info('解绑成功');
                    location.reload();
                } else {
                    Toast.info('解绑失败');
                }
            },
            onError: function (error) {
                Toast.info('请求失败');
            }
        });
    }



    render() {
        return (
            <div id="wxBindProperly">
                <div style={{
                    display: this.state.textFlag ? 'block' : 'none'
                }} className="isDangerArea">
                    <div style={{
                        display: !this.state.openidFlag ? 'block' : 'none'
                    }}>
                        <div className="tel_element">
                            <InputItem
                                maxLength={11}
                                placeholder="请输入手机号码"
                                value={this.state.tel}
                                onChange={this.inputOnChange}
                            >手机号码
                            </InputItem>
                            <img style={{
                                display: (this.state.telSuccess == 'success' || this.state.telSuccess == 'error') && (!this.state.pending) ? 'block' : 'none'
                            }} id="telImg"
                                 src={this.state.telSuccess == 'success' ? require("../imgs/success1.png") : require('../imgs/error.png')}
                                 alt=""/>
                            <div style={{
                                display: (this.state.pending) ? 'block' : 'none'
                            }} className="telLoad">验证中...
                            </div>
                        </div>
                        <div className="Verification">
                            <InputItem
                                // className="add_element"
                                maxLength={100}
                                placeholder="请输入验证码"
                                value={this.state.code}
                                onChange={this.inputOnChangeForCode}
                            >验证码
                            </InputItem>
                            <Button type="primary" size="small" disabled={this.state.sendButton}
                                    onClick={this.sendCode}>{this.state.sendButtonText}</Button>
                        </div>
                        <div className="submitBtn_green">
                            <Button type="primary" onClick={this.bindUser}>提交</Button>
                        </div>
                    </div>
                </div>
                {/*解绑标签块 start*/}
                <WhiteSpace size="lg"/>
                <div className="bindingNumber" style={{
                    display: this.state.openidFlag ? 'block' : 'none'
                }}>
                    <div>
                        <div>您的微信已绑定以下账号</div>
                        <div>
                            <span><i className="i-icon i-phone"></i>{this.state.userName}</span>
                            <span><i className="i-icon i-tel"></i>{this.state.phoneNumber}</span>
                        </div>
                        <Button onClick={this.unBindAccount}>解绑</Button>
                    </div>

                </div>
                <WhiteSpace size="lg"/>
                <div className="bindingNumber" style={{display: !this.state.openidFlag ? 'none' : this.state.value != 2 ? 'none' : 'block'}}>

                </div>
                {/*解绑标签块 end*/}
                <div className="empty_center success3" style={{
                    display: this.state.textFlag ? 'none' : 'inline-block'
                }}><i></i>
                    <div>绑定成功</div>
                </div>
            </div>
        );
    }
}
