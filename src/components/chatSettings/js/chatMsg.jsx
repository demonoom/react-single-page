import React from "react";
import {SearchBar, Button, WhiteSpace, WingBlank, ListView, Toast, Card} from 'antd-mobile';
import '../css/chatMsg.less'

var chatMsgs;

export default class chatMsg extends React.Component {
    constructor(props) {
        super(props)
        chatMsgs = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            listViewDisplay: false,
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = "查找聊天内容";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var uid = searchArray[0].split('=')[1];
        var tid = searchArray[1].split('=')[1];
        var type = searchArray[2].split('=')[1];
        this.setState({uid, tid, type});
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', chatMsgs.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', chatMsgs.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            chatMsgs.setState({clientHeight: document.body.clientHeight});
        }, 100)
    }

    getUserLocationInfo(e) {
        this.setState({inputValue: e});
        this.state.listViewDisplay = true;
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'searchChatRecords',
            "uid": this.state.uid,
            "tid": this.state.tid,
            "type": this.state.type,
            "keywork": e,
            "pn": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    if (result.response.length == 0) {
                        _this.state.listViewDisplay = false;
                        _this.setState({listViewDisplay: false})
                        Toast.info('沒有查到相关内容', 1);
                    } else {
                        var arr = result.response;
                        var pager = result.pager;
                        for (let i = 0; i < arr.length; i++) {
                            var topic = arr[i];
                            dataBlob[`${i}`] = topic;
                        }
                        var isLoading = false;
                        if (arr.length > 0) {
                            if (pager.pageCount == 1 && pager.rsCount < 30) {
                                isLoading = false;
                            } else {
                                isLoading = true;
                            }
                        } else {
                            isLoading = false;
                        }
                        _this.initData = _this.initData.concat(arr);
                        _this.setState({
                            dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                            isLoadingLeft: isLoading,
                            refreshing: false
                        })
                    }

                } else {
                    Toast.fail('搜索失败', 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
        _this.getUserLocationInfo(_this.state.inputValue);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    render() {

        var _this = this;

        const row = (rowData, sectionID, rowID) => {
            return (
                <div>
                    <WhiteSpace size="lg" className="noomWhite"/>
                    <Card full>
                        <Card.Header
                            className='noomCardHeader'
                            title={rowData.fromUser.userName}
                            thumb={rowData.fromUser.avatar}
                            extra={
                                <span>{WebServiceUtil.formatYMD(rowData.createTime)}</span>}
                        />
                        <Card.Body>
                            <div className='noomCardContent'>{rowData.content}</div>
                        </Card.Body>
                    </Card>
                </div>
            )
        };

        return (
            <div id="chatMsg" style={{height: this.state.clientHeight}}>
                <SearchBar
                    placeholder="搜索"
                    maxLength={8}
                    onSubmit={this.getUserLocationInfo.bind(this)}
                />
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                            {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: chatMsgs.state.clientHeight - 44,
                        display: this.state.listViewDisplay ? 'block' : 'none'
                    }}
                />
            </div>
        )
    }
}