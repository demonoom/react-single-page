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
            tel:'',
            sendButton:true,
            code:'',
            sendButtonText:'发送验证码',
            result:'未请求',
            telSuccess: 'none',
            textFlag: true,
            // pending:true\
            openIdDisable: true, //判断有无绑定控制input disable状态
            openidFlag: false,//判断openid是否有效 true已绑定  false 未绑定
            colAccount:'TE_123',
            phoneNumber:'13500000000',
        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var openid = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            openid:openid,
        },()=>{
            this.getUserOpenIdInfoByOpenId();
        });

    }

    getUserOpenIdInfoByOpenId(){
        var param = {
            "method": 'getUserOpenIdInfoByOpenId',
            "openId": this.state.openid,
            "userType":this.state.value == 1?'TEAC':'PAREN',
            "weixinType":'1',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                // Toast.info(result.msg);
                if(result.success){
                    if(result.response){
                        this.setState({
                            openIdDisable: true,
                            openidFlag:true,
                            phoneNumber: result.response.users.phoneNumber,
                            colAccount: result.response.users.colAccount,
                            col_id:result.response.col_id,

                        })
                    }else{   //openid 未绑定
                        this.setState({
                            openIdDisable: false,
                            openidFlag:false,
                        })
                    }
                }else{

                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }



    //单选框change事件
    onChange = (value) => {
        this.setState({
            value:value,
            tel:'',//清空手机号
        },() =>{
            this.getUserOpenIdInfoByOpenId();
        });
    };



    // 手机号码change事件
    inputOnChange = (value) =>{
        console.log(value);
        this.setState({
            tel:value,
            sendButton:true,
            telSuccess:'',
        },()=>{
            if(value.length == 11){
                this.setState({
                    pending:true,
                },()=>{
                //验证手机号码
                this.validationTel();
                })
            }
        });

    }

    // 验证码输入框change事件
    inputOnChangeForCode = (value) =>{
        console.log(value);
        this.setState({
            code:value,
        });
    }

    validationTel(){
        var param = {
            "method": 'verifyUserPhoneNumber',
            "phoneNumber": this.state.tel,
            "type":this.state.value == 1?'TEAC':'PAREN'
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, 'tel');
                if(result.success){
                    this.setState({
                        telSuccess:'success',
                        sendButton: false,
                        pending: false,
                    })
                }else{
                    this.setState({
                        telSuccess:'error',
                        pending:false,
                    })
                }
            },
            onError: function (error) {
                Toast.info('验证手机号码请求失败');
            },
        });
    }
    // 发送
    getVerifyCodeForWeixinBinded = (code) =>{
        var param = {
            "method": 'getVerifyCodeForWeixinBinded',
            "phoneNumber": this.state.tel,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {

            },
            onError: function (error) {

            }
        });
    }

    // 发送验证码
    sendCode = () => {
        var number = 30;
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
        this.getVerifyCodeForWeixinBinded();

    }

    bindUser = () =>{
        var warn = "";
        if(this.state.tel == ''){
            warn = '请输入手机号码';
        }else if(this.state.code == ''){
            warn = '请输入验证码';
        }
        if(warn !== ""){
            Toast.info(warn,1);
            return;
        }
        var param = {
            "method": 'saveUserOpenId',
            "phoneNumber": this.state.tel,
            "openId":this.state.openid,
            "userType":this.state.value,
            "weiXinType":1,
            "verifyMessage":this.state.code
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, 'access');
                if (result.success) {
                    Toast.info('绑定成功');
                    this.setState({
                        result:'绑定成功',
                        textFlag:false,
                    })
                } else {
                    Toast.info(''+ result.msg);
                    this.setState({
                        result:'绑定失败:'+ result.msg,
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

    unBindAccount = () =>{
        var param = {
            "method": 'unbindUserOpenId',
            "id": this.state.col_id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
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
        const { value } = this.state;
        return (
            <div id="wxBindIndex">
                <div style={{
                    display:this.state.textFlag?'block':'none'
                }} className="isDangerArea">
                    <List renderHeader={() => '选择角色'}>
                        {data.map(i => (
                            <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i.value)}>
                                {i.label}
                            </RadioItem>
                        ))}
                    </List>
                    <WhiteSpace size="lg"/>
                    <div className="tel_element">
                        <InputItem
                            disabled={this.state.openIdDisable}
                            maxLength={11}
                            placeholder="请输入手机号码"
                            value={this.state.tel}
                            onChange={this.inputOnChange}
                        >手机号码
                        </InputItem>
                        <img style={{
                            display:(this.state.telSuccess == 'success' || this.state.telSuccess == 'error') && (!this.state.pending)?'block':'none'
                        }} id="telImg" src={this.state.telSuccess == 'success'?require("./imgs/success1.png"):require('./imgs/error.png')} alt=""/>
                        <div style={{
                            display:(this.state.pending)?'block':'none'
                        }} className="telLoad">验证中...</div>
                    </div>

                    <WhiteSpace size="lg"/>
                    <div className="Verification">
                        <InputItem
                            disabled={this.state.openIdDisable}
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
                        <Button disabled={this.state.openIdDisable} type="primary" onClick={this.bindUser}>提交</Button>
                    </div>


                    {/*<div>测试保存接口返回:{this.state.result}</div>*/}
                    {/*<div>openId:{this.state.openid}</div>*/}
                </div>
                {/*解绑标签块*/}
                <div style={{
                    display:this.state.openidFlag?'block':'none'
                }}>
                    <div>您的微信已绑定以下账号</div>
                    <div>账号:{this.state.colAccount}</div>
                    <div>手机号:{this.state.phoneNumber}</div>
                    <Button onClick={this.unBindAccount}>解绑</Button>
                </div>
                {/*解绑标签块 end*/}
                <div className="empty_center success3" style={{
                    display:this.state.textFlag?'none':'block'
                }}><i></i><div>绑定成功</div></div>
            </div>
        );
    }
}