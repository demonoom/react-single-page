import React from 'react';
import fetch from 'dva/fetch'
import {
    ListView,SearchBar, Button, WhiteSpace, WingBlank,List
} from 'antd-mobile';
const debug=true;
const mobileUrl = debug?'http://192.168.1.16:9006/Excoord_ApiServer/webservice':'http://www.maaee.com/Excoord_For_Education/webservice';
export default class searchUserLocationInfo extends React.Component {
    constructor(props) {
        super(props);

        /*搜索用户数据*/
        const userDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initDataOther = [];

        this.state = {
            userDataSource: userDataSource.cloneWithRows(this.initDataOther),
            searchValue:"",
            isLoading: true,   //为true显示'加载'  false显示'没有跟多课程'
            defaultPageNo: 1,
            defaultPageNoOther: 1,
            historyUserArray:JSON.parse(localStorage.getItem('historyUserArray')),
            isShowHistoryRecord:{display:'none'},
            // clicked: 'none',
            // open: false,
            // tabOnClick: 0,
            // refreshing: false,   //下拉刷新状态
        };
    }
    componentWillMount(){

    }
    componentDidMount() {
        var historyUserArray = this.state.historyUserArray;
        var isShowHistoryRecord=historyUserArray!=undefined&&historyUserArray.length>0?{display:'block'}:{display:'none'};
        this.setState({isShowHistoryRecord:isShowHistoryRecord});
    }
    //右侧下拉刷新
    onRefreshOther = () => {
        this.setState({defaultPageNoOther: 1, refreshing: true});
        this.getUserLocationInfo(true);
    };

    parseJSON(response) {
        return response.json();
    }

    /**
     *  ListView数据全部渲染完毕的回调  (右侧)
     */
    otherOnEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNoOther;
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        //这个if没有成立过
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoading: true, defaultPageNoOther: currentPageNo});
        _this.getUserLocationInfo(false);
        this.setState({
            userDataSource: this.state.userDataSource.cloneWithRows(this.initDataOther),
            isLoading: false,
        });
    };
    searchHistoryRecord=(i)=>{
        var _this = this;
        this.setState({searchValue:i});

        setTimeout(function () {
            _this.getUserLocationInfo(false);
        },300)
    }
    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    handleChange=(value)=> {
        this.setState({searchValue:value})
    }
    clear = () => {
        this.setState({ value: '' });
    };
    /**
     *
     */
    getUserLocationInfo=(pullFalg)=> {

        var searchKeyWords=this.state.searchValue;
        var historyUserArray=JSON.parse(localStorage.getItem('historyUserArray'));
        if(historyUserArray==undefined||historyUserArray.length==0){
            historyUserArray=new Array();
            historyUserArray.unshift(this.state.searchValue);
        }else{
            if(historyUserArray.length==10) {
                historyUserArray.pop();
            }
            historyUserArray.unshift(this.state.searchValue);
        }
        localStorage.setItem("historyUserArray", JSON.stringify(historyUserArray));
        this.setState({historyUserArray:historyUserArray});
        this.setState({isShowHistoryRecord:{display:'none'}});
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNoOther;
        var param = {
            "method": 'searchUserLocationInfo',
            "pageNo": PageNo,
            "userId": '',
            "searchKeyWords":searchKeyWords ,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var response = result.data.response;
                for (let i = 0; i < response.length; i++) {
                    var topic = response[i];
                    topic.checkBoxChecked = false;
                    dataBlob[`${i}`] = topic;
                }
                if (pullFalg) {    //拉动刷新  获取数据之后再清除原有数据
                    _this.initDataOther.splice(0);
                    _this.state.userDataSource = [];
                    _this.state.userDataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                }
                _this.initDataOther = _this.initDataOther.concat(response);
                _this.setState({
                    userDataSource: _this.state.userDataSource.cloneWithRows(_this.initDataOther),
                    isLoading: false,
                    refreshing: false
                })
            });
    }


    render() {
        var historyUserArray = this.state.historyUserArray;
        var isShowHistoryRecord=this.state.isShowHistoryRecord;
        var _this = this;
        var searchValue = this.state.searchValue;
        const search=()=>{
            return (<div>搜索</div>);
        }
        //右边每一道题的div(暂时废弃)
        const rowRight = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID} className="exercises_line">
                    <div>{rowData.user.userName}</div>
                    <div><img src={rowData.user.avatar}></img></div>
                    <div>{rowData.user.colAccount}</div>
                    <div>{rowData.user.schoolName}</div>
                    <div><span>设备名称:</span><span>{rowData.androidLoginRecord.deviceName}</span></div>
                    <div><span>设备类型:</span><span>{rowData.androidLoginRecord.machineType}</span></div>
                    <div><span>地址:</span><span>{rowData.androidLoginRecord.address}</span></div>
                    <div><span>登录时间:</span><span>{rowData.androidLoginRecord.accessTime}</span></div>

                    <div><span>设备名称:</span><span>{rowData.iosLoginRecord.deviceName}</span></div>
                    <div><span>设备类型:</span><span>{rowData.iosLoginRecord.machineType}</span></div>
                    <div><span>地址:</span><span>{rowData.iosLoginRecord.address}</span></div>
                    <div><span>登录时间:</span><span>{rowData.iosLoginRecord.accessTime}</span></div>

                </div>
            );
        };

        //上下行间距
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 1,
                    borderTop: '1px solid #ECECED',
                }}
            />
        );
        //历史记录
        var historyRecord;
        if(historyUserArray!=null&&typeof (historyUserArray)!=undefined) {
            historyRecord = (<List>
                {historyUserArray.map((i) => {
                    return (<List.Item

                        onClick={() => this.searchHistoryRecord(i)}
                        className="icon_homework_check"
                    >{i}</List.Item>);
                })}
            </List>);
        }

        return (
            <div >
                <WingBlank></WingBlank>
                <SearchBar placeholder="搜索" maxLength={8}
                           onSubmit={this.getUserLocationInfo}
                           value={searchValue}
                           onChange={_this.handleChange} />
                <WhiteSpace />
                <div style={isShowHistoryRecord}>
                <div className="color_6 color_6_p">搜索历史</div>
                    {historyRecord}
                </div>
            <ListView
                dataSource={this.state.userDataSource}    //数据类型是 ListViewDataSource
                renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                    {this.state.isLoading ? '正在加载' : '没有更多数据了'}
                </div>)}
                renderRow={rowRight}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                renderSeparator={separator}   //可以不设置的属性  行间距
                className="am-list"
                pageSize={5}    //每次事件循环（每帧）渲染的行数
                onScroll={() => {
                    console.log('scroll');
                }}   //在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用scrollEventThrottle属性来控制。
                scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                onEndReached={this.otherOnEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                initialListSize={30}
                scrollEventThrottle={20}
                style={{
                    height: document.body.clientHeight,
                }}
                // pullToRefresh={<PullToRefresh
                //     onRefresh={this.onRefreshOther}
                //     distanceToRefresh={80}
                // />}
            />
            </div>

        );
    }
}
