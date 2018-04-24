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
        this.state = {};
    }

    componentDidMount() {

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
                        <div className="topImg"></div>
                        <span>hahaha</span>
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
                    <SwitchExample/>
                </div>
            </div>
        );
    }
}
