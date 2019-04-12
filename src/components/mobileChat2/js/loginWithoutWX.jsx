import React from 'react';
import {Button, InputItem, Toast} from 'antd-mobile';

export default class loginWithoutWX extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    nameOnChange = (e) => {
        this.setState({name: e})
    };

    passWardOnChange = (e) => {
        this.setState({password: e})
    };

    /**
     * {"method":"login","username":"te6075","password":"nxd1234567"}
     */
    login = () => {
        var _this = this;
        if (this.state.name === '' || this.state.password === '') {
            Toast.fail('请输入用户名或密码');
            return
        }
        if (this.state.name.indexOf('st') != -1) {
            Toast.fail('只允许老师账号登录');
            return
        }
        var param = {
            "method": 'login',
            "username": this.state.name,
            "password": this.state.password,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success) {
                    _this.gotoContactList(result.response.colUid)
                } else {
                    Toast.fail(result.msg)
                }
            },
            onError: function (error) {
                Toast.info('请求失败');
            }
        });
    };

    gotoContactList = (id) => {
        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'contactsList2?userId=' + id)
    };

    render() {

        var _this = this;

        return (
            <div id='loginWithoutWX'>
                <InputItem
                    placeholder="请输入用户名"
                    phoneValue={this.state.name}
                    onChange={this.nameOnChange.bind(this)}
                />
                <InputItem
                    placeholder="请输入密码"
                    type='password'
                    phoneValue={this.state.password}
                    onChange={this.passWardOnChange.bind(this)}
                />

                <Button size='small'
                        onClick={this.login}>登录</Button>
            </div>
        );
    }
}
