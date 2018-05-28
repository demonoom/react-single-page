import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, Button, Picker
} from 'antd-mobile';
import './css/homeWorkAnalysis.less'

var colors = ['#5793f3', '#d14a61'];

var dottedBase = +new Date();


// 如果不是使用 List.Item 作为 children
const CustomChildren = (props) => {
    return (
        <div
            onClick={props.onClick}
            style={{backgroundColor: '#fff', height: 45, lineHeight: '45px', padding: '0 15px'}}
        >
            {props.children}
            <span style={{float: 'right'}}>{props.extra}</span>
        </div>
    );
};
export default class HomeWorkUnderstandAnalysisByClassSubject extends React.Component {

    constructor(props) {
        super(props);
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.state = {
            lastPoint: '0',
            currentFaceEmotion: {},
            screenHeight: screen.height,
            stuNameArray: [],
            avgOfTimeLengthArray: [],
            avgOfUnderstandArray: [],
            subjectContentArray: [],
            date: now,
            classList: [],
            clazzId: [],
            divDisplay: true,
        };
        this.analysisByClass = this.analysisByClass.bind(this);
        this.getTeacherClasses = this.getTeacherClasses.bind(this);
        this.getHomeWorkUnderstandAnalysisByClassSubject = this.getHomeWorkUnderstandAnalysisByClassSubject.bind(this);
    }

    componentDidMount() {
        console.log("1111HomeWorkUnderstandAnalysisByClassSubject");
        document.title = '学生作业表情分析报告';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        //todo 调用接口，完成班级学生平均理解度和平均时长数据的获取
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        // var userId = searchArray[0].split('=')[1];
        // this.getTeacherClasses(userId);
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var clazzId = searchArray[0].split('=')[1];
        var pushTime = searchArray[1].split('=')[1];
        var ident = searchArray[2].split('=')[1];
        var censusType = searchArray[3].split('=')[1];
        this.setState({ident, clazzId, pushTime, censusType});
        this.getHomeWorkUnderstandAnalysisByClassSubject(clazzId, pushTime, censusType);
    }

