import React from 'react';
import {ListView, Toast, List} from 'antd-mobile'
import '../css/contactsListSimple.less'

var contactsList;
const {Item} = List;

export default class contacts_ListS extends React.Component {

    constructor(props) {
        super(props);
        contactsList = this;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];

        this.state = {
            topDis: true,
            dataSource: dataSource.cloneWithRows(this.initData),
            userId: '',
            unionid: '',        //微信登录的unionid
            userData: [],   //unionid绑定的用户身份数组
            choosePos: '',   //控制选择的是左还是右
            indexType: 'teacher',
            newContactLists: [],
            headItem: [<Item onClick={this.turnToGroup}>
                <i className='userImg message_group'></i>
                <span>我的群组</span>
            </Item>,
                <Item onClick={this.turnToOrgrination}>
                    <i className='userImg message_tissue'></i>
                    <span>组织架构</span>
                </Item>,
                <Item onClick={this.turnToClass}>
                    <i className='userImg message_class'></i>
                    <span>我的班级</span>
                </Item>,
                <Item onClick={this.turnToFriend}>
                    <i className='userImg message_friend'></i>
                    <span>我的好友</span>
                </Item>]
        };
    }

    componentWillMount() {
        // history.back(-1);
        document.title = "小蚂蚁聊天";   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var unionid = searchArray[0].split('=')[1];
        this.setState({unionid});
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        this.setState({
            phone: phone
        })
        // this.setState({unionid: 'o-w611FMw4s8WtiCwNqD1Ltr9w2w'});
    }

    componentDidMount() {

        var _this = this;

        /**
         * 根据unionid获取绑定的小蚂蚁用户信息
         * @type {{method: string, openId: (string|string)}}
         */
        var param = {
            "method": 'getUsersByOpenId',
            "openId": contactsList.state.unionid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    if (result.response.length == 1) {
                        if (result.response[0].colUtype == 'PAREN') {
                            _this.setState({
                                headItem: [
                                    <Item onClick={contactsList.turnToGroup}>
                                        <i className='userImg message_group'></i>
                                        <span>我的群组</span>
                                    </Item>,
                                    <Item onClick={contactsList.turnToFriend}>
                                        <i className='userImg message_friend'></i>
                                        <span>我的好友</span>
                                    </Item>,
                                    <Item onClick={contactsList.turnToStuClass}>
                                        <i className='userImg stu_class'></i>
                                        <span>学生班级</span>
                                    </Item>],
                                indexType: 'parent'
                            })
                        }
                        // butFoot控制下面的老师,家长的显示隐藏
                        _this.setState({butFoot: false, schoolId: result.response[0].schoolId, missDistance: 240})
                        _this.getRecentShareUsers(result.response[0].colUid)
                    } else if (result.response.length == 0) {
                        //跳转至登录页面
                        _this.setState({topDis: false})
                        location.replace(encodeURI(WebServiceUtil.mobileServiceURL + 'chatLogin?unionid=' + _this.state.unionid))
                    } else {
                        _this.setState({butFoot: true, missDistance: 284})
                        result.response.forEach(function (v, i) {
                            if (v.colUtype == "TEAC") {
                                _this.getRecentShareUsers(v.colUid)
                            }
                        })
                    }
                    _this.setState({userData: result.response, choosePos: 'te'})  //userData绑定用户数组,一个或两个
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 获取用户联系人
     * 切换身份之后再调一下
     * params:{"method":"getRecentShareUsers","userId":"6075"}
     * @param data
     */
    getRecentShareUsers(id) {

        this.setState({userId: id})

        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getRecentShareUsers',
            "userId": id,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {

                    let response = result.response.filter(function (item) {
                        if (item.type == 0) {
                            return (item.user.colUtype != 'CHAT_GROUP_INFORMER');
                        } else {
                            return item
                        }
                    })

                    console.log(response, 'response');

                    _this.setState({newContactLists: response});

                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    _this.initData = _this.initData.concat(response);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                    })

                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 去我的群组
     */
    turnToGroup() {
        var colPasswd = contactsList.state.userData[0].colPasswd
        var unionid = contactsList.state.unionid

        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'groupChatList?fromId=' + contactsList.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid)
    }

    /**
     * 去组织架构
     */
    turnToOrgrination() {

        var colPasswd = contactsList.state.userData[0].colPasswd;
        var unionid = contactsList.state.unionid;

        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'originationList?fromId=' + contactsList.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&structureId=-1' + '&schoolId=' + contactsList.state.schoolId)
    }

    /**
     * 去我的班级
     */
    turnToClass() {
        var colPasswd = contactsList.state.userData[0].colPasswd
        var unionid = contactsList.state.unionid
        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'classList?fromId=' + contactsList.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&type=te')
    }

    /**
     * 去我的好友
     */
    turnToFriend() {
        var colPasswd = contactsList.state.userData[0].colPasswd
        var unionid = contactsList.state.unionid
        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'friendList?fromId=' + contactsList.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid)
    }

    /**
     * 去学生班级
     */
    turnToStuClass() {
        var colPasswd = contactsList.state.userData[0].colPasswd
        var unionid = contactsList.state.unionid
        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'classList?fromId=' + contactsList.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&type=pe')
    }

    /**
     * 联系人被点击
     * 跳转至聊天详情界面
     * @param rowData
     * @returns {function()}
     */
    itemOnClick(rowData) {
        return () => {
            if (this.state.choosePos == 'te') {
                var colPasswd = this.state.userData[0].colPasswd
            } else {
                var colPasswd = this.state.userData[1].colPasswd
            }

            if (rowData.type == 0) {
                //个人
                window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil?fromId=' + this.state.userId + '&toId=' + rowData.user.colUid + '&choosePos=' + this.state.choosePos + '&unionid=' + this.state.unionid + '&colPasswd=' + colPasswd + '&toName=' + rowData.user.userName + '&mesType=0')
            } else {
                //群
                window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil?fromId=' + this.state.userId + '&toId=' + rowData.chatGroup.chatGroupId + '&choosePos=' + this.state.choosePos + '&unionid=' + this.state.unionid + '&colPasswd=' + colPasswd + '&toName=' + rowData.chatGroup.name + '&mesType=1')
            }
        }
    }

    /**
     * 调用getUserContacts切换联系人
     * 更换choosePos,向下一页传递属于他的用户信息
     */
    turnToTercher(type) {
        this.setState({
            indexType: type
        })
        document.getElementById('selectR').className = ''
        document.getElementById('selectL').className = 'select'
        contactsList.initData.splice(0);
        contactsList.state.dataSource = [];
        contactsList.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        contactsList.setState({
            choosePos: 'te',
            headItem: [<Item onClick={contactsList.turnToGroup}><i className='userImg message_group'></i>
                <span>我的群组</span></Item>,
                <Item onClick={contactsList.turnToOrgrination}><i className='userImg message_tissue'></i>
                    <span>组织架构</span></Item>,
                <Item onClick={contactsList.turnToClass}><i className='userImg message_class'></i>
                    <span>我的班级</span></Item>,
                <Item onClick={contactsList.turnToFriend}><i className='userImg message_friend'></i>
                    <span>我的好友</span></Item>]
        })
        contactsList.state.userData.forEach(function (v, i) {
            if (v.colUtype == "TEAC") {
                contactsList.getRecentShareUsers(v.colUid)
            }
        })
    }

    /**
     * 调用getUserContacts切换联系人
     * 更换choosePos,向下一页传递属于他的用户信息
     */
    turnTojiaZhang(type) {
        this.setState({
            indexType: type
        })
        document.getElementById('selectR').className = 'select'
        document.getElementById('selectL').className = ''
        contactsList.initData.splice(0);
        contactsList.state.dataSource = [];
        contactsList.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        contactsList.setState({
            choosePos: 'pe',
            headItem: [
                <Item onClick={contactsList.turnToGroup}>
                    <i className='userImg message_group'></i>
                    <span>我的群组</span>
                </Item>,
                <Item onClick={contactsList.turnToFriend}>
                    <i className='userImg message_friend'></i>
                    <span>我的好友</span>
                </Item>,
                <Item onClick={contactsList.turnToStuClass}>
                    <i className='userImg stu_class'></i>
                    <span>学生班级</span>
                </Item>]
        })
        contactsList.state.userData.forEach(function (v, i) {
            if (v.colUtype == 'PAREN') {
                contactsList.getRecentShareUsers(v.colUid)
            }
        })

    }

    historyBack() {
        window.history.back();
    }

    historyGo() {
        window.history.go(1);
    }

    unBindAccount = (id) => {
        console.log(id);

        var param = {
            "method": 'unbindUserOpenId',
            "id": id,
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

    getUserOpenIdInfoByOpenId = () => {
        var _this = this;
        var param = {
            "method": 'getUserOpenIdInfoByOpenId',
            "openId": this.state.unionid,
            "userType": this.state.indexType == 'teacher' ? 'TEAC' : 'PAREN',
            "weixinType": '1',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.success) {
                    if (result.response) {
                        _this.unBindAccount(result.response.col_id)
                    } else {   //openid 未绑定

                    }
                } else {

                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }

    render() {

        const row = (rowData, sectionID, rowID) => {

            if (rowData.type == 1) {
                //群

                var groupMemebersPhoto = [];
                var currentMemberArray = rowData.chatGroup.avatar.split('#');
                for (var i = 0; i < currentMemberArray.length; i++) {
                    var member = currentMemberArray[i];
                    var memberAvatarTag = <img src={member}></img>;
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

                return (
                    <Item onClick={this.itemOnClick(rowData)}>
                        {imgTag}
                        <span className="text_hidden">{rowData.chatGroup.name}</span>
                    </Item>
                )
            } else if (rowData.type == 0) {
                //个人
                return (
                    <Item onClick={this.itemOnClick(rowData)}>
                        <img className='userImg' src={rowData.user.avatar}/>
                        <span className="text_hidden">{rowData.user.userName}</span>
                    </Item>
                )
            }
        }

        return (
            <div id='contactsListSimple'>
                <div className="address_header" style={{display: this.state.butFoot ? 'block' : 'none'}}>
                    <span id='selectL' className="select" onClick={this.turnToTercher.bind(this, 'teacher')}>老师</span>
                    <span id='selectR' onClick={this.turnTojiaZhang.bind(this, 'parent')}>家长</span>
                </div>
                <div className='inner'
                     style={{height: this.state.phone === 'ios' ? this.state.butFoot ? 'calc(100% - 45px)' : '100%' : this.state.butFoot ? 'calc(100% - 94px)' : 'calc(100% - 49px)'}}>
                    <div className='myAccount' style={{display: this.state.topDis ? '' : 'none'}}>
                        <div className="inner line_public">
                            <img src={
                                !this.state.userData.length ? '' : !this.state.butFoot ? this.state.userData[0].avatar : this.state.indexType === 'teacher' ? this.state.userData[0].avatar : this.state.userData[1].avatar
                            } alt=""/>
                            <span className='userName text_hidden'>
                        {
                            this.state.userData.length ? !this.state.butFoot ? this.state.userData[0].userName :
                                this.state.indexType === 'teacher' ? this.state.userData[0].userName : this.state.userData[1].userName : ''
                        }
                    </span>
                            <span className='cancelBindBtn' onClick={this.getUserOpenIdInfoByOpenId}>解绑账号</span>
                        </div>
                    </div>

                    <div style={{display: this.state.topDis ? '' : 'none'}}>
                        {this.state.headItem}
                    </div>

                    <div style={{display: this.state.topDis ? '' : 'none'}} className='personTitle'>常用联系人</div>

                    <div>
                        {
                            this.state.newContactLists.map((rowData) => {
                                if (rowData.type == 1) {
                                    //群

                                    var groupMemebersPhoto = [];
                                    var currentMemberArray = rowData.chatGroup.avatar.split('#');
                                    for (var i = 0; i < currentMemberArray.length; i++) {
                                        var member = currentMemberArray[i];
                                        var memberAvatarTag = <img src={member}></img>;
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

                                    return (
                                        <Item onClick={this.itemOnClick(rowData)}>
                                            {imgTag}
                                            <span className="text_hidden">{rowData.chatGroup.name}</span>
                                        </Item>
                                    )
                                } else if (rowData.type == 0) {
                                    //个人
                                    return (
                                        <Item onClick={this.itemOnClick(rowData)}>
                                            <img className='userImg' src={rowData.user.avatar}/>
                                            <span className="text_hidden">{rowData.user.userName}</span>
                                        </Item>
                                    )
                                }
                            })
                        }
                    </div>

                    {/*<ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderHeader={() => (
                        <div style={{paddingTop: 0, paddingBottom: 0, textAlign: 'left'}}>
                            常用联系人
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    // height: document.body.clientHeight - this.state.missDistance,
                    style={
                        this.state.indexType == 'teacher' ? {
                            height: this.state.phone === 'ios' ? document.body.clientHeight - this.state.missDistance - 45 : document.body.clientHeight - this.state.missDistance - 49 - 45
                        } : {height: this.state.phone === 'ios' ? document.body.clientHeight - 112 - 45 : this.state.butFoot ? document.body.clientHeight - 210 - 45 : document.body.clientHeight - 161 - 45}
                    }
                />*/}

                    <div style={
                        this.state.phone == 'ios' ? {display: 'none'} : {display: 'block'}
                    } className="contactsListNav">
                        <div className="line_public"></div>
                        <div className="nav-left" onClick={() => {
                            window.history.back()
                        }}></div>
                        <div className="nav-right" onClick={() => {
                            window.history.go(1)
                        }}></div>
                    </div>
                </div>
            </div>
        );
    }
}
