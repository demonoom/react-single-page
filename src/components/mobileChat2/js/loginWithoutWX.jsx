import React from 'react';
import {Button, InputItem} from 'antd-mobile';

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
        console.log(e);
    };

    passWardOnChange = (e) => {
        console.log(e);
    };

    login = () => {

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
