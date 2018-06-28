import React from 'react';
import {
    Toast, DatePicker, ListView, Button, ActivityIndicator,WhiteSpace
} from 'antd-mobile';
import '../css/classAttendance.less'
export default class classAttendance extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoadingLeft:true,
            hasMore:true,
        }
    }

    componentDidMount() {
        document.title = '班级考勤';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
        console.log(schoolId);
    }



    getBraceletStudentAttendancePie() {
        this.showToast();
        var param = {
            "method": 'getBraceletStudentAttendancePie',
            "schoolId": this.state.schoolId,
            "attendDate": WebServiceUtil.formatYMD(this.state.date.getTime()),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // console.log(result);
                if (result.success) {
                    this.getData(result.response);
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
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

    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div>班级考勤</div>
            )
        };
        return (
            <div id="classAttendance">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                            {this.state.isLoadingLeft ? '正在加载...' : '已经全部加载完毕'}
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