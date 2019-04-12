import React from 'react';
<<<<<<< HEAD
import { Button, List, InputItem} from 'antd-mobile';
import '../css/chatLogin.less'
=======
import {Button, InputItem, Toast} from 'antd-mobile';
>>>>>>> 8e776e8ac985ef65b5afedb17bb16e4ed4e1acc9

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
            <div id='chatLogin' style={{textAlign: 'center'}}>
                <div className='topDiv'>
                    <div className="logo">
                        <img src={require("../img/loginlogo.png")}/>
                    </div>
                    <div className='text'>蚁信</div>
                    <div className='grayText'>小蚂蚁移动教学快捷通讯录</div>
                </div>
                <div className="inputDiv">
                    <List>
                    <InputItem
                        placeholder="请输入用户名"
                        phoneValue={this.state.name}
                        onChange={this.nameOnChange.bind(this)}
                    />
                    </List>
                </div>
                <div className="inputDiv">
                    <List>
                    <InputItem
                        placeholder="请输入密码"
                        type='password'
                        phoneValue={this.state.password}
                        onChange={this.passWardOnChange.bind(this)}
                    />
                    </List>
                </div>
                <div className='btn'>
                    <Button type="warning" onClick={this.login}>登录</Button>
                </div>
            </div>
        );
    }
}
