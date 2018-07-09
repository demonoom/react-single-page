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
            userId: 23836
        };
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天";   //设置title
    }

    componentDidMount() {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getUserContacts',
            "ident": this.state.userId,
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
            console.log(rowData);
            window.location.href = '//192.168.50.29:8091/#/chatDetil?fromId=' + this.state.userId + '&toId=' + rowData.colUid;
        }
    }

    render() {

        const row = (rowData, sectionID, rowID) => {
            return (
                <Item onClick={this.itemOnClick(rowData)}>
                    <img className='userImg' src={rowData.avatar}/>
                    <span>{rowData.userName}</span>
                </Item>
            )
        }

        return (
            <div id='contactsListSimple'>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                            {this.state.footStr}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: document.body.clientHeight,
                    }}
                />
            </div>
        );
    }
}
