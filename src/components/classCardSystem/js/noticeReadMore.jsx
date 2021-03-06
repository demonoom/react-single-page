import React from "react";
import {ListView, Accordion, List} from "antd-mobile";
import "../css/noticeReadMore.less";

export default class noticeReadMore extends React.Component {
    constructor(props) {
        super(props);
        /**
         * dataSource是长列表的数据源
         * initData初始数据
         */
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            clientHeight: document.body.clientHeight,
            listViewDisplay: false,
            defaultPageNo: 1,
            initArrData: [],
            dataFlag: false
        }
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");

        var defaultId = searchArray[0].split('=')[1];
        this.setState({defaultId})
    }

    componentDidMount() {
        this.getNoticeReadMore();
    }

    /**
     * getNoticeReadMore获取出勤的方法
     */
    getNoticeReadMore() {
        var _this = this;
        _this.state.listViewDisplay = true;
        const dataBlob = {};
        var pageNo = _this.state.defaultPageNo;
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "classroomId": localStorage.getItem('roomId'),
            "pageNo": pageNo
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    _this.state.initArrData = result.response;
                    if (result.response.length === 0) {
                        _this.setState({"isLoadingLeft": false})
                    } else {
                        var arr = result.response;
                        var pager = result.pager;
                        for (let i = 0; i < arr.length; i++) {
                            var topic = arr[i];
                            dataBlob[`${i}`] = topic;
                        }
                        var isLoading = false;
                        if (arr.length > 0) {
                            if (pager.pageCount == 1 && pager.rsCount < 9) {
                                isLoading = false;
                            } else {
                                isLoading = true;
                            }
                        } else {
                            isLoading = false;
                            _this.setState({
                                dataFlag: true
                            })
                        }
                        _this.initData = _this.initData.concat(arr);
                        _this.setState({
                            dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                            isLoadingLeft: isLoading,
                            refreshing: false
                        })
                    }
                }
            },
            onError: function (error) {

            }

        })
    }

    /**
     * getTimeFormat时间戳转换格式
     */
    getTimeFormat(t) {
        var _time = new Date(t);
        // var   year=_time.getFullYear();//年
        var month = (_time.getMonth() + 1) < 10 ? ("0" + (_time.getMonth() + 1)) : (_time.getMonth() + 1);//月
        var date = _time.getDate() < 10 ? "0" + _time.getDate() : _time.getDate();//日
        var hour = _time.getHours() < 10 ? "0" + _time.getHours() : _time.getHours();//时
        var minute = _time.getMinutes() < 10 ? "0" + _time.getMinutes() : _time.getMinutes();//分
        // var   second=_time.getSeconds();//秒
        return month + "/" + date + " " + hour + ":" + minute;
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
        this.getNoticeReadMore();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
        // history.back()
    }

    /**
     * li元素的点击事件
     */
    onClick = (e) => {
        $('.ulBox li').find('.noticeContent').css({
            display: 'none'
        })
        $(e.target).next().css({
            display: 'block'
        })
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div className="divBox">
                    <ul className="ulBox">
                        <li onClick={this.onClick}>
                            <p className="title">{rowData.noticeTitle}<span
                                className="time">{this.getTimeFormat(rowData.createTime)}</span></p>
                            <div className="noticeContent" style={{display: rowID == '0' ? "block" : "none"}}>
                                {rowData.noticeContent}
                            </div>
                        </li>
                    </ul>
                </div>
            )
        };
        return (
            <div id={this.state.defaultId}>
                <div id="noticeReadMore" className="home_content" style={{height: document.body.clientHeight}}>
                    <div className="inner_bg">
                        <div className="navBar">
                            <span onClick={this.historyGoBack}>首页</span>
                            <span className="icon"></span>
                            <span>通知</span>
                        </div>
                        {
                            this.state.initArrData.length == 0 ? this.state.dataFlag ?
                                <div className="emptyPage_content">
                                    <div className="empty_center">
                                        <div className="emptyPage_icon emptyPage_publicImg"></div>
                                        <div className="emptyPage_text">暂无数据</div>
                                    </div>
                                </div> : <div></div>
                                :
                                <ListView
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                                    renderFooter={() => (
                                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                                            {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                        </div>)}
                                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                                    className="am-list"
                                    pageSize={15}    //每次事件循环（每帧）渲染的行数
                                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                                    initialListSize={15}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                                    style={{
                                        height: this.state.clientHeight,
                                        display: this.state.listViewDisplay ? 'block' : 'none'
                                    }}
                                />
                        }

                    </div>
                </div>
            </div>
        )
    }
}