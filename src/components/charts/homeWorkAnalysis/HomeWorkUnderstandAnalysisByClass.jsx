import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast,DatePicker,List,Button,Picker
} from 'antd-mobile';
import './css/homeWorkAnalysis.less'
var colors = ['#5793f3', '#d14a61'];
var stuIdArray = [];
var pushTimeGlobal;
var clazzIdGlobal;

// 如果不是使用 List.Item 作为 children
const CustomChildren = (props) => {
    return (
        <div
            onClick={props.onClick}
            style={{ backgroundColor: '#fff', height: 45, lineHeight: '45px', padding: '0 15px' }}
        >
            {props.children}
            <span style={{ float: 'right' }}>{props.extra}</span>
        </div>
    );
};

export default class HomeWorkUnderstandAnalysisByClass extends React.Component {

    constructor(props) {
        super(props);
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.state = {
                columnarChartOption: this.initChartOption(),
                lastPoint: '0',
                currentFaceEmotion:{},
                screenHeight:screen.height,
                stuNameArray:[],
                avgOfTimeLengthArray:[],
                avgOfUnderstandArray : [],
                stuIdArray:[],
                date: now,
                classList:[],
                clazzId: [],
                isLoading:false,
        };
        this.analysisByClass = this.analysisByClass.bind(this);
        this.getTeacherClasses = this.getTeacherClasses.bind(this);
        this.onChartClick = this.onChartClick.bind(this);
    }
    componentDidMount() {
        document.title = '班级作业平均理解度统计';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var clazzId = searchArray[0].split('=')[1];
        var pushTime = searchArray[1].split('=')[1];
        this.getHomeWorkUnderstandAnalysisByClass(clazzId,pushTime);
        /*var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        this.getTeacherClasses(userId);
        if(searchArray.length >1 && searchArray[1].split('=')[0] == "clazzId"){
            var clazzId = searchArray[1].split('=')[1];
            var pushTime = searchArray[2].split('=')[1];
            this.getHomeWorkUnderstandAnalysisByClass(clazzId,pushTime);
        }*/
    }

