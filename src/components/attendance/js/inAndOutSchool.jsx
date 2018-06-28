import React from 'react';
import {
    Toast, DatePicker, ListView, Button, List, Menu
} from 'antd-mobile';
import '../css/inAndOutSchool.less';
var initData = [];

export default class inAndOutSchool extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [{
            name: '张三',
            time: '11点10分'
        }, {
            name: '李四',
            time: '9点12分'
        }];
        var date = WebServiceUtil.formatYMD(new Date().getTime());
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoadingLeft: false,
            hasMore: true,
            startDate: new Date(),
            endDate: new Date(),
            userType: 'master',
            show: true,
        }
    }

    componentDidMount() {
        document.title = '出入校园考勤';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
        this.getBraceletStudentAttendancePie();
    }


    getBraceletStudentAttendancePie() {
        // this.showToast();
        // var param = {
        //     "method": 'getBraceletStudentAttendancePie',
        //     "schoolId": this.state.schoolId,
        //     "attendDate": WebServiceUtil.formatYMD(this.state.date.getTime()),
        // };
        //
        // WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
        //     onResponse: result => {
        //         // console.log(result);
        //         if (result.success) {
        //             this.getData(result.response);
        //         } else {
        //             Toast.fail('请求出错');
        //         }
        //     },
        //     onError: function (error) {
        //         Toast.fail(error, 1);
        //     }
        // });

        setTimeout(() => {
            var _this = this;
            //筛选班级
                var dom = '';
                if (this.state.userType == 'master') {
                    initData = [
                        {
                            value: '1',
                            label: '一年级',
                            children: [
                                {
                                    label: '实验班',
                                    value: '11',
                                },
                                {
                                    label: '一班',
                                    value: '12',
                                }, {
                                    label: '测试班',
                                    value: '13',
                                }, {
                                    label: '二班',
                                    value: '14',
                                }, {
                                    label: '三班',
                                    value: '15',
                                }, {
                                    label: '四班',
                                    value: '16',
                                }, {
                                    label: '五班',
                                    value: '17',
                                }, {
                                    label: '六班',
                                    value: '18',
                                }, {
                                    label: '七班',
                                    value: '19',
                                }, {
                                    label: '八班',
                                    value: '110',
                                }],
                        }, {
                            value: '2',
                            label: '二年级',
                            children: [
                                {
                                    label: '一班',
                                    value: '21',
                                }, {
                                    label: '二班',
                                    value: '22',
                                }, {
                                    label: '三班',
                                    value: '23',
                                }, {
                                    label: '四班',
                                    value: '24',
                                }],
                        },
                        {
                            value: '3',
                            label: '三年级',
                            children: [
                                {
                                    label: '一班',
                                    value: '31',
                                },
                            ],
                        },
                    ];
                    dom = <Menu
                        className="multi-foo-menu"
                        data={initData}
                        // value={['1', ['3', '4']]}
                        value={['1', []]}
                        onOk={this.onOkForCheck}
                        onCancel={this.onCancelForCheck}
                        height={document.documentElement.clientHeight * 0.6}
                        multiSelect
                    />
                } else if (this.state.userType == 'grade') {
                    initData = [
                        {
                            value: '1',
                            label: '一班',
                        }, {
                            value: '2',
                            label: '二班',
                        },
                        {
                            value: '3',
                            label: '三班',
                        },
                    ];
                    dom = <Menu
                        className="single-multi-foo-menu"
                        data={initData}
                        value={['1']}
                        level={1}
                        onOk={this.onOkForCheck}
                        onCancel={this.onCancelForCheck}
                        height={document.documentElement.clientHeight * 0.6}
                        multiSelect
                    />
                } else { // 班级
                    dom = <div>class</div>
                }
            this.setState({
                filter: dom,
            })
        }, 1000);
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
    //TODO 开始搜索事件
    submitFilter() {
        console.log('开始提交');
        console.log('筛选条件(label):'+this.state.checkLabel);
        console.log('筛选条件(value):'+this.state.checkValue);
    }

    onOkForCheck = (value) => {   // 复选框ok事件
        var labels = this.getItemLabel(value);
        console.log(labels);
        console.log(this.state.userType == 'master'?value[1]:value);
        this.setState({
            checkLabel:labels,
            checkValue: this.state.userType == 'master'?value[1]:value
        })
        this.onCancelForCheck();
    }
    onCancelForCheck = () => {    //复选框取消事件
        this.setState({show: false});
    }

    onShow = ()=> {     //显示定位复选框事件
        this.setState({
            show: true
        })
    }



    //todo 获取选中的label
    getItemLabel = (value) =>{
        var labels = [];
        if(this.state.userType == 'master'){   //todo 校长权限
            var valueItem = value[1];
            if(valueItem.length > 0){
                var item = [];
                for(var i in valueItem){
                    for(var k in initData){
                        item = initData[k].children;
                        for(var s in item){
                            if(item[s].value == valueItem[i]){
                                labels.push(item[s].label);
                            }
                        }

                    }
                }
            } else{
                var labels = [];
                for(var k in initData){
                    if(initData[k].value == value[0]){
                        labels.push(initData[k].label);
                    }
                }
            }
        }else{                     //todo 年级主任权限
            var item=[];
            for(var s in value){
                for(var k in initData){
                    if(initData[k].value == value[s]){
                        labels.push(initData[k].label);
                    }
                }
            }
        }

        return labels;
    }

    /**
     * 点击mask事件
     * **/
    onClickMask = () =>{
        this.setState({
            show: false,
        })
    }

    setStartDate = (event) =>{
        console.log(event,'startDate');
        this.setState({
            startDate: event,
        })
    }
    setEndDate = (event) =>{
        console.log(event,'endDate');
        this.setState({
            endDate: event,
        })
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div className="list_ul">
                    <div className="list_li">{rowData.name}</div>
                    <div className="list_li">23836</div>
                    <div className="list_li">{rowData.time}</div>
                    <div className="list_li">18:00</div>
                </div>
            )
        };
        return (
            <div id="inAndOutSchool" style={{
                height: document.body.clientHeight
            }}>
                <div className="mask" onClick={this.onClickMask} style={
                    this.state.show ? {display: 'block', height: document.body.clientHeight} : {
                        display: 'none',
                        height: document.body.clientHeight
                    }
                }/>
                <button onClick={this.onShow}>显示/隐藏</button>
                <div className="filterBox" style=
                    {this.state.show ? {transform: 'translateX(0%)'} : {transform: 'translateX(-100%)'}}
                >
                    {this.state.filter}
                </div>
                <div className="DateBox">
                    <div className="startTime">
                        <DatePicker
                            value={this.state.startDate}
                            onChange={this.setStartDate}
                        >
                            <List.Item arrow="horizontal"></List.Item>
                        </DatePicker>
                    </div>
                    <div className="endTime">
                        <DatePicker
                            value={this.state.endDate}
                            onChange={this.setEndDate}
                        >
                            <List.Item arrow="horizontal"></List.Item>
                        </DatePicker>
                    </div>

                    <button onClick={this.submitFilter.bind(this)}>确定</button>
                </div>
                <div className="list_ul_title">
                    <div className="list_li_title">姓名</div>
                    <div className="list_li_title">学号</div>
                    <div className="list_li_title">初次入校时间</div>
                    <div className="list_li_title">最后离校时间</div>
                </div>
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