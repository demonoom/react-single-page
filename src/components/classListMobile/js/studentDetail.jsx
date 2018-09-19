import React from "react";
import ReactEcharts from 'echarts-for-react';
import "../css/studentDetail.less";
var calm;
export default class studentDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            studentDetailData: [],
            heartChartDiv: [],
            heartRateSum:"",
            arr:[],
            heartCount:1
        }
    }
    componentDidMount() {
        document.title = "手环检测统计列表"
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var stuName = locationSearchArray[0].split("=")[1];
        var uid = locationSearchArray[1].split("=")[1];
        var rate = locationSearchArray[2].split("=")[1];
        var step = locationSearchArray[3].split("=")[1];
        calm.setState({
            rate,
            step
        })
        document.title = stuName + "手环数据统计"
        calm.getBraceletHeartRateAnalysisByUserId(uid)
    }



    /**
     * 获取心率数据
     */
    getBraceletHeartRateAnalysisByUserId(userId) {
        var _this = this;
        var param;
        param = {
            "method": 'getBraceletHeartRateAnalysisByUserId',
            "userId": userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result)
                var response = result.response;
                var arr = Object.keys(response);
                calm.setState({
                    heartCount:arr.length,
                    arr:arr
                })
                _this.buildHeartBarChart(response);
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    /**
    * 心率情况统计
    * @param braceletSportSteps
    */
    buildHeartBarChart = (braceletHeartSteps) => {
        var _this = this;
        var xClazzNameArray = [];
        var seriesDataArray = [];
        for (var key in braceletHeartSteps) {
            console.log(braceletHeartSteps[key])
            var braceletHeartStepObj = braceletHeartSteps[key];
            console.log(braceletHeartStepObj.heartRate)
            var heartTime = key;
            var heartRate = braceletHeartStepObj.heartRate;
            xClazzNameArray.push(WebServiceUtil.formatHM(heartTime));
            seriesDataArray.push(heartRate);
        }
        // braceletHeartSteps.forEach(function (braceletHeartStepObj) {

        // });
        var stepOption = _this.buildHeartOption(xClazzNameArray, seriesDataArray)
        var heartChartDiv = <div>
            <div style={{ width: '100%', height: '314px' }} className="echarts_wrap">
                <ReactEcharts
                    option={stepOption}
                    style={{ height: '100%', width: '100%' }}
                    theme='macarons'
                    className='' />
            </div>
        </div>;
        _this.setState({ heartChartDiv });
    }


    /**
  * 创建心率折线图的option
  */
    buildHeartOption = (xClazzNameArray, seriesDataArray) => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {          // 直线指示器样式设置
                        color: '#638BB7',
                        width: 1,
                        type: 'solid'
                    },
                },
            },
            grid: {
                left: '10',
                right: '20',
                bottom: '24',
                top:30,
                containLabel: true
            },
            legend: {
                show: false,
                data: ['心率'],
                bottom: 0,
                right: '5',
            },
            // toolbox: {
            //     left: 'center',
            //     feature: {
            //         dataZoom: {
            //             yAxisIndex: 'none'
            //         },
            //         restore: {},
            //         saveAsImage: {}
            //     }
            // },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: xClazzNameArray,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#C9C9C9',
                            width: 1,
                            type: 'solid'
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666',
                            fontSize: 12
                        },
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 0,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 'auto',
                    },
                }
            ],

            yAxis: [
                {
                    type: 'value',
                    // min: 40,
                    // max: 120,
                    show: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#C9C9C9',
                            width: 1,
                            type: 'solid'
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666',
                            fontSize: 12
                        },
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 0,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 'auto',
                    },
                }

            ],
            // toolbox: {
            //     left: 'right',
            //     feature: {
            //         dataZoom: {
            //             yAxisIndex: 'none'
            //         },
            //         restore: {},
            //         saveAsImage: {}
            //     }
            // },
            series: [
                {
                    name: '心率',
                    type: 'line',
                    smooth: true,
                    data: seriesDataArray,
                    left: 0,
                    bottom: 0,
                    symbolSize: 6,
                    markLine: {
                        silent: true,
                        // data: [{
                        //     yAxis: 90
                        // }]
                    },
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: '#2B84EF',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                        }
                    }
                }
            ]
        };
    }

    render() {
        var result = 0;
        calm.state.arr.forEach((v,i)=>{
            result += v-0;
        })
        return (
            <div id="studentDetail">
                <div>
                    <span>平均心率</span>
                    <span>实时心率</span>
                    <span>今日步数</span>
                </div>
                <div>
                    <span>{result/ calm.state.heartCount}</span>
                    <span>{calm.state.rate}</span>
                    <span>{calm.state.step}</span>
                </div>
                <div className="title">心率折线图</div>
                <div className="student-echarts">
                    <span className="Heart-rate">心率</span>
                    <span className="Heart-time">时间</span>
                    {this.state.heartChartDiv}
                </div>
            </div>
        )
    }
}