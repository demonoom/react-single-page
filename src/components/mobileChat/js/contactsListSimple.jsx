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
            dataSource: dataSource.cloneWithRows(this.initData),
            userId: '',
            unionid: '',        //微信登录的unionid
            userData: [],   //unionid绑定的用户身份数组
            choosePos: '',   //控制选择的是左还是右
            headItem: [<Item onClick={this.turnToGroup}>我的群组</Item>,
                <Item onClick={this.turnToOrgrination}>组织架构</Item>,
                <Item onClick={this.turnToClass}>我的班级</Item>,
                <Item onClick={this.turnToFriend}>我的好友</Item>]
        };
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天";   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var unionid = searchArray[0].split('=')[1];
        // this.setState({unionid});
        this.setState({unionid: 'o-w611FMw4s8WtiCwNqD1Ltr9w2w'});
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
                        // butFoot控制下面的老师,家长的显示隐藏
                        _this.setState({butFoot: false})
                        _this.getRecentShareUsers(result.response[0].colUid)
                    } else if (result.response.length == 0) {
                        Toast.fail('未找到用户', 2)
                    } else {
                        _this.setState({butFoot: true})
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
                            return (item.user.colUtype != 'CHAT_GROUP_INFORMER' );
                        } else {
                            return item
                        }
                    })

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
        console.log('turnToGroup');
    }

    /**
     * 去组织架构
     */
    turnToOrgrination() {
        console.log('turnToOrgrination');
    }

    /**
     * 去我的班级
     */
    turnToClass() {
        console.log('turnToClass');
    }

    /**
     * 去我的好友
     */
    turnToFriend() {
        console.log('turnToFriend');
    }

    /**
     * 去学生班级
     */
    turnToStuClass() {
        console.log('turnToStuClass');
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
    turnToTercher() {

        document.getElementById('selectR').className = ''
        document.getElementById('selectL').className = 'select'
        contactsList.initData.splice(0);
        contactsList.state.dataSource = [];
        contactsList.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        contactsList.setState({
            choosePos: 'te', headItem: [<Item onClick={contactsList.turnToGroup}>我的群组</Item>,
                <Item onClick={contactsList.turnToOrgrination}>组织架构</Item>,
                <Item onClick={contactsList.turnToClass}>我的班级</Item>,
                <Item onClick={contactsList.turnToFriend}>我的好友</Item>]
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
    turnTojiaZhang() {

        document.getElementById('selectR').className = 'select'
        document.getElementById('selectL').className = ''
        contactsList.initData.splice(0);
        contactsList.state.dataSource = [];
        contactsList.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        contactsList.setState({choosePos: 'pe', headItem: [<Item onClick={contactsList.turnToStuClass}>学生班级</Item>]})
        contactsList.state.userData.forEach(function (v, i) {
            if (v.colUtype == 'PAREN') {
                contactsList.getRecentShareUsers(v.colUid)
            }
        })

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
                    <span id='selectL' className="select" onClick={this.turnToTercher}>老师</span>
                    <span id='selectR' onClick={this.turnTojiaZhang}>家长</span>
                </div>

                <div>
                    {this.state.headItem}
                </div>

                <ListView
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
                    style={{
                        height: document.body.clientHeight - 176,
                    }}
                />

            </div>
        );
    }
}