    getHomeWorkUnderstandAnalysisByClassSubject(clazzId, pushTime, censusType) {
        var _this = this;
        var param;
        if (censusType == 0) {
            this.setState({divDisplay: true});
            param = {
                "method": 'getHomeWorkUnderstandAnalysisByCLassSubject',
                "clazzId": clazzId,
                "pushTime": pushTime,
                "viewType": 0,
            };
        } else {
            this.setState({divDisplay: false});
            param = {
                "method": 'getHomeWorkUnderstandAnalysisByCLassSubject',
                "clazzId": clazzId,
                "pushTime": pushTime,
                "viewType": 1,
            };

        }

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var dataArray = result.response;
                var columnarChartOption = _this.state.columnarChartOption;
                var subjectDivContentArray = [];
                if (dataArray != null && dataArray.length != 0) {
                    dataArray.forEach(function (analysisJsonStr, index) {
                        var analysisJson = analysisJsonStr;
                        subjectDivContentArray = _this.buildSubjectArrayContent(subjectDivContentArray, analysisJson);
                    });
                    _this.buildSubjectDivContentArray(subjectDivContentArray, censusType);
                } else {

                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    buildSubjectArrayContent = (subjectDivContentArray, analysisJson) => {
        var _this = this;
        var stuJson = {
            "avgOfUnderstand": analysisJson.avgOfUnderstand,
            "avgOfTimeLength": analysisJson.avgOfTimeLength,
            "stuId": analysisJson.stuId,
            "stuName": analysisJson.stuName
        };
        var subjectJson = {"subjectId": analysisJson.subjectId, "subjectContent": analysisJson.subjectContent};
        var stuJsonArray = [stuJson];
        var dataJson = {subjectJson, stuJsonArray};
        if (subjectDivContentArray == null || subjectDivContentArray.length == 0) {
            subjectDivContentArray.push(dataJson);
        } else {
            var studentJsonArray = _this.hasSameSubjectId(subjectDivContentArray, analysisJson.subjectId);
            if (studentJsonArray == null) {
                studentJsonArray = [];
                studentJsonArray.push(stuJson);
                var newDataJson = {subjectJson, stuJsonArray};
                subjectDivContentArray.push(newDataJson);
            } else {
                studentJsonArray.push(stuJson);
            }
        }
        if (analysisJson.stuId == undefined) {
            for (var key in analysisJson) {
                for (var i = 0; i < subjectDivContentArray.length; i++) {
                    if (subjectDivContentArray[i].subjectJson.subjectId == key) {
                        subjectDivContentArray[i].avgUnder = analysisJson[key];
                    }
                }
            }
        }
        return subjectDivContentArray;
    };

    hasSameSubjectId = (subjectDivContentArray, subjectId) => {
        var isHave = false;
        for (var i = 0; i < subjectDivContentArray.length; i++) {
            var subjectDivContent = subjectDivContentArray[i];
            //题目编号
            var subjectIdAtDivContent = subjectDivContent.subjectJson.subjectId;
            if (subjectId == subjectIdAtDivContent) {
                isHave = true;
                return subjectDivContent.stuJsonArray;
                break;
            }
        }
        if (isHave == false) {
            return null;
        }
    };

    buildSubjectDivContentArray = (subjectDivContentArray, censusType) => {
        var _this = this;
        var divContentArray = [];
        this.setState({subjectDivContentArray});
        for (var index = 0; index < subjectDivContentArray.length - 1; index++) {
            //subjectDivContentArray.forEach(function (subjectAndStudentJson, index) {
            var subjectAndStudentJson = subjectDivContentArray[index];
            var subjectJson = subjectAndStudentJson.subjectJson;
            var stuJsonArray = subjectAndStudentJson.stuJsonArray;
            var subjectShowNo = "题目" + (parseInt(index) + 1);
            var columnarChartOption = null;
            var avgOfUnderstandTotal = 0;
            var avgOfTimeLengthTotal = 0;
            var numTotal = 0;
            var avgUnder = parseInt(subjectAndStudentJson.avgUnder.avg);
            // var avgUnder = parseInt(-5);
            var order=subjectAndStudentJson.avgUnder.order


            let onEvents = {
                'click': _this.onChartClick.bind(_this,index),
            };
            var category = [];
            var lineData = [];
            var barData = [];
            /*category.splice(0);
            barData.splice(0);
            lineData.splice(0);*/
            stuJsonArray.forEach(function (stuJson) {
                // (columnarChartOption.xAxis)[0].data.push(stuJson.stuName);
                avgOfUnderstandTotal += Math.abs(parseInt(stuJson.avgOfUnderstand));
                avgOfTimeLengthTotal += Math.abs(parseInt(stuJson.avgOfTimeLength));
                numTotal++;
                /*if (censusType == 0) {
                    (columnarChartOption.series)[0].data.push(Math.abs(parseInt(stuJson.avgOfUnderstand)));
                    (columnarChartOption.series)[1].data.push(avgUnder);
                } else {
                    (columnarChartOption.series)[0].data.push(Math.abs(parseInt(stuJson.avgOfUnderstand)));
                    (columnarChartOption.series)[1].data.push(avgUnder);
                }*/

                category.push(stuJson.stuName);
                barData.push(parseInt(stuJson.avgOfUnderstand));
                lineData.push(avgUnder);

                // (columnarChartOption.series)[1].data.push(Math.abs(parseInt(stuJson.avgOfTimeLength)));
                // (columnarChartOption.series)[1].data.push(stuJson.avgOfTimeLength.toFixed(2));
            });

            /*category.push("邹长亮");
            barData.push(parseInt(-20));
            lineData.push(avgUnder);*/

            if (censusType == 0) {
                columnarChartOption = _this.buildChartOption(category,barData,lineData);
            } else {
                columnarChartOption = _this.buildChartOption2(category,barData,lineData);
            }

            var subjectJsonDiv = <div>
                <div className="subject_title">{subjectShowNo}:</div>
                <div className="subject_content">
                    <article dangerouslySetInnerHTML={{__html: subjectJson.subjectContent}}></article>
                    <span
                        onClick={_this.averageUnderrstanding}
                        className="timeNum"
                    >
                        {_this.state.divDisplay ? '本题耗时排名:' : '本题难度排名:' }{order}
                        </span>
                </div>
                <div style={{height: '300px'}} className="echarts_wrap">
                    <ReactEcharts
                        option={columnarChartOption}
                        style={{height: '100%', width: '100%'}}
                        // loadingOption={this.getLoadingOption()}
                        // showLoading={true}
                        // onChartReady={this.onChartReady}
                        onEvents={onEvents}
                        className=''/>
                </div>
                <div className="text_chart">
                    {/* <span
                        style={{display: _this.state.divDisplay ? 'block' : 'none'}}>平均理解度:<i>{avgUnder}%</i></span><span
                    style={{display: _this.state.divDisplay ? 'none' : 'block'}}>平均做题时间:<i>{(avgOfTimeLengthTotal / numTotal).toFixed(0)}秒</i></span>*/}
                </div>

            </div>;
            divContentArray.push(subjectJsonDiv);
        }
        ;
        this.setState({divContentArray});
    };

    averageUnderrstanding = () => {
        var analysisUrl = WebServiceUtil.mobileServiceURL + "homeWorkUnderstandAnalysisByClassSubject?clazzId=" + this.state.clazzId + "&pushTime=" + this.state.pushTime + "&ident=" + this.state.ident + "&censusType=1" + "&queId=" + 1;

        /*var data = {
            method: 'openNewPage',
            url: analysisUrl,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = analysisUrl;
        });*/
        window.location.href = analysisUrl;
    };

    buildChartOption = (category,barData,lineData) => {
        var _this = this;
        return {
            backgroundColor: '#0f375f',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['平均理解度', '理解度'],
                textStyle: {
                    color: '#ccc'
                }
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
            xAxis: {
                data: category,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            yAxis: {
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            series: [{
                name: '平均理解度',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
                label:{
                    normal:{
                        show:true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '理解度',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        show:true,
                        position:'top',
                        barBorderRadius: 5,
                        color: (
                            0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#14c8d4'},
                                    {offset: 1, color: '#43eec6'}
                                ]
                        )
                    }
                },
                data: barData,
                label:{
                    normal:{
                        show:true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '平均理解度',
                type: 'bar',
                barGap: '-100%',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: (
                            0, 0, 0, 1,
                                [
                                    {offset: 0, color: 'rgba(20,200,212,0.5)'},
                                    {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
                                    {offset: 1, color: 'rgba(20,200,212,0)'}
                                ]
                        )
                    }
                },
                z: -12,
                data: lineData
            }, {
                name: '平均理解度',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                    normal: {
                        color: '#0f375f'
                    }
                },
                symbolRepeat: true,
                symbolSize: [12, 4],
                symbolMargin: 1,
                z: -10,
                data: lineData
            }]
        };
    };
    buildChartOption2 = (category,barData,lineData) => {
        var _this = this;
        return {
            backgroundColor: '#0f375f',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['做题时长', '班级平均时长'],
                textStyle: {
                    color: '#ccc'
                }
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
            xAxis: {
                data: category,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            yAxis: {
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            series: [{
                name: '班级平均时长',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
                label:{
                    normal:{
                        show:true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '做题时长',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: (
                            0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#14c8d4'},
                                    {offset: 1, color: '#43eec6'}
                                ]
                        )
                    }
                },
                data: barData,
                label:{
                    normal:{
                        show:true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '班级平均时长',
                type: 'bar',
                barGap: '-100%',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: (
                            0, 0, 0, 1,
                                [
                                    {offset: 0, color: 'rgba(20,200,212,0.5)'},
                                    {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
                                    {offset: 1, color: 'rgba(20,200,212,0)'}
                                ]
                        )
                    }
                },
                z: -12,
                data: lineData
            }, {
                name: '班级平均时长',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                    normal: {
                        color: '#0f375f'
                    }
                },
                symbolRepeat: true,
                symbolSize: [12, 4],
                symbolMargin: 1,
                z: -10,
                data: lineData
            }]
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

    onChartClick = (index,optional) => {
        var arr = this.state.subjectDivContentArray;
        var analysisUrl = WebServiceUtil.mobileServiceURL + "brotherXu?clazzId=" + this.state.clazzId + "&pushTime=" + this.state.pushTime + "&stuId=" + arr[index].stuJsonArray[optional.dataIndex].stuId + "&censusType=" + this.state.censusType;
        // var analysisUrl = WebServiceUtil.mobileServiceURL + "brotherXu?clazzId=" + this.state.clazzId + "&pushTime=" + this.state.pushTime + "&stuId=" + arr[0].stuJsonArray[optional.seriesIndex].stuId + "&censusType=" + this.state.censusType;

        var data = {
            method: 'openNewPage',
            url: analysisUrl,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = analysisUrl;
        });
    };

    formatTime(seconds) {
        return [
            parseInt(seconds / 60 / 60),
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
        ]
            .join(":")
            .replace(/\b(\d)\b/g, "0$1");
    };

    getTeacherClasses(ident) {
        var _this = this;
        var param = {
            "method": 'getTeacherClasses',
            "ident": ident
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                var classList = [];
                response.forEach(function (e) {
                    var classArray = e.split("#");
                    var classId = classArray[0];
                    var className = classArray[1];
                    var classJson = {label: className, value: classId,}
                    classList.push(classJson)
                });
                _this.setState({classList: classList});
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    };

    analysisByClass() {
        // var d = this.state.date.getDate.toLocaleString();
        var da = new Date(this.state.date);
        var year = da.getFullYear();
        var month = parseInt(da.getMonth() + 1) > 9 ? da.getMonth() + 1 : "0" + (da.getMonth() + 1);
        var date = parseInt(da.getDate()) > 9 ? da.getDate() : "0" + da.getDate();
        var dayStr = [year, month, date].join('-');
        //todo 调用接口，完成班级学生平均理解度和平均时长数据的获取
        this.getHomeWorkUnderstandAnalysisByClassSubject(this.state.clazzId[0], dayStr);
    };

    render() {
        var _this = this;
        let onEvents = {
            'click': this.onChartClick,
        }
        return (
            <div id="homeWorkAnalysis">
                {/*<div>学生题目理解度统计</div>*/}
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
                <div>
                    <div>
                        {/*<div style={{height:'400px'}}>
                         </div>*/}
                        {/*<span*/}
                        {/*className="timeNum"*/}
                        {/*onClick={_this.averageUnderstanding}*/}
                        {/*style={{display: this.state.divDisplay ? 'block' : 'none'}}*/}
                        {/*>*/}
                        {/*做题时间统计*/}
                        {/*</span>*/}
                        <div className="list_wrap_padding">
                            {this.state.divContentArray}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}