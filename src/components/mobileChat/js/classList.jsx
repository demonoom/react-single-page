import React from 'react';
import {ListView, Toast, List} from 'antd-mobile';
import '../css/classList.less'

var class_List;
const {Item} = List;

export default class classList extends React.Component {

    constructor(props) {
        super(props);
        class_List = this;
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
        document.title = "我的班级";   //设置title

        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var colPasswd = searchArray[1].split('=')[1];
        var unionid = searchArray[2].split('=')[1];
        this.setState({userId, colPasswd, unionid});
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
        this.getClazzesByUserId()
    }

    getClazzesByUserId() {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getClazzesByUserId',
            "userId": this.state.userId,
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

            var colPasswd = class_List.state.colPasswd
            var unionid = class_List.state.unionid

            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'friendList?fromId=' + class_List.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&clazzId=' + rowData.id + '&clazzName=' + rowData.name)
        }
    }

    render() {

        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            return (
                <Item onClick={this.itemOnClick(rowData)}>
                    {/*<img className='userImg' src={rowData.avatar}/>*/}
                    <i className="userImg message_class2"></i>
                    <span className="text_hidden">{rowData.grade.name + rowData.name}</span>
                </Item>
            )
        }

        return (
            <div id="classList">
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
