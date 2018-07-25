import React from "react";
import ReactEcharts from 'echarts-for-react';
var calm;
export default class emotionAnalysisReport extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            initData: {},
            faceChartDiv: [],
            faceByPeosonChartDiv: [],
            understandScore: []
        }
    }

    componentDidMount() {
        this.getVirtualClassByVid();
        this.getHardUnderstandStudnetClassFaceEmotionByVid();
        var type = 2;
        calm.setState({
            type
        })
        if (type == 1) {
            this.getFaceEmotionVclassHistoryAnalysis();
            this.getClassFaceEmotionByVidLineChart();
            this.getStudentUnderstandTopVid();

           

        } else if (type == 2) {
            this.getHardUnderstandStudnetFaceEmotionByVid();
            this.getClassStudnetFaceEmotionByVidLineChart();
        }




    }

    /**
     * 获取课堂信息
     */
    getVirtualClassByVid() {
        var param = {
            "method": "getVirtualClassByVid",
            "vid": "1111"
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "ketang")
                calm.setState({
                    // tName:,
                    // courseName:result.response.cname,
                    // className:result,response.clazzName,
                    // date:result.response.colStartTimePrettyFormat,
                })

            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 表情分析图
     */
    getFaceEmotionVclassHistoryAnalysis() {
        var param = {
            "method": "getFaceEmotionVclassHistoryAnalysis",
            "vid": "1111"
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result)
                if (result.msg == '调用成功' || result.success == true) {
                    calm.setState({
                        autonomousLearn: result.response.autonomousLearn,
                        avgUnderstand: result.response.avgUnderstand,
                        classJoy: result.response.classJoy,
                        effectiveTeaching: result.response.effectiveTeaching,
                        guidedLearning: result.response.guidedLearning,
                        heavyDifficultPoints: result.response.heavyDifficultPoints,
                        highUnderstand: result.response.highUnderstand,
                        learnDiversify: result.response.learnDiversify,
                        totalScore: (result.response.avgUnderstand + result.response.highUnderstand) * 0.2 + (result.response.guidedLearning + result.response.heavyDifficultPoints + result.response.classJoy + result.response.learnDiversify + result.response.effectiveTeaching + result.response.autonomousLearn) * 0.1
                    })
                }


            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }



    /**
     * 获取表情数据折线图
     */
    getClassFaceEmotionByVidLineChart() {
        var _this = this;
        var param = {
            "method": "getClassFaceEmotionByVidLineChart",
            "vid": "1111"
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result)
                var response = result.response;
                _this.buildFaceLineChart(response);
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    /**
    * 情况统计
    * @param braceletSportSteps
    */
    buildFaceLineChart = (braceletHeartSteps) => {
        var _this = this;
        var xClazzNameArray = [];

        var AttentionArr = [];
        var ConfuseArr = [];
        var ThinkArr = [];
        var JoyArr = [];
        var UnderstandArr = [];
        var SupersizeArr = [];

        braceletHeartSteps.forEach(function (braceletHeartStepObj) {
            var second = braceletHeartStepObj.second;
            xClazzNameArray.push(WebServiceUtil.formatHM(second));

            var attention = braceletHeartStepObj.attention;
            AttentionArr.push(attention.toFixed(2));
            var confuse = braceletHeartStepObj.confuse;
            ConfuseArr.push(confuse.toFixed(2));
            var thinking = braceletHeartStepObj.thinking;
            ThinkArr.push(thinking.toFixed(2));
            var joy = braceletHeartStepObj.joy;
            JoyArr.push(joy.toFixed(2));
            var understand = braceletHeartStepObj.understand;
            UnderstandArr.push(understand.toFixed(2));
            var surprise = braceletHeartStepObj.surprise;
            SupersizeArr.push(surprise.toFixed(2));
        });
        var stepOption = _this.buildFaceOption(xClazzNameArray, AttentionArr, ConfuseArr, ThinkArr, JoyArr, UnderstandArr, SupersizeArr)
        var faceChartDiv = <div>
            <div style={{ width: '100%', height: '170px' }} className="echarts_wrap">
                <ReactEcharts
                    option={stepOption}
                    style={{ height: '100%', width: '100%' }}
                    theme='macarons'
                    className='' />
            </div>
        </div>;
        _this.setState({ faceChartDiv });
    }


    /**
  * 创建折线图的option
  */
    buildFaceOption = (xClazzNameArray, AttentionArr, ConfuseArr, ThinkArr, JoyArr, UnderstandArr, SupersizeArr) => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {          // 直线指示器样式设置
                        color: '#FFE298',
                        width: 1,
                        type: 'solid'
                    },
                },
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
                            color: '#F8E71C',
                            width: 1,
                            type: 'solid'
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                            fontSize: 38
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
                    show: false
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
                    data: AttentionArr,
                    left: 0,
                    bottom: 0,
                    symbolSize: 6,
                    // markLine: {
                    //     silent: true,
                    //     data: [{
                    //         yAxis: 90
                    //     }]
                    // },
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: '#FFE298'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                        }
                    }
                },
                {
                    name: '邮件营销',
                    type: 'line',
                    stack: '总量',
                    data: ConfuseArr
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    stack: '总量',
                    data: ThinkArr
                },
                {
                    name: '视频广告',
                    type: 'line',
                    stack: '总量',
                    data: JoyArr
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    data: UnderstandArr
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    data: SupersizeArr
                },
            ]
        };
    }



    /**
     * 本节课程难点
     */
    getHardUnderstandStudnetClassFaceEmotionByVid() {
        var param = {
            "method": "getHardUnderstandStudnetClassFaceEmotionByVid",
            "vid": "1111"
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = [<div>
                        <span>课件位置</span>
                        <span>理解度低于80%的学生</span>
                        {/* <span>时间</span> */}
                    </div>

                    ];
                    result.response.forEach((v, i) => {
                        console.log(v.users,"calm")
                        var tempStr = "";
                        var classStr = "";
                        v.users.forEach(function (item, index) {
                            tempStr = "";
                            tempStr += item.user.userName;
                            classStr += "," + tempStr
                            calm.setState({
                                theOwn: classStr.slice(1)
                            })
                        })
                        arr.push(
                            <div>
                                <span>{v.faceEmotionClassFile.file.name}第{v.faceEmotionClassFile.filePage}页</span>
                                <span>{v.users.map((v, i) => {
                                     var stuName = "";
                                     stuName += v;
                                    return (
                                        <div>
                                            <span>
                                                {calm.state.theOwn}
                                            </span>
                                        </div>
                                    )
                                    console.log(v, "ccc")
                                })}</span>
                                {/* <span>{}</span> */}
                            </div>
                        )

                    })
                    calm.setState({
                        diffPointDiv: arr
                    })

                }


            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 学生理解度排名
     */
    getStudentUnderstandTopVid() {
        var param = {
            "method": "getStudentUnderstandTopVid",
            "vid": "1111"
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = [<div>
                        <span>学生</span>
                        <span>理解度</span>
                    </div>

                    ];
                    result.response.forEach((v, i) => {
                        arr.push(
                            <div>
                                <span>{v.user.userName}</span>
                                <span>{v.understand}%</span>
                            </div>
                        )

                    })
                    calm.setState({
                        understandDiv: arr
                    })
                }


            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    /**
     * 学生
     * 自己本节课中的难点
     */
    getHardUnderstandStudnetFaceEmotionByVid() {
        var param = {
            "method": "getHardUnderstandStudnetFaceEmotionByVid",
            "vid": "35211",
            "userId": 23993,
        }


        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "学生本节课的难点")
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = [<div>
                        <span>课件位置</span>
                        <span>理解度</span>
                    </div>

                    ];
                    result.response.forEach((v, i) => {
                        arr.push(
                            <div>
                                <span>{v.faceEmotionClassFile.file.name}第{v.faceEmotionClassFile.filePage}页</span>
                                <span>{v.understand}%</span>
                            </div>
                        )

                    })
                    calm.setState({
                        underPersonDiv: arr,
                    })
                }


            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    /**
     * 单人课堂表情折线图
     */

    getClassStudnetFaceEmotionByVidLineChart() {
        var _this = this;
        var param = {
            "method": "getClassStudnetFaceEmotionByVidLineChart",
            "vid": "35211",
            "userId": 23993,
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "yu")
                var response = result.response;


                var arr = [];
                result.response.forEach((v, i) => {
                    arr.push(v.understand)
                })

                calm.setState({
                    understandScore: arr
                })
                _this.buildFaceByPeosonLineChart(response);
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    /**
     * 情况统计
     * @param braceletSportSteps
     */
    buildFaceByPeosonLineChart = (braceletHeartSteps) => {
        var _this = this;
        var xClazzNameArray = [];

        var AttentionArr = [];
        var ConfuseArr = [];
        var ThinkArr = [];
        var JoyArr = [];
        var UnderstandArr = [];
        var SupersizeArr = [];

        braceletHeartSteps.forEach(function (braceletHeartStepObj) {
            var second = braceletHeartStepObj.second;
            xClazzNameArray.push(WebServiceUtil.formatHM(second));

            var attention = braceletHeartStepObj.attention;
            AttentionArr.push(attention.toFixed(2));
            var confuse = braceletHeartStepObj.confuse;
            ConfuseArr.push(confuse.toFixed(2));
            var thinking = braceletHeartStepObj.thinking;
            ThinkArr.push(thinking.toFixed(2));
            var joy = braceletHeartStepObj.joy;
            JoyArr.push(joy.toFixed(2));
            var understand = braceletHeartStepObj.understand;
            UnderstandArr.push(understand.toFixed(2));
            var surprise = braceletHeartStepObj.surprise;
            SupersizeArr.push(surprise.toFixed(2));

        });
        var stepOption = _this.buildFaceByPersonOption(xClazzNameArray, AttentionArr, ConfuseArr, ThinkArr, JoyArr, UnderstandArr, SupersizeArr)
        var faceByPeosonChartDiv = <div>
            <div style={{ width: '100%', height: '170px' }} className="echarts_wrap">
                <ReactEcharts
                    option={stepOption}
                    style={{ height: '100%', width: '100%' }}
                    theme='macarons'
                    className='' />
            </div>
        </div>;
        _this.setState({ faceByPeosonChartDiv });
    }


    /**
  * 创建折线图的option
  */
    buildFaceByPersonOption = (xClazzNameArray, AttentionArr, ConfuseArr, ThinkArr, JoyArr, UnderstandArr, SupersizeArr) => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {          // 直线指示器样式设置
                        color: '#FFE298',
                        width: 1,
                        type: 'solid'
                    },
                },
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
                            color: '#F8E71C',
                            width: 1,
                            type: 'solid'
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                            fontSize: 38
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
                    show: false
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
                    data: AttentionArr,
                    left: 0,
                    bottom: 0,
                    symbolSize: 6,
                    // markLine: {
                    //     silent: true,
                    //     data: [{
                    //         yAxis: 90
                    //     }]
                    // },
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: '#FFE298'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                        }
                    }
                },
                {
                    name: '邮件营销',
                    type: 'line',
                    stack: '总量',
                    data: ConfuseArr
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    stack: '总量',
                    data: ThinkArr
                },
                {
                    name: '视频广告',
                    type: 'line',
                    stack: '总量',
                    data: JoyArr
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    data: UnderstandArr
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    data: SupersizeArr
                },
            ]
        };
    }

    render() {
        var sum = 0;
        calm.state.understandScore.forEach((v, i) => {
            sum += v - 0;
        })
        var svgUnder = sum / calm.state.understandScore.length;
        console.log(svgUnder,"has")

        return (
            <div>
                <div>
                    <span>教师：xxx</span>
                    <span>课程：xxx</span>
                    <span>班级：xxx</span>
                    <span>日期：xxx</span>
                </div>

                {
                    calm.state.type == 1 ?
                        <div>
                            <div>
                                {/* <span>
                        课堂综合评价{calm.state.totalScore}
                    </span> */}
                                <span>自主学习度{calm.state.autonomousLearn}</span>
                                <span>课堂平均理解度{calm.state.avgUnderstand}</span>
                                <span>课堂愉悦度{calm.state.classJoy}</span>
                                <span>有效教学时间{calm.state.effectiveTeaching}</span>
                                <span>引导性学习{calm.state.guidedLearning}</span>
                                <span>重难点分配度{calm.state.heavyDifficultPoints}</span>
                                <span>高校理解比例{calm.state.highUnderstand}</span>
                                <span>教学方式多样性{calm.state.learnDiversify}</span>
                            </div>
                            <div>
                                {calm.state.faceChartDiv}
                            </div>
                            <div>
                                <h3>学生理解度排名</h3>
                                {calm.state.understandDiv}
                            </div>
                        </div>
                        :
                        <div>
                            <div>
                                <h3>学生理解度综合评价</h3>
                                {svgUnder.toFixed(2)}%
                    {calm.state.faceByPeosonChartDiv}
                            </div>
                            <div>
                                <h3>自己的本节课程难点</h3>
                                {calm.state.underPersonDiv}
                            </div>
                        </div>
                }


                <h3>本节课程难点</h3>
                {calm.state.diffPointDiv}
            </div>
        )
    }
}