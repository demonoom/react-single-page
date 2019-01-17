import React from "react";
import {
    ListView,
} from 'antd-mobile';
import '../../../helpers/webServiceUtil'
var tLibrary;
export default class moreReview extends React.Component {
    constructor(props) {
        super(props);
        tLibrary = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoadingLeft: true,
        };
    }
    componentDidMount() {
        Bridge.setRefreshAble("true");
        Bridge.setShareAble("false");
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        this.setState({
            ident
        })
        this.seeMoreReview(ident, true)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', tLibrary.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            tLibrary.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }

    /**
     * 去课堂回顾
     */
    toReview = (v) => {
        console.log(v.vid, "V")
        var url = "https://jiaoxue.maaee.com:9093/#/cloundSchoolDetail?vId=" + v.courseId + "&userId=" + this.state.ident + "&type=3&name=" + v.name + "&judgeFlag=''"
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        currentPageNo += 1;
        _this.setState({ isLoadingLeft: true, defaultPageNo: currentPageNo }, () => {
            _this.seeMoreReview(this.state.ident, false)
        });

    };

    /**
     * 查看更多回顾
     */
    seeMoreReview = (ident, flag) => {
        var _this = this;
        if (flag) {
            _this.initData.splice(0);
            _this.state.dataSource = [];
            _this.state.dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            });
        }
        const dataBlob = {};
        var param = {
            "method": "viewCourseReviewPage",
            "adminId": ident,
            "cType": 3,
            "begin": "2000-01-01",
            "end": "2050-01-01",
            "tId": -1,
            "pageNo": this.state.defaultPageNo
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = result.response;
                    var pager = result.pager;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    if (arr.length > 0) {
                        if (pager.pageCount == 1 && pager.rsCount < 16) {
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
                    }, () => {
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData, "rrr")
            return (
                <div className='item'>
                    <div className='courseName text_hidden'>

                        {
                            rowData.name
                        }
                    </div>
                    <div className='classBtn' onClick={this.toReview.bind(this, rowData)}>查看回顾</div>
                    <div className='time'>开课时间：
                        {
                            rowData.openTime
                        }
                    </div>
                    <div className='leftCont my_flex'>
                        <div>
                            <img src={rowData.teacher.avatar} alt=""/>
                            <div  className='teacherName text_hidden'>
                                {
                                    rowData.teacher.userName
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        };

        
        return (
            <div id="classSortPage" className='moreReview'>
            <div><span onClick={this.historyGoBack}>返回</span><span>历史回顾</span></div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{ paddingTop: 6, textAlign: 'center' }}>
                            {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list classList"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: this.state.clientHeight,
                    }}
                />
            </div >
        )
    }
}