import React from 'react';
import {Toast, Button, List, InputItem} from 'antd-mobile'

var contactsList;

export default class chatLogin extends React.Component {

    constructor(props) {
        super(props);
        contactsList = this;

        this.state = {
            phoneValue: '',
            codeValue: '',
            btnDisabled: true,
        };
    }

    componentWillMount() {
        document.title = "蚁信";   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var unionid = searchArray[0].split('=')[1];
        console.log(unionid);
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

    render() {
        
        return (
            <div id='chatLogin' style={{textAlign: 'center'}}>
                <div>
                    <img src={require("../img/loginlogo.png")}/>
                    <div>蚁信</div>
                    <div>小蚂蚁移动教学快捷通讯录</div>
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
                    <List>
                        <InputItem
                            placeholder="请输入收到的验证码"
                            codeValue={this.state.codeValue}
                            onChange={this.codeOnChange.bind(this)}
                        />
                    </List>
                    <Button size='small' disabled={this.state.btnDisabled}>获取验证码</Button>
                </div>
                <Button type="warning">确定</Button>
                <div>支持教师端和家长端快捷通讯录同步使用</div>
            </div>
        );
    }
}
