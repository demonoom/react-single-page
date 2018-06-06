import React from 'react';
import '../css/warning.less'
import ReactEcharts from 'echarts-for-react';
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;
var _this = this;
var timeTicket;

export default class warning extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classId = locationSearch.split("&")[0].split('=')[1];
        var openTime = locationSearch.split("&")[1].split('=')[1];
        var closeTime = locationSearch.split("&")[2].split('=')[1];
        console.log(classId, 'classId');
        this.initData = [];
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.setState({
            isShowCharts: false,   //是否显示图表  未取值先隐藏
            clientHeight: document.body.clientHeight,
            dataSource: dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,  //加载提示文字
            defaultPageNo: 1,  //页码
            hasMore: true,     //加载更多flag
            classId: classId,
            tableData: [], // 表格初始值
            openTime:openTime,
            closeTime:closeTime
        }, () => {
            this.setState({
                // option: this.getOption(),
                // isShowCharts:true  //取得数值后开启图表显示
            })
        })
    }


    componentDidMount() {
        this.getBraceletHeartRateByCourseItemId(); //获取学生列表
        var p1 = new Promise(this.getBraceletHeartRateAnalysis.bind(this));  // 获取图表初始值
        p1.then(function (result) {   //成功之后的回调
            this.setState({
                tableData: result.response,
            }, () => {      //确保tableData值有效
                this.setState({
                    option: this.getOption(),
                    isShowCharts: true  //取得数值后开启图表显示
                }, () => { //确保图表生成后根据条件打开计时器
                    if (result.isOpening) {
                        this.timeOpen(20);
                    }
                })
            })
        }.bind(this))
        // this.getBraceletHeartRateAnalysis(this.state.classId);
        // this.timeOpen(1);
        // setTimeout(function(){
        //     this.timeClose();
        // }.bind(this),3000)

    };

    componentWillUnmount() {
        //组件卸载清除定时器
        this.timeClose();
    };

    //打开定时器   秒单位
    timeOpen(second) {
        this.timeTicket = setInterval(function () {
            //获取实时数据
            var p2 = new Promise(this.getBraceletHeartRateAnalysisBySecondsPoint.bind(this));
            p2.then(function (result) {   //回调成功
                if (!result.isOpening) {
                    this.timeClose();
                }
                console.log(result, 'p2');
                let array = result.response;
                let option = this.state.option;
                let lastData = this.state.lastData;
                // let data = this.state.tableData;
                for (var k in array) {   //添加日期和心率数值
                    if(array[k].num == 0){
                        array[k].num = 1;
                    }
                    option.series[0].data.push(parseInt(array[k].heartRate) / parseInt(array[k].num));
                    option.xAxis[0].data.push(this.formatSeconds(k));
                    lastData = k;
                }
                console.log(lastData,'k ')
                this.setState({
                    option: option,
                    lastData: lastData
                })
            }.bind(this), function (result) {   //回调失败
                Toast.info('获取实时数据失败', 1);
                this.timeClose();
            }.bind(this))
        }.bind(this), second * 1000)
    }

    //清除定时器
    timeClose() {
        clearInterval(this.timeTicket);
    }


    //获取随机数据
    getTableData() {
        return (Math.random() * 50 + 50).toFixed(1) - 0;
    }

    //获取实时数据
    getBraceletHeartRateAnalysisBySecondsPoint(resolve, reject) {
        console.log(this.state.lastData, 'lastData')
        var param = {
            "method": 'getBraceletHeartRateAnalysisBySecondsPoint',
            "courseItemId": this.state.classId,
            "lastPoint": this.state.lastData,
            "count": 1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    resolve(result);
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
                reject(error);
            }
        });
    }


    //图表数据源
    getOption = () => ({
        title: {
            // text: '平均心率折线图1234567890',   //标题  建议使用自定义
            // fontSize:'12px'

        },
        tooltip: {
            trigger: 'axis'  //轴
        },
        legend: {
            data: ['平均心率'],

        },
        grid: {   //图表距离屏幕四边的距离
            top: 60,
            left: 30,
            right: 20,
            bottom: 30
        },
        visualMap: {
            show: false,
            min: 0,
            max: 1000,
            color: ['red']   //折线颜色
        },
        xAxis: [
            {
                type: 'category',
                // name:'时间',
                boundaryGap: true,
                data: (function () {
                    let res = [];   //x轴时间数据源
                    let array = this.state.tableData;
                    for (var k in array) {
                        res.push(this.formatSeconds(k))
                    }
                    return res;
                }.bind(this))()
            },
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '心率',
                max: 100,
                min: 50,
                boundaryGap: [0, 0]  //边距
            },
        ],
        series: [
            {
                name: '平均心率',
                type: 'line',
                data: (function () {
                    var res = [];    //心率数据源
                    var lastData = ''; // 最后一条数据
                    var array = this.state.tableData;
                    console.log(array, 'res');
                    for (var k in array) {
                        if(array[k].num == 0){
                            array[k].num = 1;
                        }
                        res.push(parseInt(array[k].heartRate) / parseInt(array[k].num));
                        // res.push(array[k].heartRate)
                        // res.push((Math.random() * 50 + 50).toFixed(1) - 0);
                        lastData = k;
                    }
                    this.setState({
                        lastData: lastData,
                    })
                    return res;
                }.bind(this))(),//即时自调
                smooth: false,
                // symbol: 'star',//节点形状
            }
        ],
        animation: true,
    });


    //根据班级获取学生心率信息     //列表数据
    getBraceletHeartRateByCourseItemId(classId) {
        var param = {
            "method": 'getBraceletHeartRateByCourseItemId',
            "courseItemId": this.state.classId,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    let arr = result.response;
                    if (arr.length > 0) {
                        this.initData = this.initData.concat(arr);
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.initData),
                            isLoadingLeft: false,
                        })
                    } else {
                        this.setState({
                            isLoadingLeft: false,
                            hasMore: false,  //无数据 关闭加载更多
                        })
                    }
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
            }
        });
    }

    //获取手环心率统计   //初次渲染的图表数据
    getBraceletHeartRateAnalysis(resolve, reject) {
        var param = {
            "method": 'getBraceletHeartRateAnalysis',
            "courseItemId": this.state.classId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    resolve(result);
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
                reject(error);
            }
        });
    }

    //秒数转时分秒
    formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime) + "秒";  //秒
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + "分" + result;  //分钟
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + "时" + result;   //小时
        }
        return result;
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */

    onEndReached = () => {
        console.log('触发触底事件')
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoadingLeft && !_this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo}, () => {
            this.getBraceletHeartRateByCourseItemId(this.state.classId, this.state.defaultPageNo)
        });
        // _this.setState({
        //     dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
        //     isLoadingLeft: true,
        // });
    };

    render() {
        if (this.state.isShowCharts) {
            var charts = (
                <div className='parent' style={{backgroundColor:'white'}}>
                    <div className="head">{this.state.openTime}~{this.state.closeTime} 平均心率折线图</div>
                    <ReactEcharts ref='echarts_react'
                                  option={this.state.option}
                                  style={{height: this.state.clientHeight * 0.5}}/>
                    {/*<div style={{*/}
                        {/*textAlign: 'center'*/}
                    {/*}}>平均心率折线图*/}
                    {/*</div>*/}
                </div>
            )
        } else {
            charts = (  //暂无数据
                <div></div>
            )
        }
        const row = (item) => {
            return (
                <Item extra={WebServiceUtil.formatYMD(item.heartTime)} align="top" thumb={item.user.avatar}
                      multipleLine>
                    {item.user.userName} <Brief>{item.heartRate}(心率)</Brief>
                </Item>
            )
        };
        return (
            <div id='warning'>
                {charts}
                <div>
                    <List className="my-list">
                        <div className="list_title">
                            <div style={{
                                boxSizing:'border-box',
                                display:'inline-block',
                                width:'50%'
                            }}>超出正常心率的学生</div>
                            <div style={{
                                boxSizing:'border-box',
                                display:'inline-block',
                                width:'50%',
                                textAlign:'right'
                            }}>正常心率: 80-90</div>
                        </div>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{paddingTop: 5, paddingBottom: 5, textAlign: 'center'}}>
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
                                height: this.state.clientHeight * 0.5,
                            }}
                        >
                        </ListView>
                    </List>
                </div>
            </div>
        );
    }
}
