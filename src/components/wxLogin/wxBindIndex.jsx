import React from 'react';
import './css/wxBindIndex.less'
import {List, Toast, ListView, Button, InputItem, Radio, WhiteSpace, Modal} from 'antd-mobile';

const RadioItem = Radio.RadioItem;
const Item = List.Item;
const data = [
    {value: 2, label: '家长'},
    {value: 1, label: '教师'},
];
var timer = null;
const prompt = Modal.prompt;
export default class wxBindIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openid: '',
            testText: '',
            value: 2,  // 1 教师  2  家长
            tel: '',
            sendButton: true,
            code: '',
            sendButtonText: '发送验证码',
            result: '未请求',
            telSuccess: 'none',
            textFlag: true,
            // pending:true\
            openidFlag: false,//判断openid是否有效 true已绑定  false 未绑定
            colAccount: '',
            phoneNumber: '',
            stuLis: [],
            userName:''
        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var openid = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            openid: openid,
        }, () => {
            this.getUserOpenIdInfoByOpenId();
            var that = this;

        });

    }

    getUserOpenIdInfoByOpenId() {
        var param = {
            "method": 'getUserOpenIdInfoByOpenId',
            "openId": this.state.openid,
            "userType": this.state.value == 1 ? 'TEAC' : 'PAREN',
            "weixinType": '1',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success) {
                    if (!!result.response) {
                        this.setState({
                            openidFlag: true,
                            phoneNumber: result.response.users.phoneNumber,
                            colAccount: result.response.users.colAccount,
                            userName: result.response.users.userName,
                            col_id: result.response.col_id,
                            col_obj: result.response,
                            col_uid: result.response.col_uid

                        })
                        if (result.response.users.colUtype == 'PAREN') {
                            this.getBindedChildren(result.response)
                        }
                    } else {   //openid 未绑定
                        this.setState({
                            openidFlag: false,
                            // openidFlag: true, //debug
                        })
                    }
                } else {

                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }

    //获取此家长绑定的学生列表
    getBindedChildren(obj) {
        var _this = this;
        var param = {
            "method": 'getBindedChildren',
            "parentId": obj.col_uid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' && result.success) {
                    _this.buildStuLists(result.response, obj)
                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }

    buildStuLists(res, obj) {
        var _this = this
        var arr = []
        if (!WebServiceUtil.isEmpty(res)) {
            res.forEach(function (v, i) {
                arr.push(<li className="StudentList">
                    {v.userName} <span
                    onClick={_this.weChatUnbindStduent.bind(this, v, obj)}>解绑</span>
                </li>)
            })
        }
        _this.setState({stuLis: arr, stuArr: res})
    }

    //家长解绑学生帐号
    weChatUnbindStduent = (stu, pat) => {
        var _this = this
        var param = {
            "method": 'weChatUnbindStduent',
            "pId": pat.col_uid,
            "studId": stu.colUid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' && result.success) {
                    Toast.success('解绑成功', 1)
                    var arr = _this.state.stuArr;
                    arr.forEach(function (v, i) {
                        if (v.colUid == stu.colUid) {
                            arr.splice(i, 1)
                        }
                    })
                    _this.buildStuLists(arr, _this.state.col_obj)
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
            value: value,
            tel: '',//清空手机号
            telSuccess: 'none',
            stuLis: [],
            stuArr: [],
        }, () => {
            this.getUserOpenIdInfoByOpenId();
        });
    };


    // 手机号码change事件
    inputOnChange = (value) => {
        this.setState({
            tel: value,
            sendButton: true,
            telSuccess: '',
        }, () => {
            if (value.length == 11) {
                this.setState({
                    pending: true,
                }, () => {
                    //验证手机号码
                    // this.validationTel();
                    this.setState({
                        telSuccess: 'success',
                        sendButton: false,
                        pending: false,
                    })
                })
            }
        });

    }

    // 验证码输入框change事件
    inputOnChangeForCode = (value) => {
        console.log(value);
        this.setState({
            code: value,
        });
    }

    validationTel() {
        var param = {
            "method": 'verifyUserPhoneNumber',
            "phoneNumber": this.state.tel,
            "type": this.state.value == 1 ? 'TEAC' : 'PAREN'
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, 'tel');
                if (result.success) {
                    this.setState({
                        telSuccess: 'success',
                        sendButton: false,
                        pending: false,
                    })
                } else {
                    this.setState({
                        telSuccess: 'error',
                        pending: false,
                    })
                }
            },
            onError: function (error) {
                Toast.info('验证手机号码请求失败');
            },
        });
    }

    // 发送
    getVerifyCodeForWeixinBinded = (code) => {
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
        var number = 60;
        timer = setInterval(function () {
            console.log(number);
            if (number < 0) {
                this.setState({
                    sendButton: false,
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
            sendButton: true,
        });
        //在此发送验证码
        this.getVerifyCodeForWeixinBinded();

    }

    bindUser = () => {
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
        var param = {
            "method": 'saveUserOpenId',
            "phoneNumber": this.state.tel,
            "openId": this.state.openid,
            "userType": this.state.value,
            "weiXinType": 1,
            "verifyMessage": this.state.code
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success) {
                    this.setState({
                        result: '绑定成功',
                        textFlag: false,
                    })
                } else {
                    Toast.info('' + result.msg);
                    this.setState({
                        result: '绑定失败:' + result.msg,
                    })
                }
            },
            onError: function (error) {
                Toast.info('请求失败');
                this.setState({
                    result: '请求失败',
                })
            }
        });
    }

    unBindAccount = () => {
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

    showBindModel = () => {
        $('.mask').show();
        $('.bindStu_modal').show();
        // var phoneType = navigator.userAgent;
        // var phone;
        // if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
        //     phone = 'ios'
        // } else {
        //     phone = 'android'
        // }
        // prompt('请输入学生ID', '', [
        //     {text: '取消'},
        //     {text: '确定', onPress: value => this.weChatParentBindStudent(value)},
        // ], 'default', '', [], phone)
        // if (phone == 'ios') {
        //     document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        // }
    }

    //家长绑定学生帐号
    weChatParentBindStudent(value,userName) {
        var _this = this;
        var param = {
            "method": 'weChatParentBindStudent',
            "pId": this.state.col_obj.col_uid,
            "studAccount": value,
            "userName":userName
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success && result.response) {
                    Toast.success('绑定成功');
                    $('.mask').hide();
                    $('.bindStu_modal').hide();
                    $('#childName').val('');
                    $('#childID').val('');
                    _this.getBindedChildren(this.state.col_obj)
                } else {
                    Toast.fail(result.msg);
                }
            },
            onError: function (error) {
                Toast.info('请求失败');
            }
        });
    }

    changeUserNick = (nickName)=>{
        this.setState({
            userName: nickName
        },()=>{
            var _this = this;
            var param = {
                "method": 'changeUserNick',
                "ident": this.state.col_obj.col_uid,
                "nick": nickName,
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: (result) => {
                    if (result.success && result.response) {

                    } else {
                        Toast.fail(result.msg);
                    }
                },
                onError: function (error) {
                    Toast.info('请求失败');
                }
            });
        })

    }

    toDetail(toThere,type){
        // console.log(toThere);
        // console.log(type);
        // if(type == 'PARENT'){
        //     var id = this.state.col_uid
        // }else if(type == 'TEAC'){
        //     var id = this.state.col_uid
        // }
        // console.log(this.state.col_uid);
        // return;
        var url = WebServiceUtil.mobileServiceURL+toThere+"?userId="+this.state.col_uid+"&type="+type;
        // console.log(url);
        window.location.href = url;
    }


    editorUserName = ()=>{
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios';
        } else {
            phone = 'android';
        }
        prompt('请修改用户姓名', '', [
            {text: '取消'},
            {text: '确定', onPress: value => this.changeUserNick(value)},
        ], 'default', this.state.userName, [], phone);
        if (phone == 'ios') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    childCancel = ()=>{
        console.log('取消');
        $('.mask').hide();
        $('.bindStu_modal').hide();
        $('#childName').val('');
        $('#childID').val('');
    }

    childBind = ()=>{
        // console.log('确定绑定');
        // console.log($('#childName').val(),'学生姓名');
        // console.log($('#childID').val(),'学生ID');
        if($('#childName').val() == '' || $('#childName').val() == ''){
            Toast.info('账号和姓名不能为空!');
        }else{
            this.weChatParentBindStudent($('#childID').val(),$('#childName').val());

        }
    }


    render() {
        const {value} = this.state;
        return (
            <div id="wxBindIndex">

                <div className="mask" style={{height:document.body.clientHeight,position: 'absolute',
                    top:0,
                    left:0,
                    width: '100%',
                    background: 'black',
                    opacity: 0.4,
                    display:'none',
                zIndex:14}}></div>
                <div className="bindStu_modal" style={{display:'none'}}>
                    <div className="textCont line_public">
                        <div className="nameTitle">添加绑定学生</div>
                        <div className="inputDiv"><input id="childName" type="text" placeholder="请输入学生姓名"/></div>
                        <div className="inputDiv"><input id="childID" type="text" placeholder="请输入学生账号"/></div>
                    </div>

                    <div className="bottom_btns">
                        <button className="childCancel" onClick={this.childCancel}>取消</button>
                        <button className="childBind" onClick={this.childBind}>确定</button>
                    </div>
                </div>


                <div style={{
                    display: this.state.textFlag ? 'block' : 'none'
                }} className="isDangerArea">
                    <List renderHeader={() => '选择角色'}>
                        {data.map(i => (
                            <RadioItem key={i.value} checked={value === i.value}
                                       onChange={() => this.onChange(i.value)}>
                                {i.label}
                            </RadioItem>
                        ))}
                    </List>
                    <div style={{
                        display: !this.state.openidFlag ? 'block' : 'none'
                    }}>
                        <div className="tel_element">
                            <InputItem
                                maxLength={11}
                                placeholder="请输入手机号码"
                                value={this.state.tel}
                                onChange={this.inputOnChange}
                            >手机号码
                            </InputItem>
                            <img style={{
                                display: (this.state.telSuccess == 'success' || this.state.telSuccess == 'error') && (!this.state.pending) ? 'block' : 'none'
                            }} id="telImg"
                                 src={this.state.telSuccess == 'success' ? require("./imgs/success1.png") : require('./imgs/error.png')}
                                 alt=""/>
                            <div style={{
                                display: (this.state.pending) ? 'block' : 'none'
                            }} className="telLoad">验证中...
                            </div>
                        </div>
                        <div className="Verification">
                            <InputItem
                                // className="add_element"
                                maxLength={100}
                                placeholder="请输入验证码"
                                value={this.state.code}
                                onChange={this.inputOnChangeForCode}
                            >验证码
                            </InputItem>
                            <Button type="primary" size="small" disabled={this.state.sendButton}
                                    onClick={this.sendCode}>{this.state.sendButtonText}</Button>
                        </div>
                        <div>{this.state.testText}</div>
                        <div className="submitBtn_green">
                            <Button type="primary" onClick={this.bindUser}>提交</Button>
                        </div>
                    </div>


                    {/*<div>测试保存接口返回:{this.state.result}</div>*/}
                    {/*<div>openId:{this.state.openid}</div>*/}
                </div>
                {/*解绑标签块*/}
                <WhiteSpace size="lg"/>
                <div className="bindingNumber" style={{
                    display: this.state.openidFlag ? 'block' : 'none'
                }}>
                    <div>
                        <div className="line_public number-title">您的微信已绑定以下账号</div>
                        <div className="mumber-cont" >
                                    <span className="left text_hidden parentAccount" style={
                                        this.state.value == 2?{display:'block'}:{display:'none'}
                                    }><i className="i-icon i-phone"></i>{this.state.userName} <Button onClick={this.editorUserName}>修改</Button> </span>
                            <span className="left text_hidden"><i className={this.state.value == 2? "i-icon i-tel" : "i-icon i-phone"}></i>{this.state.colAccount}</span>

                            <span className="right text_hidden" style={{display: this.state.value == 2 ? 'none' : 'inline-block'}}><i
                                className="i-icon i-tel"></i>{this.state.phoneNumber}</span>
                            <Button className={this.state.value == 2?'top54':"top15"} onClick={this.unBindAccount}>解绑</Button>
                        </div>
                    </div>
                </div>
                    <WhiteSpace size="lg"/>
                    <div className="bindingNumber" style={{display: !this.state.openidFlag ? 'none' : this.state.value == 2 ? 'none' : 'block'}}>
                        <div className="bindingNumberStudent">您绑定的班级学生信息</div>
                        <div className="Student-info">
                            {/*<div onClick={this.toDetail.bind(this,'stuList','TEAC')}>孩子列表</div>*/}
                            <div onClick={this.toDetail.bind(this,'stuAttendance','TEAC')}><i className="student-status"></i><span>学生考勤</span></div>
                            <div onClick={this.toDetail.bind(this,'stuState','TEAC')}><i className="Class-attendance"></i><span>学生状态</span></div>
                            <div onClick={this.toDetail.bind(this,'stuRanking','TEAC')}><i className="Sports-rankings"></i><span>运动排名</span></div>
                            <div onClick={this.toDetail.bind(this,'classRoomList','TEAC')}><i className="class-list"></i><span>班级列表</span></div>
                        </div>
                    </div>
                <div className="bindingNumber" style={{display: !this.state.openidFlag ? 'none' : this.state.value != 2 ? 'none' : 'block'}}>
                    <div className="bindingNumberStudent">学生校园个人信息</div>
                    <div className="Student-info">
                        <div onClick={this.toDetail.bind(this,'stuList','PARENT')}><i className="student-list"></i><span>孩子列表</span></div>
                        <div onClick={this.toDetail.bind(this,'stuAttendance','PARENT')}><i className="student-status"></i><span>孩子考勤</span></div>
                        <div onClick={this.toDetail.bind(this,'stuState','PARENT')}><i className="Class-attendance"></i><span>孩子状态</span></div>
                        <div onClick={this.toDetail.bind(this,'stuRanking','PARENT')}><i className="Sports-rankings"></i><span>运动排名</span></div>
                    </div>
                </div>
                <div className="Student-am-button" style={{display: !this.state.openidFlag ? 'none' : this.state.value != 2 ? 'none' : 'block'}}
                     onClick={this.showBindModel}>绑定学生
                </div>
                {/*解绑标签块 end*/}
                <div className="empty_center success3" style={{
                    display: this.state.textFlag ? 'none' : 'inline-block'
                }}><i></i>
                    <div>绑定成功</div>
                </div>
            </div>
        );
    }
}
