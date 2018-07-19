import React from "react";
import { Tabs, List, Switch } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import { Sticky } from 'react-sticky';
import { createForm } from 'rc-form';
import '../css/healthDetail.less'
function renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
var str = <span className="month">月</span>;
var wOrM = "month";
var date = Date.parse(new Date());
var cccalm;
export default class healthDetail extends React.Component {
    constructor(props) {
        super(props);
        cccalm = this;
        this.state = {
            stepChartDiv: [],
            heartChartDiv:[],
            clickDate:Date.parse(new Date()),
            highHeart:[],
            flag:true,
            clientHeight: document.body.clientHeight,
        }

    }
    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '健康数据';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var name = decodeURI(locationSearch.split("&")[2].split("=")[1]);
        var macAddress = locationSearch.split("&")[3].split("=")[1];
        this.setState({ "uid": uid,name,macAddress });
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', this.onWindowResize);
        this.getDashBoardDataByArea(uid, wOrM);
        this.getOldManBraceletHeartRateByOpenId(uid,date)
        this.getOldManBraceletHighHeartRateListByOpenId(uid);
    }

    /**
     *  点击获取checked值
     */
    saveChecked() {
        if (cccalm.state.flag) {
            str = <span className="month">月</span>;
            wOrM = "month";
            cccalm.setState({
                flag:false
            })
            cccalm.getDashBoardDataByArea(cccalm.state.uid, wOrM)
        } else {
            str = <span className="week">周</span>;
            wOrM = "week";
            cccalm.setState({
                flag:true
            })
            cccalm.getDashBoardDataByArea(cccalm.state.uid, wOrM)
        }
    }

    /**
     * 获取步数数据
     */
    getDashBoardDataByArea(uid, wOrM) {
        var _this = this;
        var param;
        param = {
            "method": 'getOldManBraceletSportStepByOpenId',
            "openId": uid,
            "dataType": wOrM
        };
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                _this.setState({
                    todatSteps: result.response[0].sportStep
                })
                _this.buildStepBarChart(response);
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    /**
     * 步数情况统计
     * @param braceletSportSteps
     */
    buildStepBarChart = (braceletSportSteps) => {
        var _this = this;
        var xClazzNameArray = [];
        var seriesDataArray = [];
        braceletSportSteps.forEach(function (braceletSportStepObj) {
            var sportTime = cccalm.state.flag ?WebServiceUtil.formatYM(braceletSportStepObj.sportTime) : WebServiceUtil.formatMD(braceletSportStepObj.sportTime);
            var sportStep = braceletSportStepObj.sportStep;
            xClazzNameArray.push(sportTime);
            seriesDataArray.push(sportStep);
        });
        var stepOption = _this.buildStepOption(xClazzNameArray, seriesDataArray)
        var stepChartDiv = <div>
            <div style={{ width: '100%', height: '270px' }} className="echarts_wrap">
                <ReactEcharts
                    option={stepOption}
                    style={{ height: '100%', width: '100%' }}
                    theme='macarons'
                    className='' />
            </div>
        </div>;
        _this.setState({ stepChartDiv });
    }

    /**
   * 创建步数统计柱形图的option
   */
    buildStepOption = (xClazzNameArray, seriesDataArray) => {
        return {

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['步数1'],
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
                    axisLabel: {
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 0,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
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
                    name: '步数2',
                    type: 'bar',
                    data: seriesDataArray,
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // },
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: function (params) {
                                var colorList = ['#00a8ff', '#00fdd8'];
                                if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                    return colorList[0];//1,3,5,7
                                } else {
                                    return colorList[1];//2,4,6,8
                                }

                            }
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




    /**
     * 获取心率数据
     */
    getOldManBraceletHeartRateByOpenId(uid,date) {
        var _this = this;
        var param;
        param = {
            "method": 'getOldManBraceletHeartRateByOpenId',
            "openId": uid,
            "heartDate": WebServiceUtil.formatYMD(date)
        };
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
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
        braceletHeartSteps.forEach(function (braceletHeartStepObj) {
            var heartTime = braceletHeartStepObj.heartTime;
            var heartRate = braceletHeartStepObj.heartRate;
            xClazzNameArray.push(WebServiceUtil.formatHM(heartTime));
            seriesDataArray.push(heartRate);
        });
        var stepOption = _this.buildHeartOption(xClazzNameArray, seriesDataArray)
        var heartChartDiv = <div>
            <div style={{ width: '100%', height: '270px' }} className="echarts_wrap">
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
            trigger: 'axis'
        },
        legend: {
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
                axisLabel: {
                    //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                    rotate: 0,
                    //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
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
                data: seriesDataArray,
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 90
                    }]
                },
                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            var colorList = ['#00a8ff', '#00fdd8'];
                            if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                return colorList[0];//1,3,5,7
                            } else {
                                return colorList[1];//2,4,6,8
                            }

                        }
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


    /**
     * 获取高心率数据
     */
    getOldManBraceletHighHeartRateListByOpenId(uid) {
        var param;
        param = {
            "method": 'getOldManBraceletHighHeartRateListByOpenId',
            "openId": uid,
            "pageNo":-1
        };
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                var arr = [
                    <div><span>时间</span>
                    <span>心律值</span></div>
                ];
                response.forEach((v,i)=>{
                        var item = <div>
                            <span>{WebServiceUtil.formatAllTime(v.heartTime)}</span>
                            <span>{v.heartRate}</span>
                        </div>
                    
                    arr.push(item)
                })

                cccalm.setState({
                    highHeart:arr
                })
               
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 前一天
     */
    toYesterday(){
        var yesterday = cccalm.state.clickDate -86400000;
        cccalm.setState({
            clickDate:yesterday
        })
        console.log(WebServiceUtil.formatYMD(yesterday))
        cccalm.getOldManBraceletHeartRateByOpenId(cccalm.state.uid,yesterday)
    }


    /**
     * 后一天
     */
    toTomorray(){
        var tomorray = cccalm.state.clickDate + 86400000;
        cccalm.setState({
            clickDate:tomorray
        })
        cccalm.getOldManBraceletHeartRateByOpenId(cccalm.state.uid,tomorray)
    }
    render() {
        let SwitchExample = (props) => {
            const { getFieldProps } = props.form;
            return (
                <div className="switchBtn"><List.Item
                    extra={<Switch
                        {...getFieldProps('Switch1', {
                            initialValue: cccalm.state.flag,
                            checked:cccalm.state.flag,
                            valuePropName: 'checked',
                        })}
                        name="123"
                        onClick={cccalm.saveChecked}
                    />}
                ></List.Item>
                    {str}</div>
            );
        };
        SwitchExample = createForm()(SwitchExample);
        return (


            <div id="healthDetail" style={{ height: this.state.clientHeight }}>
                <div className="my_flex">
                    <div className="titleItem textOver">
                        <span className="title">手环名称：</span>
                        <span>{cccalm.state.name}</span>
                    </div>
                    <div className="titleItem textOver">
                        <span className="title">手环ID：</span>
                        <span>{cccalm.state.macAddress}</span>
                    </div>
                </div>


                <div className="step chartItem">
                <span>今日步数：{this.state.todatSteps}</span>
                    <SwitchExample />
                    {this.state.stepChartDiv}
                </div>

                <div className="heartRate chartItem">
                <span onClick={this.toYesterday}>前一天</span>
                    <div>心率统计<span>{WebServiceUtil.formatMD(Date.parse(new Date()))}</span></div>
                    {
                        cccalm.state.clickDate === date ? "":<span onClick={this.toTomorray}>后一天</span>
                    }
                    
                    {this.state.heartChartDiv}
               </div>
                <div className="unusualHeartRate chartItem">
                    <div className="title">
                        <span>时间</span>
                        <span>异常心率</span>
                        {cccalm.state.highHeart}

                    </div>
               </div>
            </div>
        )
    }
}