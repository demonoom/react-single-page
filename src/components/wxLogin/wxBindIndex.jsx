import React from 'react';
import './css/wxBindIndex.less'
import {List, Toast, ListView, Button, InputItem,Radio, WhiteSpace} from 'antd-mobile';

const RadioItem = Radio.RadioItem;
const data = [
    { value: 1, label: '教师' },
    { value: 2, label: '家长' },
];
var timer = null;
export default class wxBindIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openid:'',
            testText:'',
            value: 1,  // 1 教师  2  家长
            tel:'1769119300',
            sendButton:true,
            code:'',
            sendButtonText:'发送验证码',
            result:'未请求',
        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var openid = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            openid:openid,
        })

    }



    //单选框change事件
    onChange = (value) => {
        console.log(value);
        this.setState({
            value,
        });

    };



    // 手机号码change事件
    inputOnChange = (value) =>{
        console.log(value);
        this.setState({
            tel:value,
            sendButton:true,
        });
        if(value.length == 11){
            console.log('手机号码输入完成');
            this.setState({
                sendButton: false,
            })
        }
    }

    // 验证码输入框change事件
    inputOnChangeForCode = (value) =>{
        console.log(value);
        this.setState({
            code:value,
        });
    }


    // 验证验证码
    validationCode = (code) =>{
        // var param = {
        //     "method": 'postTemplateMessageForPublicWx',
        //     "accessToken": this.state.access,
        // };
        // WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
        //     onResponse: (result) => {
        //         console.log(result, 'access');
        //         if (result.success) {
        //
        //         } else {
        //             Toast.info('发送失败');
        //         }
        //     },
        //     onError: function (error) {
        //         Toast.info('请求发送模板消息失败');
        //     }
        // });
        return true;  //true为验证成功  反之失败
    }

    // 发送验证码
    sendCode = () => {
        console.log('发送验证码');
        var number = 6;
        timer = setInterval(function(){
            console.log(number);
            if(number < 0){
                this.setState({
                    sendButton:false,
                    sendButtonText:'重新发送',
                })
                clearInterval(timer);
            }else{
                this.setState({
                    sendButtonText:'重新发送('+number+')'
                })
                number--;
            }
        }.bind(this),1000)
        this.setState({
            sendButton:true,
        });
        //在此发送验证码
    }

    bindUser = () =>{
        console.log('开始绑定');
        console.log('openId:'+this.state.openid);
        console.log('用户类型:'+this.state.value);
        console.log('手机号码:'+this.state.tel);
        console.log('验证码:'+this.state.code);
        // var warn = "";
        // if(this.state.tel == ''){
        //     warn = '请输入手机号码';
        // }else if(this.state.code == ''){
        //     warn = '请输入验证码';
        // }else if (!this.validationCode(this.state.code)){
        //     warn = '验证码验证失败';
        // }
        // if(warn !== ""){
        //     Toast.info(warn,1);
        //     return;
        // }
        // Toast.info('绑定成功');
        var param = {
            "method": 'saveUserOpenId',
            "phoneNumber": this.state.tel,
            "openId":this.state.openid,
            "userType":this.state.value,
            "weiXinType":1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, 'access');
                if (result.success) {
                    Toast.info('成功');
                    this.setState({
                        result:'成功',
                    })
                } else {
                    Toast.info('保存失败');
                    this.setState({
                        result:'保存失败:'+ result.msg,
                    })
                }
            },
            onError: function (error) {
                Toast.info('请求失败');
                this.setState({
                    result:'请求失败',
                })
            }
        });
    }





    render() {
        const { value } = this.state;
        return (
            <div id="wxBindIndex">
                <div className="isDangerArea">
                    <List renderHeader={() => '选择角色'}>
                        {data.map(i => (
                            <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i.value)}>
                                {i.label}
                            </RadioItem>
                        ))}
                    </List>
                    <WhiteSpace size="lg"/>
                    <InputItem
                        // className="add_element"
                        maxLength={100}
                        placeholder="请输入手机号码"
                        value={this.state.tel}
                        onChange={this.inputOnChange}
                    >手机号码
                    </InputItem>
                    <WhiteSpace size="lg"/>
                    <div className="Verification">
                        <InputItem
                            // className="add_element"
                            maxLength={100}
                            placeholder="请输入验证码"
                            value={this.state.code}
                            onChange={this.inputOnChangeForCode}
                        >
                            <Button type="primary" size="small" disabled={this.state.sendButton} onClick={this.sendCode}>{this.state.sendButtonText}</Button>
                        </InputItem>
                    </div>
                    <div>{this.state.testText}</div>
                    <div className="submitBtn">
                        <Button type="primary" onClick={this.bindUser}>提交</Button>
                    </div>


                    <div>测试保存接口返回:{this.state.result}</div>
                    <div>openId:{this.state.openid}</div>
                </div>
            </div>
        );
    }
}
