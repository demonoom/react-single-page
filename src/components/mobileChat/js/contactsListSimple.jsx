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
            footStr: '',
            userId: '',
            unionid: '',        //微信登录的unionid
            userData: [],   //unionid绑定的用户身份数组
            choosePos: '',   //控制选择的是左还是右
        };
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天";   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var unionid = searchArray[0].split('=')[1];
        this.setState({unionid});
        // this.setState({unionid: 'o-w611I9nKqTHcT3P34srzwIrf6U'});
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
                    console.log(result.response);
                    if (result.response.length == 1) {
                        // butFoot控制下面的老师,家长的显示隐藏
                        _this.setState({butFoot: false})
                        _this.getUserContacts(result.response[0].colUid)
                    } else if (result.response.length == 0) {
                        Toast.fail('未找到用户', 2)
                    } else {
                        _this.setState({butFoot: true})
                        result.response.forEach(function (v, i) {
                            if (v.colUtype == "TEAC") {
                                _this.getUserContacts(v.colUid)
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
     * @param data
     */
    getUserContacts(id) {

        this.setState({userId: id})

        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getUserContacts',
            "ident": id,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {

                    let response = result.response.filter(function (item) {
                        return (item.colUtype != 'SGZH' && item.colUtype != "SGZH_NATIVE" && item.colUtype != "SGZH_WEB" && item.colUid != _this.state.userId);
                    })

                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    _this.initData = _this.initData.concat(response);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        footStr: response.length + '位联系人'
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
                var colPasswd = this.state.userData[0].colPasswd
            }

            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil?fromId=' + this.state.userId + '&toId=' + rowData.colUid + '&choosePos=' + this.state.choosePos + '&unionid=' + this.state.unionid + '&colPasswd=' + colPasswd + '&toName=' + rowData.userName)
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

        contactsList.setState({choosePos: 'te'})
        contactsList.state.userData.forEach(function (v, i) {
            if (v.colUtype == "TEAC") {
                contactsList.getUserContacts(v.colUid)
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

        contactsList.setState({choosePos: 'pe'})
        contactsList.state.userData.forEach(function (v, i) {
            if (v.colUtype == 'PAREN') {
                contactsList.getUserContacts(v.colUid)
            }
        })

    }

    render() {

        const row = (rowData, sectionID, rowID) => {
            return (
                <Item onClick={this.itemOnClick(rowData)}>
                    <img className='userImg' src={rowData.avatar}/>
                    <span className="text_hidden">{rowData.userName}</span>
                </Item>
            )
        }

        return (
            <div id='contactsListSimple'>
                <div className="address_header" style={{display: this.state.butFoot ? 'block' : 'none'}}>
                    <span id='selectL' className="select" onClick={this.turnToTercher}>老师</span>
                    <span id='selectR' onClick={this.turnTojiaZhang}>家长</span>
                </div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 0, textAlign: 'center'}}>
                            {this.state.footStr}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: document.body.clientHeight - 44,
                    }}
                />

            </div>
        );
    }
}
