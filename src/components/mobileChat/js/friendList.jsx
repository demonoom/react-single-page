import React from 'react';
import {ListView, Toast, List} from 'antd-mobile';
import '../css/friendList.less'

var friend_List;
const {Item} = List;

export default class friendList extends React.Component {

    constructor(props) {
        super(props);
        friend_List = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];

        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            userId: '',
            unionid: '',        //微信登录的unionid
        };
    }

    componentWillMount() {

        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var colPasswd = searchArray[1].split('=')[1];
        var unionid = searchArray[2].split('=')[1];
        var userType = searchArray[5].split('=')[1];
        if (WebServiceUtil.isEmpty(searchArray[3]) == false) {
            var clazzId = searchArray[3].split('=')[1];
            var clazzName = searchArray[4].split('=')[1];
            document.title = clazzName;   //设置title
            this.setState({clazzId})
        } else {
            document.title = "我的好友";   //设置title
        }

        this.setState({userId, colPasswd, unionid, userType});
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
    }

    componentDidMount() {
        if (WebServiceUtil.isEmpty(this.state.clazzId)) {
            this.getFrendShipByUserId()
        } else {
            this.getClazzMemberByClazzId()
        }
    }

    getClazzMemberByClazzId() {
        var _this = this;
        const dataBlob = {};

        var param = {
            "method": 'getClazzMemberByClazzId',
            "clazzId": this.state.clazzId,
        };

        var headerObj = {
            "accessUser": this.state.userId,
            "machine": WebServiceUtil.createUUID(),
            "machineType": "mobile-web",
            "version": "1.01"
        };

        WebServiceUtil.requestLittleAntApiWithHead(JSON.stringify(param), JSON.stringify(headerObj), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {

                    let response = result.response.filter(function (item) {
                        if (item.type == 0) {
                            return (item.user.colUtype != 'CHAT_GROUP_INFORMER' );
                        } else {
                            return (item.colUid != friend_List.state.userId)
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

    getFrendShipByUserId() {

        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getFrendShipByUserId',
            "colUid": this.state.userId,
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

    itemOnClick(rowData) {
        return () => {
            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil?fromId=' + this.state.userId + '&toId=' + rowData.colUid + '&choosePos=' + this.state.userType + '&unionid=' + this.state.unionid + '&colPasswd=' + this.state.colPasswd + '&toName=' + rowData.userName + '&mesType=0')
        }
    }

    render() {

        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            return (
                <Item onClick={this.itemOnClick(rowData)}>
                    <img className='userImg' src={rowData.avatar}/>
                    <span className="text_hidden">{rowData.userName}</span>
                </Item>
            )
        }

        return (
            <div id="friendList">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: this.state.phone === 'ios' ? document.body.clientHeight : document.body.clientHeight - 49
                    }}
                />
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
        );
    }
}
