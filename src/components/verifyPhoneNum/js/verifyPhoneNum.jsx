import React from 'react';
import {Toast, Button, List, InputItem} from 'antd-mobile';
import '../css/verifyPhoneNum.less'

var timer = null;
export default class verifyPhoneNum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneValue: '',
            codeValue: '',
            btnDisabled: true,
            sendButtonText: '获取验证码',
            teaBind: '',
            parBind: '',
        }
    }

    componentDidMount() {
        document.title = '欢迎登录';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var mac = searchArray[1].split('=')[1];
        this.setState({userId, mac})
    }

    phoneOnChange = (e) => {
        this.setState({phoneValue: e, telSuccess: '', btnDisabled: true}, () => {
            if (e.length == 11) {
                this.setState({
                    pending: true,
                }, () => {
                    //验证手机号码
                    let loginVerifyPhoneNumber = new Promise((resolve, reject) => {
                        this.loginVerifyPhoneNumber(function (obj) {
                            resolve(obj);
                        });
                    });
                    Promise.all([loginVerifyPhoneNumber]).then((result) => {
                        if (result[0].success) {
                            this.setState({telSuccess: 'success', btnDisabled: false})
                        } else {
                            this.setState({telSuccess: 'error'})
                        }
                        this.setState({pending: false})
                    })
                })
            }
        })
    }

    /**
     * 登录验证－检测手机号的正确性
     * @param resolve
     */
    loginVerifyPhoneNumber = (resolve) => {
        var param = {
            "method": 'loginVerifyPhoneNumber',
            "phoneNumber": this.state.phoneValue,
            "userId": this.state.userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                resolve(result)
            },
            onError: function (error) {
                Toast.info('验证手机号码请求失败');
            },
        });
    }

    codeOnChange = (e) => {
        this.setState({codeValue: e})
    }

    getCode = () => {
        var number = 60;
        timer = setInterval(function () {
            if (number < 0) {
                this.setState({
                    btnDisabled: false,
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
            btnDisabled: true,
        });
        //在此发送验证码
        this.getloginVerifyCode();
    }

    /**
     * 登录验证－获取手机验证码
     */
    getloginVerifyCode = () => {
        var param = {
            "method": 'getloginVerifyCode',
            "phoneNumber": this.state.phoneValue,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result);
            },
            onError: function (error) {

            }
        });
    }

    /**
     *登录验证－通过验证
     * public boolean passLoginVerify(String phoneNumber,String verifyMessage,String macAddress,String userId)
     */
    passLoginVerify = () => {
        if (WebServiceUtil.isEmpty(this.state.phoneValue)) {
            Toast.fail('请输入手机号码', 2)
            return
        }
        if (WebServiceUtil.isEmpty(this.state.codeValue)) {
            Toast.fail('请输入验证码', 2)
            return
        }
        var param = {
            "method": 'passLoginVerify',
            "phoneNumber": this.state.phoneValue,
            "verifyMessage": this.state.codeValue,
            "macAddress": this.state.mac,
            "userId": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success) {
                    Toast.success('验证成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finish',
                        };

                        Bridge.callHandler(data, null, function (error) {
                            // Toast.fail(error);
                            console.log(error);
                        });
                    }, 1000)
                } else {
                    Toast.fail(result.msg, 2)
                }
            },
            onError: function (error) {

            }
        });
    }

    render() {
        return (
            <div id='verifyPhoneNum' style={{textAlign: 'center'}}>
                <div className='topDiv'>
                    <div className='grayText'>为验证是本人登录，请输入注册手机号，并通过验证码再次确认。同设备上，该验证只需一次。</div>
                </div>
                <div>
                    <div className="inputDiv phone">
                        <List>
                            <InputItem
                                placeholder="请输入绑定的手机号"
                                phoneValue={this.state.phoneValue}
                                onChange={this.phoneOnChange.bind(this)}
                            />
                            <img style={{
                                display: (this.state.telSuccess == 'success' || this.state.telSuccess == 'error') && (!this.state.pending) ? 'block' : 'none'
                            }} id="telImg"
                                 src={this.state.telSuccess == 'success' ? require("../img/success1.png") : require('../img/error.png')}
                                 alt=""/>
                            <div style={{
                                display: (this.state.pending) ? 'block' : 'none'
                            }} className="telLoad">验证中...
                            </div>
                        </List>
                    </div>
                    <div className='inputDiv code'>
                        <List>
                            <InputItem
                                placeholder="请输入收到的验证码"
                                codeValue={this.state.codeValue}
                                onChange={this.codeOnChange.bind(this)}
                            />
                        </List>
                        <Button size='small' disabled={this.state.btnDisabled}
                                onClick={this.getCode}>{this.state.sendButtonText}</Button>
                    </div>

                </div>
                <div className='btn'>
                    <Button type="warning" onClick={this.passLoginVerify}>确定</Button>
                </div>
            </div>
        )
    }
}