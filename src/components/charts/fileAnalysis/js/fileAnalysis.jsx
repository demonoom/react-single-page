import React from 'react';
import ReactEcharts from 'echarts-for-react';
import '../css/fileAnalysis.less'

var colors = ['#5793f3', '#d14a61'];


export default class fileAnalysis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            divContentArray: ''
        };
    }

    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var aid = searchArray[0].split('=')[1];
        this.viewTopicEmotion(aid)
    }

    /**
     * 理解度
     * @returns {{color: [string,string], tooltip: {trigger: string, axisPointer: {type: string}}, grid: {left: string}, dataZoom: [null], xAxis: [null], yAxis: [null,null], series: [null,null]}}
     */
    understandResult = (category, barData, lineData) => {
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
                data: ['班级平均理解度', '理解度'],
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
                name: '班级平均理解度',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '理解度',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        show: true,
                        position: 'top',
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
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '班级平均理解度',
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
                name: '班级平均理解度',
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
    }

    /**
     * 耗时
     * @returns {{color: [string,string], tooltip: {trigger: string, axisPointer: {type: string}}, grid: {left: string}, dataZoom: [null], xAxis: [null], yAxis: [null,null], series: [null,null]}}
     */
    elapsedTimeResult = (category, barData, lineData) => {
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
                data: ['班级平均耗时', '耗时'],
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
                name: '班级平均耗时',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '耗时',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        show: true,
                        position: 'top',
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
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '班级平均耗时',
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
                name: '班级平均耗时',
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

    /**
     * 专注度
     * @returns {{color: [string,string], tooltip: {trigger: string, axisPointer: {type: string}}, grid: {left: string}, dataZoom: [null], xAxis: [null], yAxis: [null,null], series: [null,null]}}
     */
    attentionResult = (category, barData, lineData) => {
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
                data: ['班级平均专注度', '专注度'],
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
                name: '班级平均专注度',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '专注度',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        show: true,
                        position: 'top',
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
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: '班级平均专注度',
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
                name: '班级平均专注度',
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

    viewTopicEmotion(aid) {
        var _this = this;
        var param = {
            "method": 'viewTopicEmotion',
            "aid": aid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(result.response);
                    _this.buildSubjectDivContentArray(result.response)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 构建柱状图
     * @param data
     */
    buildSubjectDivContentArray(data) {
        var _this = this;
        var divContentArray = [];
        for (var k in data) {

            var columnarChartOption = null;
            var category = [];
            var lineData = [];
            var barData = [];

            //学生数组
            var stuJsonArray = data[k].studList;

            //平均值
            var avgUnder = parseInt((data[k].ave));

            stuJsonArray.forEach(function (stuJson) {
                if (k == 'understandResult') {
                    barData.push(parseInt(stuJson.understand));
                } else if (k == 'elapsedTimeResult') {
                    barData.push(parseInt(stuJson.elapsedTime));
                } else {
                    barData.push(parseInt(stuJson.attention));
                }
                category.push(stuJson.student.userName);
                lineData.push(avgUnder);
            });

            if (k == 'understandResult') {
                columnarChartOption = _this.understandResult(category, barData, lineData);
            } else if (k == 'elapsedTimeResult') {
                columnarChartOption = _this.elapsedTimeResult(category, barData, lineData);
            } else {
                columnarChartOption = _this.attentionResult(category, barData, lineData);
            }

            var subjectJsonDiv = <div>
                <div style={{height: '300px'}} className="echarts_wrap">
                    <ReactEcharts
                        option={columnarChartOption}
                        style={{height: '100%', width: '100%'}}
                        className=''/>
                </div>

            </div>;
            divContentArray.push(subjectJsonDiv);

        }
        this.setState({divContentArray});
    }

    render() {

        return (
            <div id="fileAnalysis" style={{height: document.body.clientHeight}}>
                {this.state.divContentArray}
            </div>
        );
    }
}
