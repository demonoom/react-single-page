import React from 'react';
import {ListView, WingBlank, Toast} from 'antd-mobile';
import './analysisList.less';

export default class analysisList extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            isLoading: true,   //为true显示'加载'  false显示'没有跟多课程'
            defaultPageNo: 1,
        }
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var colUid = searchArray[0].split('=')[1];
        var loginUser = {
            "colUid": colUid,
        };
        localStorage.setItem("loginUserAnalyList", JSON.stringify(loginUser));
    }

    componentDidMount() {
        document.title = '成绩分析';
        this.viewPaperAnalysisTaskPage()
    }

    /**
     * 查看试卷分析中的年级的结果
     */
    viewPaperAnalysisTaskPage() {
        var loginUser = JSON.parse(localStorage.getItem('loginUserAnalyList'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'viewPaperAnalysisTaskPage',
            "colUid": loginUser.colUid,
            "pageNo": PageNo,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                if (result.success == true && result.msg == '调用成功') {
                    //  获得数据
                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    _this.initData = _this.initData.concat(response);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoading: false,
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
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (this.state.getUserLocationInfo && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({getUserLocationInfo: true, defaultPageNo: currentPageNo, isLoading: true,});
        _this.viewPaperAnalysisTaskPage();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
        });
    };

    /**
     * 分析题目
     * @param id
     */
    turnToAnaysis(id) {
        // window.open("/#/resultAnalysis?taskId=" + id);

        var url = "http://jiaoxue.maaee.com:8091/#/resultAnalysis?taskId=" + id;
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {

        //上下行间距
        const separator = (sectionID, rowID) => (
            <div className="line"
                 key={`${sectionID}-${rowID}`}
            />
        );

        const row = (rowData, sectionID, rowID) => {
            return (
                <div
                    key={rowID}
                    onClick={this.turnToAnaysis.bind(this, rowData.taskId)}
                    className='analysisListDiv'
                >
                    <img src={require('./lALPBY0V4uapiOAwMA_48_48.png')}/>
                    {rowData.taskName}
                </div>
            );
        };

        return (
            <div className='analysisList'>
                <WingBlank size='sm'>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (<div style={{padding: 10, textAlign: 'center'}}>
                            {this.state.isLoading ? '正在加载' : '没有更多成绩单了'}
                        </div>)}
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        renderSeparator={separator}   //可以不设置的属性  行间距
                        className="am-list"
                        pageSize={5}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        onScroll={() => {
                            console.log('scroll');
                        }}   //在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用scrollEventThrottle属性来控制。
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={20}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: document.body.clientHeight,
                        }}
                    />
                </WingBlank>
            </div>
        );
    }
}
