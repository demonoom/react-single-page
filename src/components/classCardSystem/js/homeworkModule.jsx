import React from 'react';
import {ListView} from 'antd-mobile';
import '../css/homeworkModule.less';


export default class homeworkModule extends React.Component {
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
            defaultPageNo: 1,
            listViewDisplay: false,
        };
    }


    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classId = locationSearch.split("=")[1];
        this.setState({"classId": classId})
        this.getHomeworkData(classId);
    }


    getHomeworkData(classId) {
        var _this = this;
        _this.state.listViewDisplay = true;
        const dataBlob = {};
        var pageNo = _this.state.defaultPageNo;
        var param = {
            "method": 'getTopicsByClazzId',
            "clazzIds": classId,
            "pageNo": pageNo
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    if (result.response.length === 0) {
                        _this.setState({"isLoadingLeft": false})
                    } else {
                        _this.setState({
                            homeworkData: result.response
                        })
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
        });
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
        this.getHomeworkData(this.state.classId);
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

    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            var color = "#ccc";
            var borderW = ""
            return (
                <div>
                    <div className="homeworkInfo">
                        <div className="homeworkL">
                            {/* <h3 className="subject textOver">{rowData.title}</h3> */}
                            <div className="imgInfo">
                                <img src={rowData.fromUser.avatar}/>
                                <span className="textOver">{rowData.fromUser.userName}</span>
                            </div>
                        </div>
                        <div className="homeworkM">
                            <h3>{rowData.title}</h3>
                            <p>{rowData.content}</p>
                        </div>
                        <div className="homeworkR">
                            <p>{WebServiceUtil.formatYMD(rowData.createTime)}</p>
                            {rowData.attachMents.length == 0 ? '' : <img src={rowData.attachMents[0].address}/>}
                            <img/>
                        </div>

                    </div>

                </div>
            )
        };
        return (
            <div id="homeworkModule" className="home_content" style={{height: document.body.clientHeight}}>
                <div className="inner_bg">
                    <div className="navBar">
                        <span onClick={this.historyGoBack}>首页</span>
                        <span className="icon">></span>
                        <span>蚁巢作业</span>
                    </div>
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
                </div>
            </div>
        );
    }
}