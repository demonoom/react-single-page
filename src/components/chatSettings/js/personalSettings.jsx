import React from 'react';

import {Icon, Grid} from 'antd-mobile';
import '../css/personalSettings.less'


// 滑动开关

import {List, Switch} from 'antd-mobile';
import {createForm} from 'rc-form';

let SwitchExample = (props) => {
    const {getFieldProps} = props.form;
    return (
        <List>
            <List.Item
                extra={<Switch
                    {...getFieldProps('Switch8', {
                        initialValue: true,
                        valuePropName: 'checked',
                    })}
                    platform="ios"
                    color="skyblue"
                />}
            >消息免打扰</List.Item>
        </List>
    );
};

export default class personalSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userImg:'',
            userName:"",
            status:1,
            initialValue:true
        };
    }

    componentDidMount() {
        document.title = '个人设置';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var uid = searchArray[0].split('=')[1];
        var tid = searchArray[1].split('=')[1];
        this.getUserInfo(uid, tid);
        
    }

    /**
     * 获取登录人的信息
     * @param uid 搜索着的id
	 * @param tid 群id或单聊中另一个人的id
     */
    getChatMsg(type,status){
        if(type === 1){
            if(this.state.initialValue){
                this.setState({status:1});
            }else{
                this.setState({status:2});
            }
        }
        console.log(this.state.status);
        console.log(this.state.initialValue)
        
    }
    getUserInfo(uid,tid){
        var _this = this;
        var param = {
            "method": 'getUserByAccount',
            "account": 'te' + uid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param),{
            onResponse:function(result){
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(result.response)
                    // console.log(result.response.avatar);
                    var userImg = <img src={result.response.avatar} alt=""/>
                    var userName = result.response.userName;
                    _this.setState({userImg,userName})
                }
            }
        })
    }


    // 顶部加号按钮
    toGroupChat() {
        console.log("ok");
    }

    // 查找聊天记录
    searchChatMsg() {
        var url = WebServiceUtil.mobileServiceURL + "chatMsg";
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
     
    render() {
        SwitchExample = createForm()(SwitchExample);
        return (
            <div id="personalSettings" style={{height: document.body.clientHeight}}>
                <div className="logoImg">
                    <span className="imgInfo">
                        <div className="topImg">
                            {this.state.userImg}
                        </div>
                        <span>{this.state.userName}</span>
                    </span>
                    <img src={require("../img/addBtn.png")} className="rightBtn" onClick={this.toGroupChat}/>
                </div>
                <div className="searchChatMsg" onClick={this.searchChatMsg}>
                    <span className="leftText">查找聊天内容</span>
                    <span className="rightArrow">
                        <Icon type="right"/>
                    </span>
                </div>
                <div className="ingoreMsg">
                    {/* 滑动开关 */}
                    <SwitchExample onClick={this.getChatMsg}/>
                </div>
            </div>
        );
    }
}
