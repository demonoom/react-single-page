import React from 'react';
import fetch from 'dva/fetch'
import './userinfo.css'
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
            isLoading: 0,   //为true显示'加载'  false显示'没有跟多课程'
            defaultPageNo: 1,
            defaultPageNoOther: 1,
            historyUserArray:JSON.parse(localStorage.getItem('historyUserArray')),
            isShowHistoryRecord:{display:'none'},
            isShowUserList:{display:'block'},
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
        // this.setState({defaultPageNoOther: 1, refreshing: true});
        // this.getUserLocationInfo(true);
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
        if (this.state.isLoading==1 && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoading: 1, defaultPageNoOther: currentPageNo});
        _this.getUserLocationInfo(false);
        this.setState({
            userDataSource: this.state.userDataSource.cloneWithRows(this.initDataOther),
            isLoading: 2,
        });
    };
    searchHistoryRecord=(i)=>{
        var _this = this;
        this.setState({searchValue:i});

        setTimeout(function () {
            _this.getUserLocationInfo(true);
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
        this.setState({searchValue:value});
    }
    cancelSearch=()=>{
        this.setState({isShowHistoryRecord:{display:'block'}});
        this.initDataOther.splice(0);
        this.state.dataSourceOther = [];
        this.state.dataSourceOther = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
    }
    clear = () => {
        this.setState({ value: '' });
    };
    saveHistoryRecord=(searchKeyWords)=>{
        var historyUserArray=JSON.parse(localStorage.getItem('historyUserArray'));
        if(searchKeyWords!=""&&searchKeyWords!=undefined) {
            if (historyUserArray == undefined || historyUserArray.length == 0) {
                historyUserArray = new Array();
                historyUserArray.unshift(this.state.searchValue);
            } else {
                if (historyUserArray.length == 10) {
                    historyUserArray.pop();
                }
                historyUserArray.unshift(this.state.searchValue);
            }
        }
        localStorage.setItem("historyUserArray", JSON.stringify(historyUserArray));
        this.setState({historyUserArray:historyUserArray});
        if(searchKeyWords==''||searchKeyWords==undefined){
            this.setState({isShowHistoryRecord: {display: 'block'}});
        }else {
            this.setState({isShowHistoryRecord: {display: 'none'}});
        }
    }
    clearHistoryRecord=()=>{
        this.setState({historyUserArray:new Array() });
    }
    /**
     *
     */
    getUserLocationInfo=(isSearch)=> {
        var searchKeyWords=this.state.searchValue;
        this.saveHistoryRecord(searchKeyWords);
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        const dataBlob = {};
        var PageNo ;
        if(isSearch){
            PageNo=1;
        }else{
            PageNo = this.state.defaultPageNoOther;
        }
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
                if (isSearch) {    //拉动刷新  获取数据之后再清除原有数据
                    _this.initDataOther.splice(0);
                    _this.state.dataSourceOther = [];
                    _this.state.dataSourceOther = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                }
                _this.initDataOther = _this.initDataOther.concat(response);
                _this.setState({
                    userDataSource: _this.state.userDataSource.cloneWithRows(_this.initDataOther),
                    isLoading: 2,
                    refreshing: false
                })
            });
    }


    render() {
        var historyUserArray = this.state.historyUserArray;
        var isShowHistoryRecord=this.state.isShowHistoryRecord;
        var _this = this;
        var searchValue = this.state.searchValue;
        var loadInfo='';
        var isLoading=this.state.isLoading;
        if(isLoading==0){
            loadInfo='';
        }else if(isLoading==1){
            loadInfo='正在加载';
        }else if(isLoading==2){
            loadInfo='没有更多数据了';
        }
        //右边每一道题的div(暂时废弃)
        const rowRight = (rowData, sectionID, rowID) => {
            if(!rowData){
                return (<div></div>)
            }
            var androidLoginRecord=rowData.androidLoginRecord;
            var iosLoginRecord=rowData.iosLoginRecord;
            var isAndroidEmpty=false;
            var isIosEmpty=false;
            var isAndroidShow={display:'none'};
            var isIosShow={display:'none'};
            var iosEmptyInfo;
            var androidEmptyInfo;
            if(androidLoginRecord!=undefined){
                isAndroidEmpty=true;
                isAndroidShow={display:'block'};
            }else{
                androidEmptyInfo='暂无安卓登录信息';

            }
            if(iosLoginRecord!=undefined){
                isIosEmpty=true;
                isIosShow={display:'block'};
            }else{
                iosEmptyInfo='暂无苹果系统登录信息';
            }
            return (
                <div key={rowID} className="exercises_line userinfo_cont">
                    <div className="my_flex flex_1">
                        <div className="user_face">
                            <img src={rowData.user.avatar}></img>
                        </div>
                        <div className="flex_auto">
                            <div className="font_15 user_name">
                                <span>{rowData.user.userName}</span>
                                <span>（{rowData.user.colAccount}）</span>
                            </div>
                            <div className="font_13 color_6 user_name">{rowData.user.schoolName}</div>
                        </div>
                    </div>
                    <hr className="line"></hr>
                    <div className="userinfo_info font_14">
                        <div className="color_9">{androidEmptyInfo}</div>
                        <div className="color_9" style={isAndroidShow}>
                        <div><span className="color_9 userinfo_left">设备名称</span><span className="userinfo_right">{isAndroidEmpty?rowData.androidLoginRecord.deviceName:"暂无数据"}</span></div>
                            <div><span className="color_9 userinfo_left">设备类型</span><span className="userinfo_right"><img className="icon_ios" src={require('./icon_android.png')}/>{isAndroidEmpty?rowData.androidLoginRecord.machineType:"暂无数据"}</span></div>
                        <div><span className="color_9 userinfo_left">地址</span><span className="userinfo_right">{isAndroidEmpty?rowData.androidLoginRecord.address:""}</span></div>
                        <div><span className="color_9 userinfo_left">登录时间</span><span className="userinfo_right">{isAndroidEmpty?rowData.androidLoginRecord.accessTime:"暂无数据"}</span></div>
                        </div>
                        <hr className="line"></hr>
                        <div className="color_9">{iosEmptyInfo}</div>
                        <div className="color_9" style={isIosShow}>
                        <div><span className="color_9 userinfo_left">设备名称</span><span className="userinfo_right">{isIosEmpty?rowData.iosLoginRecord.deviceName:"暂无数据"}</span></div>
                        <div><span className="color_9 userinfo_left">设备类型</span><span className="userinfo_right"><img className="icon_ios" src={require('./icon_ios.png')}/>{isIosEmpty?rowData.iosLoginRecord.machineType:"暂无数据"}</span></div>
                        <div><span className="color_9 userinfo_left">地址</span><span className="userinfo_right">{isIosEmpty?rowData.iosLoginRecord.address:"暂无数据"}</span></div>
                        <div><span className="color_9 userinfo_left">登录时间</span><span className="userinfo_right">{isIosEmpty?rowData.iosLoginRecord.accessTime:"暂无数据"}</span></div>
                        </div>
                    </div>

                </div>
            );
        };

        //上下行间距
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                className="line_item"
            />
        );
        //历史记录
        var historyRecord;
        if(historyUserArray!=null&&typeof (historyUserArray)!=undefined) {
            historyRecord = (<List>
                {historyUserArray.map((i) => {
                    return (<List.Item

                        onClick={() => this.searchHistoryRecord(i)}
                        className="search_list_item"
                    >{i}</List.Item>);
                })}
            </List>);
        }

        return (
            <div className="userinfo_wrap">
                <SearchBar placeholder="搜索" maxLength={8}
                           onSubmit={this.getUserLocationInfo.bind(this,true)}
                           value={searchValue}
                           className="search_top"
                           onChange={_this.handleChange} />
                <div style={isShowHistoryRecord}>
                <div className="color_9 color_6_p font_14">搜索历史<span className="icon_del" onClick={() => this.clearHistoryRecord()}><img src={require('./icon_del_n.png')}/></span></div>
                    {historyRecord}
                </div>
            <ListView
                dataSource={this.state.userDataSource}    //数据类型是 ListViewDataSource
                renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                    {loadInfo}
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
