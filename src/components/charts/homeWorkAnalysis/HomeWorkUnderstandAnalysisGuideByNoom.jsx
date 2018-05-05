import React from 'react';
import {ListView, Card, WingBlank, WhiteSpace} from 'antd-mobile';
import './css/HomeWorkUnderstandAnalysisGuideByNoom.less';

var tLibrary;

export default class HomeWorkUnderstandAnalysisGuideByNoom extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        tLibrary = this;
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
        };
    }

    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        this.getUserHomeworkInfoList(ident);
        this.setState({ident});
    }

    getUserHomeworkInfoList(id) {
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getUserHomeworkInfoList',
            "ident": id,
            "pageNo": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    var pager = result.pager;
                    var pagerNoom = 0;
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].useDate > 1525104000000) {
                            pagerNoom += 1;
                            var topic = arr[i];
                            dataBlob[`${i}`] = topic;
                        }
                    }
                    var isLoading = false;
                    if (arr.length > 0) {
                        if (pagerNoom == 1 && pagerNoom < 30) {
                            isLoading = false;
                        } else {
                            isLoading = true;
                        }
                        // if (pager.pageCount == 1 && pager.rsCount < 30) {
                        //     isLoading = false;
                        // } else {
                        //     isLoading = true;
                        // }
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
        _this.getUserHomeworkInfoList(_this.state.ident);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    analysisByClass(colClazzId, useDate) {
        var analysisUrl = WebServiceUtil.mobileServiceURL + "homeWorkUnderstandAnalysisByClassSubject?clazzId=" + colClazzId + "&pushTime=" + useDate + "&ident=" + this.state.ident + "&censusType=0";

        var data = {
            method: 'openNewPage',
            url: analysisUrl,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = analysisUrl;
        });
    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {
            //1525104000000
            if (rowData.useDate > 1525104000000) {
                return (
                    <WingBlank size="lg">
                        <WhiteSpace size="lg"/>
                        <Card
                            onClick={this.analysisByClass.bind(this, rowData.colClazzId, WebServiceUtil.formatYMD(rowData.useDate))}>
                            <Card.Header
                                title={rowData.clazzName}
                                extra={<span>{WebServiceUtil.formatYMD(rowData.useDate)}</span>}
                            />
                            <Card.Body>
                                <div>{rowData.colCourse}作业</div>
                            </Card.Body>
                            <Card.Footer content={rowData.hcount + '道'}/>
                        </Card>
                        <WhiteSpace size="lg"/>
                    </WingBlank>
                )
            } else {
                return false
            }

        };

        return (
            <div id="HomeWorkUnderstandAnalysisGuideByNoom" style={{height: document.body.clientHeight}}>
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
                        height: document.body.clientHeight,
                    }}
                />
            </div>
        );
    }
}
