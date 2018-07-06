import React from 'react';
import {List, InputItem, Button, Toast} from 'antd-mobile';

var arDoor;

export default class ar_Door extends React.Component {

    constructor(props) {
        super(props);
        arDoor = this;
        this.state = {
            nameInputValue: '',
            mimaInputValue: '',
            wIphone: false
        };
    }

    componentWillMount() {
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            if (phoneType.indexOf('MicroMessenger') > -1) {
                arDoor.setState({wIphone: true})
            }
        }
    }

    componentDidMount() {

    }

    success = () => {

        if (WebServiceUtil.isEmpty(this.state.nameInputValue)) {
            Toast.fail('请输入用户名', 2)
            return
        }

        if (WebServiceUtil.isEmpty(this.state.mimaInputValue)) {
            Toast.fail('请输入密码', 2)
            return
        }

        var param = {
            "method": 'judgeBuyAR',
            "account": this.state.nameInputValue,
            "passwd": this.state.mimaInputValue,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    if (result.response) {
                        // window.location.href = 'https://172.16.2.128:6443/arBook/'
                        window.location.href = 'https://www.maaee.com:6443/arBook/'
                        localStorage.setItem('loginAr', 'success');
                    } else {
                        Toast.info('您还未购买,无法使用', 2)
                    }

                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    nameInput = (value) => {
        this.setState({nameInputValue: value})
    }

    mimaInput = (value) => {
        this.setState({mimaInputValue: value})
    }

    render() {

        var _this = this;

        return (
            <div id="arDoor">
                <List>
                    <InputItem
                        onChange={this.nameInput}
                        placeholder="请输入用户名"
                        value={this.state.nameInputValue}
                    >用户名</InputItem>
                    <InputItem
                        onChange={this.mimaInput}
                        placeholder="请输入密码"
                        value={this.state.mimaInputValue}
                    >密码</InputItem>
                </List>

                <Button type="primary" onClick={this.success}>使用</Button>


                <div style={{display: this.state.wIphone ? 'block' : 'none'}}>
                    <img src={require('../img/abc.png')} alt=""/>
                </div>
            </div>
        );
    }
}
