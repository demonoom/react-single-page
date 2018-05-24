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
    understandResult = () => {
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
                left: '15%'
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
                    triggerEvent: true
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
                        formatter: '{value} '
                    }
                },

                {
                    type: 'value',
                    name: '班级平均理解度',
                    min: 0,
                    max: 100,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value} %'
                    }
                }
            ],
            series: [
                {
                    name: '理解度',
                    type: 'bar',
                    showLabel: true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                },
                {
                    name: '班级平均理解度',
                    type: 'line',
                    yAxisIndex: 1,
                    // data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                }
            ]
        };
    };

    /**
     * 耗时
     * @returns {{color: [string,string], tooltip: {trigger: string, axisPointer: {type: string}}, grid: {left: string}, dataZoom: [null], xAxis: [null], yAxis: [null,null], series: [null,null]}}
     */
    elapsedTimeResult = () => {
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
                left: '15%'
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
                    triggerEvent: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '耗时',
                    min: 0,
                    // max: 100,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} 秒'
                    }
                },

                {
                    type: 'value',
                    name: '班级平均耗时',
                    min: 0,
                    //max: 20,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value} 秒'
                    }
                }
            ],
            series: [
                {
                    name: '耗时',
                    type: 'bar',
                    showLabel: true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                },
                {
                    name: '班级平均耗时',
                    type: 'line',
                    yAxisIndex: 1,
                    // data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                }
            ]
        };
    };

    /**
     * 专注度
     * @returns {{color: [string,string], tooltip: {trigger: string, axisPointer: {type: string}}, grid: {left: string}, dataZoom: [null], xAxis: [null], yAxis: [null,null], series: [null,null]}}
     */
    attentionResult = () => {
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
                left: '15%'
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
                    triggerEvent: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '专注度',
                    min: 0,
                    // max: 100,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                },

                {
                    type: 'value',
                    name: '班级平均专注度',
                    min: 0,
                    //max: 20,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value} 秒'
                    }
                }
            ],
            series: [
                {
                    name: '专注度',
                    type: 'bar',
                    showLabel: true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                },
                {
                    name: '班级平均专注度',
                    type: 'line',
                    yAxisIndex: 1,
                    // data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                }
            ]
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
    buildSubjectDivContentArray(data, censusType) {
        var _this = this;
        var divContentArray = [];
        for (var k in data) {

            var columnarChartOption = null;

            if (k == 'understandResult') {
                columnarChartOption = _this.understandResult();
            } else if (k == 'elapsedTimeResult') {
                columnarChartOption = _this.elapsedTimeResult();
            } else {
                columnarChartOption = _this.attentionResult();
            }

            //学生数组
            var stuJsonArray = data[k].studList;

            //平均值
            var avgUnder = parseInt(Math.abs(data[k].ave));

            stuJsonArray.forEach(function (stuJson) {
                if (k == 'understandResult') {
                    (columnarChartOption.series)[0].data.push(Math.abs(parseInt(stuJson.understand)));
                } else if (k == 'elapsedTimeResult') {
                    (columnarChartOption.series)[0].data.push(Math.abs(parseInt(stuJson.elapsedTime)));
                } else {
                    (columnarChartOption.series)[0].data.push(Math.abs(parseInt(stuJson.attention)));
                }
                (columnarChartOption.xAxis)[0].data.push(stuJson.student.userName);
                (columnarChartOption.series)[1].data.push(avgUnder);

            });

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
