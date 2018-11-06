import React from 'react';
import {Toast, Button, List, InputItem} from 'antd-mobile';
import '../css/KnowledgeLogin.less'

var contactsList;
var timer = null;
export default class KnowledgeLogin extends React.Component {

    constructor(props) {
        super(props);
        contactsList = this;

        this.state = {
            phoneValue: '',
            codeValue: '',
            btnDisabled: true,
            sendButtonText: '获取验证码',
            teaBind: '',
            parBind: '',
        };
    }

    componentWillMount() {
        document.title = "蚁信";   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var unionid = searchArray[0].split('=')[1];
        this.setState({unionid})
    }

    componentDidMount() {
        var _this = this;
    }

    phoneOnChange = (e) => {
        this.setState({phoneValue: e, telSuccess: '', btnDisabled: true}, () => {
            if (e.length == 11) {
                this.setState({
                    pending: true,
                }, () => {
                    //验证手机号码
                    let tea = new Promise((resolve, reject) => {
                        this.validationTel(function (obj) {
                            resolve(obj);
                        });
                    });
                    let par = new Promise((resolve, reject) => {
                        this.validationPar(function (obj) {
                            resolve(obj);
                        });
                    })
                    Promise.all([tea, par]).then((result) => {
                        this.setState({teaBind: result[0].success, parBind: result[1].success})
                        if (result[0].success || result[1].success) {
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

    validationTel = (resolve) => {
        var param = {
            "method": 'verifyUserPhoneNumber',
            "phoneNumber": this.state.phoneValue,
            "type": 'TEAC'
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

    validationPar = (resolve) => {
        var param = {
            "method": 'verifyUserPhoneNumber',
            "phoneNumber": this.state.phoneValue,
            "type": 'PAREN'
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
        this.getVerifyCodeForWeixinBinded();
    }

    getVerifyCodeForWeixinBinded = () => {
        var param = {
            "method": 'getVerifyCodeForWeixinBinded',
            "phoneNumber": this.state.phoneValue,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {

            },
            onError: function (error) {

            }
        });
    }

    bindUser = () => {
        var _this = this;
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

        let tea = new Promise((resolve, reject) => {
            this.bindUserToTea(function (obj) {
                resolve(obj);
            });
        });
        let par = new Promise((resolve, reject) => {
            this.bindUserToPar(function (obj) {
                resolve(obj);
            });
        });

        if (this.state.teaBind && !this.state.parBind) {
            Promise.all([tea]).then((result) => {
                if (result[0].success) {
                    location.replace(encodeURI(WebServiceUtil.mobileServiceURL + 'KnowledgeStatic?unionid=' + _this.state.unionid))
                } else {
                    Toast.fail(result[0].msg, 2);
                }
            })
        } else if (!this.state.teaBind && this.state.parBind) {
            Promise.all([par]).then((result) => {
                if (result[0].success) {
                    location.replace(encodeURI(WebServiceUtil.mobileServiceURL + 'KnowledgeStatic?unionid=' + _this.state.unionid))
                } else {
                    Toast.fail(result[0].msg, 2)
                }
            })
        } else if (this.state.teaBind && this.state.parBind) {
            Promise.all([tea, par]).then((result) => {
                if (result[0].success && result[1].success) {
                    location.replace(encodeURI(WebServiceUtil.mobileServiceURL + 'KnowledgeStatic?unionid=' + _this.state.unionid))
                } else if (!result[0].success && result[1].success) {
                    Toast.fail(result[0].msg, 2)
                } else if (result[0].success && !result[1].success) {
                    Toast.fail(result[1].msg, 2)
                } else if (!result[0].success && !result[1].success) {
                    Toast.fail(result[0].msg, 2)
                }
            })
        } else {

        }
    }

    bindUserToTea = (resolve) => {
        var param = {
            "method": 'saveUserOpenId',
            "phoneNumber": this.state.phoneValue,
            "openId": this.state.unionid,
            "userType": 1,
            "weiXinType": 1,
            "verifyMessage": this.state.codeValue
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                resolve(result)
            },
            onError: function (error) {
                Toast.info('请求失败');
            }
        });
    }

    bindUserToPar = (resolve) => {

        var param = {
            "method": 'saveUserOpenId',
            "phoneNumber": this.state.phoneValue,
            "openId": this.state.unionid,
            "userType": 2,
            "weiXinType": 1,
            "verifyMessage": this.state.codeValue
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                resolve(result)
            },
            onError: function (error) {
                Toast.info('请求失败');
            }
        });
    }

    render() {

        return (
            <div id='KnowledgeLogin' style={{textAlign: 'center'}}>
                <div className='topDiv'>
                    <div className="logo">
                        <img src={require("../img/loginlogo.png")}/>
                    </div>
                    <div className='text'>用户登录</div>
                    <div className='grayText'>小蚂蚁移动教学绑定微信号</div>
                </div>
                <div>
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
                    <div className='inputDiv'>
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
                    <Button type="warning" onClick={this.bindUser}>确定</Button>
                </div>
            </div>
        );
    }
}
