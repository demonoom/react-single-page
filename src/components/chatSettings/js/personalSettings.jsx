import React from 'react';
import '../css/personalSettings.less'
import {List, Switch, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';

export default class personalSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userImg: '',
            userName: "",
            initialValue: true,
            chatRecordData: []
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '个人设置';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var uid = searchArray[0].split('=')[1];
        var tid = searchArray[1].split('=')[1];
        var utype = searchArray[2].split('=')[1];
        this.setState({uid, tid, utype});
        this.getMessageSilenceStatus(uid, tid, utype);
        // this.getUserInfo(uid, false, utype);
    }

    /**
     * 获取聊天内容的数据
     * @param uid 搜索着的id
     * @param tid 群id或单聊中另一个人的id
     * @param type 1 = 单聊  4 = 群聊
     * @param pn  分页 -1 = 全部
     */

    searchChatRecords(uid, tid) {
        var _this = this;
        var param = {
            "method": "searchChatRecords",
            "uid": uid,
            "tid": tid,
            "type": "1",
            "keywork": "。",
            "pn": "-1"
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    _this.setState({chatRecordData: result.response});
                } else {
                    Toast.fail(result.msg, 1);
                }
            }
        })
    }

    /**
     * 获取消息免打扰的状态
     * @param uid
     * @param tid
     */
    getMessageSilenceStatus(uid, tid, utype) {
        var _this = this;
        var param = {
            "method": 'getMessageSilenceStatus',
            "uid": uid,
            "tid": tid,
            "type": '1',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    _this.setState({initialValue: result.response});
                    _this.getUserInfo(uid, false, utype);
                }
            }
        })
    }

    /**
     * 开启和关闭消息免打扰
     * @param uid 搜索着的id
     * @param tid 群id或单聊中另一个人的id
     */
    getChatMsg(checked) {
        var param = {
            "method": 'openMessageSilence',
            "uid": this.state.uid,
            "tid": this.state.tid,
            "type": '1',
            "status": checked ? '1' : '2'
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {

                } else {
                    Toast.fail(result.msg, 1);
                }
            }
        })
    }

    getUserInfo(uid, flag, utype) {
        var _this = this;
        var param = {
            "method": 'getUserByAccount',
            "account": utype + uid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    if (flag) {
                        _this.toGroupChatNew(result.response);
                    } else {
                        _this.buildUserInfo(result)
                    }
                }
            }
        })
    }

    buildUserInfo(result) {
        var displayAdd = this.state.utype == 'te' ? 'inline-blick' : 'none';
        let SwitchExample = (props) => {
            const {getFieldProps} = props.form;
            return (
                <List>
                    <List.Item
                        extra={<Switch
                            {...getFieldProps('Switch8', {
                                initialValue: this.state.initialValue,
                                valuePropName: 'checked',
                            })}
                            platform="ios"
                            color="#f55045"
                            onClick={(checked) => {
                                this.getChatMsg(checked)
                            }}
                        />}
                    >消息免打扰</List.Item>
                </List>
            );
        };
        SwitchExample = createForm()(SwitchExample);
        var userDiv = <div>
            <div className="logoImg">
                    <span className="imgInfo">
                        <div className="topImg">
                            <img src={result.response.avatar} alt=""/>
                        </div>
                        <span>{result.response.userName}</span>
                    </span>
                <img style={{display: displayAdd}} src={require("../img/addBtn.png")} className="rightBtn"
                     onClick={this.toGroupChat}/>
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
        this.setState({userDiv})
    }

    toGroupChatNew(obj) {
        var data = {
            "method": 'toGroupChat',
            "toUserObj": JSON.stringify(obj),
        };
        Bridge.callHandler(data, null, function (error) {
            Toast.fail(error, 2)
        });
    }

    // 顶部加号按钮
    toGroupChat = () => {
        this.getUserInfo(this.state.tid, true, this.state.utype);
    }

    // 查找聊天记录
    searchChatMsg = () => {
        var url = WebServiceUtil.mobileServiceURL + "chatMsg?uid=" + this.state.uid + '&tid=' + this.state.tid + '&uType=' + 1;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        return (
            <div id="personalSettings" style={{height: document.body.clientHeight}}>
                {this.state.userDiv}
            </div>
        );
    }
}
