import React from 'react';
import { Button, List, InputItem} from 'antd-mobile';
import '../css/chatLogin.less'

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
