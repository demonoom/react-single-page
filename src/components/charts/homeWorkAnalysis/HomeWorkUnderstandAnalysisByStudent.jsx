import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast
} from 'antd-mobile';
var colors = ['#5793f3', '#d14a61'];
var returnUrl;
export default class HomeWorkUnderstandAnalysisByStudent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columnarChartOption: this.initChartOption(),
            lastPoint: '0',
            currentFaceEmotion:{},
            screenHeight:screen.height,
            stuNameArray:[],
            avgOfTimeLengthArray:[],
            avgOfUnderstandArray : [],
            subjectContentArray:[],
    };
    }

    componentDidMount() {
        document.title = '学生作业题目理解度/时长统计';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        //todo 调用接口，完成班级学生平均理解度和平均时长数据的获取
        this.getHomeWorkUnderstandAnalysisByStudent();
    }

    getHomeWorkUnderstandAnalysisByStudent(){
        var _this = this;
        var subjectContentArray=[];
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var studentId = searchArray[0].split('=')[1];
        var pushTime = searchArray[1].split('=')[1];
        var clazzId = searchArray[2].split('=')[1];
        returnUrl = "http://localhost:8091/#/homeWorkUnderstandAnalysisByClass?clazzId="+clazzId+"&pushTime="+pushTime;
        // var studentId = "23837";
        // var pushTime = "2018-04-13";
        var param = {
            "method": 'getHomeWorkUnderstandAnalysisByStudent',
            "studentId": studentId,
            "pushTime": pushTime
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var dataArray = result.response;
                var columnarChartOption = _this.state.columnarChartOption;
                if(dataArray!=null){
                    dataArray.forEach(function (analysisJsonStr,index) {
                        var analysisJson = JSON.parse(analysisJsonStr);
                        var subjectId = analysisJson.subjectId
                        var subjectContent = analysisJson.subjectContent;
                        var subjectType = analysisJson.subjectType;
                        var avgOfTimeLength =analysisJson.avgOfTimeLength;
                        var avgOfUnderstand =analysisJson.avgOfUnderstand;
                        console.log(subjectId+"\t"+subjectType+"\t"+avgOfTimeLength+"\t"+avgOfUnderstand);
                        var subjectShowNo = "题目"+(parseInt(index)+1);
                        (columnarChartOption.xAxis)[0].data.push(subjectShowNo);
                        (columnarChartOption.series)[0].data.push(parseInt(avgOfUnderstand));
                        // (columnarChartOption.series)[1].data.push(avgOfTimeLength.toFixed(2));

                        var subjectContent = <tr>
                            <td>{subjectShowNo}</td>
                            <td>{subjectType}</td>
                            <td><article dangerouslySetInnerHTML={{__html: subjectContent}}></article></td>
                        </tr>;
                        _this.state.subjectContentArray.push(subjectContent);
                    })
                    _this.setState(columnarChartOption,subjectContentArray,returnUrl);
                }else{
                    (columnarChartOption.xAxis)[0].data.splice(0);
                    (columnarChartOption.series)[0].data.splice(0);
                    // (columnarChartOption.series)[1].data.splice(0);
                    _this.state.subjectContentArray.splice(0);
                    _this.setState(columnarChartOption,subjectContentArray,returnUrl);
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

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                right: '20%'
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                // data:['理解度','时长']
                data:['理解度']
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
                    // triggerEvent:true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '理解度',
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

                /*{
                    type: 'value',
                    name: '时长',
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
                }*/
            ],
            series: [
                {
                    name:'理解度',
                    type:'bar',
                    showLabel:true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data:[],
                    itemStyle : { normal: {label : {show: true}}}
                },
                /*{
                    name:'时长',
                    type:'line',
                    yAxisIndex: 1,
                    // data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data:[],
                    itemStyle : { normal: {label : {show: true}}}
                }*/
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

    render() {
        let onEvents = {
            'click': this.onChartClick,
        }
        return (
            <div>
                <div>
                    <a href={returnUrl}>返回</a>
                </div>
                <div>学生题目理解度统计</div>
                <div>
                    <div>
                        <div style={{height:'400px'}}>
                            <ReactEcharts
                                option={this.state.columnarChartOption}
                                style={{height: '100%', width: '100%'}}
                                // loadingOption={this.getLoadingOption()}
                                // showLoading={true}
                                // onChartReady={this.onChartReady}
                                onEvents={onEvents}
                                className='' />
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            题号
                                        </td>
                                        <td>
                                            类型
                                        </td>
                                        <td>
                                            内容
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.subjectContentArray}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}