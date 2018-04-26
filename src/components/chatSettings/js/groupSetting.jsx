import React from 'react';
import {Toast, Icon, List, Switch, Button, WingBlank, Modal} from 'antd-mobile';
import '../css/groupSetting.less'
import {createForm} from 'rc-form';

const prompt = Modal.prompt;
const alert = Modal.alert;

var gSetting;

export default class groupSetting extends React.Component {

    //加人,减人,转移,免打扰初始状态,搜索消息内容,不同情况的显示隐藏

    constructor(props) {
        super(props);
        gSetting = this;
        this.state = {};
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '群设置';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var chatGroupId = searchArray[0].split('=')[1];
        var ident = searchArray[1].split('=')[1];
        this.getUserByAccount(ident, chatGroupId);
        this.setState({ident, chatGroupId});
    }

    /**
     * 获取登录人的信息
     * @param ident
     * @param chatGroupId
     */
    getUserByAccount(ident, chatGroupId) {
        var _this = this;
        var param = {
            "method": 'getUserByAccount',
            "account": 'te' + ident,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var loginUserGroupSetting = result.response;
                    localStorage.setItem("loginUserGroupSetting", JSON.stringify(loginUserGroupSetting)); //将分享人的相关信息存储在每一页中进行渲染
                    _this.getChatGroupById(chatGroupId);
                } else {
                    Toast.error(result.msg);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 获取群信息
     * @param chatGroupId
     */
    getChatGroupById(chatGroupId) {
        var _this = this;
        var param = {
            "method": 'getChatGroupById',
            "chatGroupId": chatGroupId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var data = result.response;
                    var members = data.members;
                    var membersArray = [];
                    members.forEach(function (e) {
                        var memberId = e.colUid;
                        var memberName = e.userName;
                        var userJson = {key: memberId, groupUser: memberName, userInfo: e};
                        membersArray.push(userJson);
                    });
                    _this.setState({membersArray, groupData: data});
                    _this.buildGroupSet(membersArray, data);
                } else {
                    Toast.error(result.msg);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 构建群设置页面
     */
    buildGroupSet(currentMemberArray, currentGroupObj) {
        console.log('1', currentMemberArray);
        console.log('2', currentGroupObj);

        var groupType = currentGroupObj.type;

        var _this = this;
        var groupMemebersPhoto = [];

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

        for (var i = 0; i < currentMemberArray.length; i++) {
            var member = currentMemberArray[i];
            var memberAvatarTag = <img src={member.userInfo.avatar}></img>;
            groupMemebersPhoto.push(memberAvatarTag);
            if (i >= 3) {
                break;
            }
        }

        var imgTag = <div className="maaee_group_face">{groupMemebersPhoto}</div>;
        switch (groupMemebersPhoto.length) {
            case 1:
                imgTag = <div className="maaee_group_face1">{groupMemebersPhoto}</div>;
                break;
            case 2:
                imgTag = <div className="maaee_group_face2">{groupMemebersPhoto}</div>;
                break;
            case 3:
                imgTag = <div className="maaee_group_face3">{groupMemebersPhoto}</div>;
                break;
            case 4:
                imgTag = <div className="maaee_group_face">{groupMemebersPhoto}</div>;
                break;
        }

        if (currentGroupObj.owner.colUid == JSON.parse(localStorage.getItem("loginUserGroupSetting")).colUid) {
            //我是群主
            console.log('我是群主');

        } else {
            //我不是群主
            if (currentGroupObj.type == 1) {
                //部门群
                console.log('部门群');
            } else {
                //普通群
                if (JSON.parse(localStorage.getItem("loginUserGroupSetting")).colUtype == 'STUD') {
                    //学生
                } else {
                    //老师

                }
            }

        }

        var imgL = <div className='noomImgL'>{groupMemebersPhoto}<img onClick={this.addPer}
                                                                      src={require('../img/addBtn.png')} alt=""/>
            <img onClick={this.delPer} src={require('../img/lALPBbCc1aeG-P5ISA_72_72.png')} alt=""/></div>;

        var settingPage = <div>
            {imgTag}
            <div className="calmGroupMember">
                <div className="allMembers" onClick={this.intoGroup(currentGroupObj)}>
                    <span>群聊成员</span>
                    <div className="groupMemeberRight">
                        <span className="countMembers">{currentMemberArray.length}人</span>
                        <Icon className="iconRight" type="right"/>
                    </div>
                </div>
                <div>
                    {imgL}
                </div>
            </div>
            <div className="searchChatMsg" onClick={this.updateChatGroupName}>
                <span>群聊名称</span><span className="rightArrow">
                        <Icon type="right"/>
                    </span><span className='rightArrow'>{currentGroupObj.name}</span>
            </div>
            <div className="searchChatMsg" onClick={this.searchChatMsg}>
                <span className="leftText">查找聊天内容</span>
                <span className="rightArrow">
                        <Icon type="right"/>
                    </span>
            </div>
            <div className="ingoreMsg">
                <SwitchExample/>
            </div>
            <div className="searchChatMsg" onClick={this.changeChatGroup}>
                群主转移
            </div>
            <div className="searchChatMsg" onClick={this.deleteChatGroupMember.bind(this, currentGroupObj)}>
                解散该群
            </div>
            <WingBlank>
                <Button type="warning" onClick={this.exitChatGroup.bind(this, currentGroupObj)}>删除并退出</Button>
            </WingBlank>
        </div>;
        this.setState({settingPage});
    }

    /**
     * 查看群信息
     */
    intoGroup(obj) {
        return () => {
            obj.members.forEach(function (v, i) {
                if (v.colUid == obj.owner.colUid) {
                    obj.members.splice(i, 1);
                }
            });
            // 向客户端发送查看群信息
            var data = {
                method: 'viewGroupInformation',
                owner: JSON.stringify(obj.owner),
                members: JSON.stringify(obj.members),
            };
            Bridge.callHandler(data, null, function (error) {
                Toast.fail(error, 2);
            });
        }
    }

    /**
     * 加人
     */
    addPer(event) {
        event.stopPropagation();
        console.log('addPer');
    }

    /**
     * 减人
     */
    delPer(event) {
        event.stopPropagation();
        console.log('delPer');
    }

    /**
     * 转移群主
     */
    changeChatGroup() {
        console.log('changeChatGroupOwner');
    }

    /**
     * 群组解散
     */
    deleteChatGroupMember = (obj) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        var _this = this;
        const alertInstance = alert('确定解散该群聊?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delChatGroupMember(obj)},
        ], phone);
    };

    /**
     * 群组解散2
     */
    delChatGroupMember(obj) {
        var str = '';
        obj.members.forEach(function (v, i) {
            str += v.colUid + ',';
        });
        var param = {
            "method": 'deleteChatGroupMember',
            "chatGroupId": obj.chatGroupId,
            "memberIds": str.substr(0, str.length - 1)
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    //向客户端发送解散群组成功的消息
                } else {
                    Toast.fail('解散群组失败', 2);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 修改群名称
     */
    updateChatGroupName() {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        prompt('请输入群名称', '', [
            {text: '取消'},
            {text: '确定', onPress: value => gSetting.changeChatGroupName(value)},
        ], 'default', '', [], phone)
        if (phone == 'ios') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    /**
     * 修改群名称2
     * @param value
     */
    changeChatGroupName(value) {
        var _this = this;
        if (value.trim().length == 0) {
            Toast.fail('群组名称不能为空', 1);
            return
        }
        var param = {
            "method": 'updateChatGroupName',
            "chatGroupId": this.state.chatGroupId,
            "name": value,
            "userId": this.state.ident,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.state.groupData.name = value;
                    _this.buildGroupSet(_this.state.membersArray, _this.state.groupData);
                } else {
                    Toast.fail('修改失败', 2);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 删除并退出群组
     */
    exitChatGroup = (obj) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        var _this = this;
        const alertInstance = alert('确定退出该群聊?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.exitChatGroupF(obj)},
        ], phone);
    }

    /**
     * 删除并退出群组2
     * @param obj
     */
    exitChatGroupF(obj) {
        var param = {
            "method": 'deleteChatGroupMember',
            "chatGroupId": obj.chatGroupId,
            "memberIds": this.state.ident
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    //向客户端发送解散群组成功的消息
                } else {
                    Toast.fail('退出群聊失败', 1);
                }
            }
        })
    }

    /**
     * 查找聊天记录
     */
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

    /**
     * 开启和关闭消息免打扰
     * @param checked
     */
    getChatMsg(checked) {
        var param = {
            "method": 'openMessageSilence',
            "uid": this.state.ident,
            "tid": this.state.chatGroupId,
            "type": '4',
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

    render() {
        return (
            <div id="groupSetting" style={{height: document.body.clientHeight}}>
                {this.state.settingPage}
            </div>
        );
    }
}
