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
        var topButton,
            dissolutionChatGroupButton;
        var divBlock = 'none';
        if (currentGroupObj.owner.colUid == JSON.parse(localStorage.getItem("loginUserGroupSetting")).colUid) {
            //我是群主
            // divBlock = 'inline-block';
            // topButton = <span>
            //     <span type="primary" className="noom_cursor set_in_btn_font"
            //           onClick={this.showAddMembersModal.bind(this, groupType)}><Icon
            //         className="i_antdesign" type="plus"/>添加群成员</span></span>
            // dissolutionChatGroupButton =
            //     <Button onClick={this.showDissolutionChatGroupConfirmModal} className="group_red_font"><i
            //         className="iconfont">&#xe616;</i>解散该群</Button>;
            // _this.setState({dissolutionChatGroupButton})
            //
            // var memberLiTag = [];
            // currentMemberArray.forEach(function (e) {
            //     var memberId = e.key;
            //     var groupUser = e.groupUser;
            //     var userInfo = e.userInfo;
            //     var userHeaderIcon;
            //     if (isEmpty(userInfo) == false) {
            //         userHeaderIcon = <img src={userInfo.avatar}></img>;
            //     } else {
            //         userHeaderIcon =
            //             <span className="attention_img"><img
            //                 src={require('../components/images/maaee_face.png')}></img></span>;
            //     }
            //     var liTag = currentGroupObj.ownerId == e.key ? <div className="group_fr">
            //         <span className="attention_img">{userHeaderIcon}</span><span>{groupUser}</span>
            //     </div> : <div className="group_fr">
            //         <span className="attention_img">{userHeaderIcon}</span><span>{groupUser}</span>
            //         <Button value={memberId} onClick={_this.showConfirmModal} className="group_del"><Icon
            //             type="close-circle-o"/></Button>
            //     </div>;
            //     memberLiTag.push(liTag);
            // });
        } else {
            //我不是群主
            if (currentGroupObj.type == 1) {
                //部门群
                console.log('部门群');
                // topButton = <span className="right_ri"></span>;
            } else {
                //普通群
                if (JSON.parse(localStorage.getItem("loginUserGroupSetting")).colUtype == 'STUD') {
                    //学生
                    // topButton = <span className="right_ri"></span>;
                } else {
                    //老师
                    // topButton = <span>
                    //     <span type="primary" className="noom_cursor set_in_btn_font"
                    //           onClick={this.showAddMembersModal.bind(this, groupType)}>
                    //     <Icon className="i_antdesign" type="plus"/>添加群成员</span></span>
                }
            }

            // var memberLiTag = [];
            // currentMemberArray.forEach(function (e) {
            //     var groupUser = e.groupUser;
            //     var userInfo = e.userInfo;
            //     var userHeaderIcon;
            //     if (isEmpty(userInfo) == false) {
            //         userHeaderIcon = <img src={userInfo.avatar}></img>;
            //     } else {
            //         userHeaderIcon =
            //             <span className="attention_img"><img
            //                 src={require('../components/images/maaee_face.png')}></img></span>;
            //     }
            //     var liTag = <div className="group_fr">
            //         <span className="attention_img">{userHeaderIcon}</span><span>{groupUser}</span>
            //     </div>;
            //     memberLiTag.push(liTag);
            // });
        }

        // var personDate = <div className="group_cont">
        //     <div className="myfollow_zb del_out">
        //         <ul className="group_fr_ul">
        //             <li className="color_gary_f">群聊名称：{currentGroupObj.name}
        //                 <span style={{display: divBlock}} className="noom_cursor set_in_btn_font"
        //                       onClick={this.showUpdateChatGroupNameModal}><Icon type="edit" className="i_antdesign"/>编辑</span>
        //             </li>
        //             <li className="color_gary_f">群主：{currentGroupObj.owner.userName}
        //                 <span style={{display: divBlock}} className="noom_cursor set_in_btn_font"
        //                       onClick={this.mainTransfer.bind(this, currentMemberArray)}><Icon type="swap"
        //                                                                                        className="i_antdesign"/>转让群主</span>
        //             </li>
        //             <li className="color_gary_f">
        //                 <span>群聊成员：{currentMemberArray.length}人</span>{topButton}</li>
        //             <li className="user_hei flow_x">
        //                 {memberLiTag}
        //             </li>
        //         </ul>
        //     </div>
        // </div>;
        //
        // this.setState({personDate});
    }

    render() {

        return (
            <div id="groupSetting" style={{height: document.body.clientHeight}}>
                groupSetting
            </div>
        );
    }
}
