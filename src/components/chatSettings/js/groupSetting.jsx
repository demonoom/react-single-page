import React from 'react';
import {Toast} from 'antd-mobile';
import '../css/groupSetting.less'

export default class groupSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.title = '群设置';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var chatGroupId = searchArray[0].split('=')[1];
        var ident = searchArray[1].split('=')[1];
        this.getUserByAccount(ident, chatGroupId);
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
        this.state.dissolutionChatGroupButton = '';
        this.setState({currentGroupObj});
        var _this = this;
        var groupMemebersPhoto = []

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

        var settingPage = <div>
            {imgTag}
            <div>
                群聊成员
            </div>
            <div>
                群聊名称
            </div>
            <div>
                群主转移
            </div>
            <div>
                解散该群
            </div>
        </div>

        this.setState({settingPage});
    }

    render() {

        return (
            <div id="groupSetting" style={{height: document.body.clientHeight}}>
                {this.state.settingPage}
            </div>
        );
    }
}