    getHomeWorkUnderstandAnalysisByClass(clazzId,pushTime){
        var _this = this;
        var param = {
            "method": 'getHomeWorkUnderstandAnalysisByClass',
            "clazzId": clazzId,
            "pushTime": pushTime
        };
        this.setState({isLoading:true});
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var dataArray = result.response;
                // var stuIdArray = [];
                stuIdArray.splice(0);
                var columnarChartOption = _this.state.columnarChartOption;
                (columnarChartOption.xAxis)[0].data.splice(0);
                (columnarChartOption.series)[0].data.splice(0);
                // (columnarChartOption.series)[1].data.splice(0);
                if(dataArray!=null){
                    dataArray.forEach(function (analysisJsonStr) {
                        var analysisJson = JSON.parse(analysisJsonStr);
                        var stuId = analysisJson.stuId
                        var stuName = analysisJson.stuName;
                        var avgOfTimeLength =analysisJson.avgOfTimeLength;
                        var avgOfUnderstand =analysisJson.avgOfUnderstand;
                        stuIdArray.push(stuId);
                        console.log(stuId+"\t"+stuName+"\t"+avgOfTimeLength+"\t"+avgOfUnderstand);
                        (columnarChartOption.xAxis)[0].data.push(stuName);
                        (columnarChartOption.series)[0].data.push(Math.abs(parseInt(avgOfUnderstand)));
                        (columnarChartOption.series)[1].data.push(10);
                        // (columnarChartOption.series)[1].data.push(avgOfTimeLength.toFixed(2));
                    })
                    pushTimeGlobal = pushTime;
                    clazzIdGlobal = clazzId;
                    _this.setState({columnarChartOption,"isLoading":false});
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    initChartOption = () => {
        var _this = this;
        return {
            color: colors,
            title:{
                text:''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                left:'15%'
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                // data:['平均理解度','平均时长']
                data:['平均理解度']
            },
            dataZoom: [
                {
                    show: true,
                    //开始位置的百分比，0 - 100
                    start: 0,
                    //结束位置的百分比，0 - 100
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    // data: ['学生A','学生B','学生C','学生D','学生E','学生F','学生G','学生H','学生I','学生J','学生K','学生L'],
                    data: [],
                    //triggerEvent:true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '平均理解度',
                    min: 0,
                    max: 100,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },

                {
                    type: 'value',
                    name: '平均时长',
                    min: 0,
                    max: 100,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisTick:{
                        show:true
                    },
                    axisLabel: {
                        show:true,
                        formatter: '{value} 分钟'
                    }
                }
            ],
            series: [
                {
                    name:'平均理解度',
                    type:'bar',
                    showLabel:true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data:[],
                    itemStyle : { normal: {label : {show: true}}}
                },
                {
                    name:'平均时长',
                    type:'line',
                    showLabel:true,
                    yAxisIndex: 1,
                    //data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data:[],
                    itemStyle : { normal: {label : {show: true}}}
                }
            ]
        };
    };

    getLoadingOption = () => {
        return {
            text: '加载中...',
            color: '#4413c2',
            textColor: '#270240',
            maskColor: 'rgba(194, 88, 86, 0.3)',
            zlevel: 0
        };
    };

    onChartClick(optional){
        console.log("1111"+optional);
        var dataIndex = optional.dataIndex;
        // var stuIdArray = _this.state.stuIdArray;
        var stuId = stuIdArray[dataIndex];
        var analysisUrl = WebServiceUtil.mobileServiceURL+"homeWorkUnderstandAnalysisByStudent?studentId="+stuId+"&pushTime="+pushTimeGlobal+"&clazzId="+clazzIdGlobal+"&userId="+this.state.userId;
        // location.href = hrefUrl;
        var data = {
            method: 'openNewPage',
            url: analysisUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    analysisByClass(){
        // var d = this.state.date.getDate.toLocaleString();
        var da = new Date(this.state.date);
        var year = da.getFullYear();
        var month = parseInt(da.getMonth()+1)>9?da.getMonth()+1:"0"+(da.getMonth()+1);
        var date = parseInt(da.getDate())>9?da.getDate():"0"+da.getDate();
        var dayStr = [year,month,date].join('-');
        // console.log(this.state.clazzId+"==="+this.state.date+"======"+dayStr);
        //todo 调用接口，完成班级学生平均理解度和平均时长数据的获取
        this.getHomeWorkUnderstandAnalysisByClass(this.state.clazzId[0],dayStr);
    };

    getTeacherClasses(userId){
        var _this = this;
        var param = {
            "method": 'getTeacherClasses',
            "ident": userId
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                var classList = [];
                response.forEach(function (e) {
                    var classArray = e.split("#");
                    var classId = classArray[0];
                    var className = classArray[1];
                    var classJson = {label: className,value: classId,}
                    classList.push(classJson)
                });
                _this.setState({classList: classList,userId});
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    render() {
        let onEvents = {
            'click': this.onChartClick,
        };
        return (
            <div>
                {/*<div>班级平均理解度统计</div>*/}
                {/*<div>
                    <div>
                        <span>
                            <DatePicker
                                mode="date"
                                title="Select Date"
                                extra="Optional"
                                value={this.state.date}
                                onChange={date => this.setState({ date })}
                            >
                              <List.Item arrow="horizontal">发布日期</List.Item>
                            </DatePicker>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Picker data={this.state.classList} title="选择班级" extra="请选择(可选)" cols={1} value={this.state.clazzId} onChange={(v) => this.setState({ clazzId: v })}>
                                <CustomChildren>班级选择</CustomChildren>
                              </Picker>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Button onClick={this.analysisByClass}>分析</Button>
                        </span>
                    </div>
                </div>*/}
                <div id="homeWorkAnalysis">
                    <div>
                        <div style={{height:'400px'}} className="echarts_wrap">
                            <ReactEcharts
                                option={this.state.columnarChartOption}
                                style={{height: '100%', width: '100%'}}
                                // loadingOption={this.getLoadingOption()}
                                // showLoading={this.state.isLoading}
                                // onChartReady={this.onChartReady}
                                onEvents={onEvents}
                                className='' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}