import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {DatePicker, WhiteSpace, Button, Toast} from 'antd-mobile'
import '../css/studentMovement.less'

// var columnarChartOption = {
//
//     tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             type: 'cross',
//             label: {
//                 backgroundColor: '#6a7985'
//             }
//         }
//     },
//     legend: {
//         data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
//     },
//     toolbox: {
//         feature: {
//             saveAsImage: {}
//         }
//     },
//     grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//     },
//     xAxis: [
//         {
//             type: 'category',
//             boundaryGap: false,
//             data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
//         }
//     ],
//     yAxis: [
//         {
//             type: 'value'
//         }
//     ],
//     series: [
//         {
//             name: '邮件营销',
//             type: 'line',
//             areaStyle: {normal: {}},
//             data: [120, 132, 101, 134, 90, 230, 210]
//         },
//         {
//             name: '联盟广告',
//             type: 'line',
//             areaStyle: {normal: {}},
//             data: [220, 182, 191, 234, 290, 330, 310]
//         },
//         {
//             name: '视频广告',
//             type: 'line',
//             areaStyle: {normal: {}},
//             data: [150, 232, 201, 154, 190, 330, 410]
//         },
//         {
//             name: '直接访问',
//             type: 'line',
//             areaStyle: {normal: {}},
//             data: [320, 332, 301, 334, 390, 330, 320]
//         },
//         {
//             name: '搜索引擎',
//             type: 'line',
//             areaStyle: {normal: {}},
//             data: [820, 932, 901, 934, 1290, 1330, 200]
//         }
//     ]
// };

export default class studentMovement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            divContentArray: '',
            en: false,
            show: false,
            config: {},
            startTimeValue: '起始时间',
            endTimeValue: '结束时间',
            columnarChartOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: []
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: []
            }
        };
    }

    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var ident = locationSearchArray[0].split("=")[1];
        this.setState({ident});
    }

    startTimeOnOk(time) {
        this.setState({startTimeValue: WebServiceUtil.formatYMD(new Date(time).getTime())})

    }

    endTimeOnOk(time) {
        this.setState({endTimeValue: WebServiceUtil.formatYMD(new Date(time).getTime())})
    }

    viewBuildingStatistics = () => {
        var _this = this;
        var startTimeValue = this.state.startTimeValue
        var endTimeValue = this.state.endTimeValue
        if (startTimeValue == '起始时间' || endTimeValue == '结束时间') {
            Toast.fail('请选择起始,结束时间', 2)
            return
        }
        var param = {
            "method": 'viewBuildingStatistics',
            "uid": _this.state.ident,
            "start": startTimeValue,
            "end": endTimeValue
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' || result.success) {
                    _this.buildLine(result.response)
                } else {
                    Toast.fail(result.msg, 2)
                }
            },
            onError: function (error) {

            }
        });
    }

    buildLine(data) {
        debugger
        if (WebServiceUtil.isEmpty(data.content)) {
            Toast.fail('未查到相关数据')
            return
        }
        var roomArr = []
        var lineArr = []
        for (var k in data.content) {
            roomArr.push(k + '')
            lineArr.push(
                {
                    type: 'line',
                    // areaStyle: {normal: {}},
                    name: k,
                    data: data.content[k]
                }
            )
        }
        var columnarChartOption = this.state.columnarChartOption;
        columnarChartOption.series = lineArr
        columnarChartOption.legend.data = roomArr
        columnarChartOption.xAxis[0].data = data.title
        this.setState({columnarChartOption})
        console.log(this.state.columnarChartOption);
    }

    render() {
        var _this = this;
        return (
            <div id="studentMovement" style={{height: document.body.clientHeight}}>
                <div className="flex_container my_flex teacher_list teacher_list_p">
                    <DatePicker
                        mode="date"
                        use24Hours
                        title='起始时间'
                        onOk={(time) => _this.startTimeOnOk(time)}
                    >
                        <span className="add_element">{this.state.startTimeValue}<i
                            className="icon_triangle"></i></span>
                    </DatePicker>
                    <DatePicker
                        mode="date"
                        use24Hours
                        title='结束时间'
                        onOk={(time) => _this.endTimeOnOk(time)}
                    >
                        <span className="add_element">{this.state.endTimeValue}<i
                            className="icon_triangle"></i></span>
                    </DatePicker>
                    <Button type="primary" className="blue_btn" inline size="small" onClick={this.viewBuildingStatistics}>确定</Button>
                </div>
                <WhiteSpace size="lg"/>
                <div style={{height: '350px'}} className="echarts_wrap">
                    <ReactEcharts
                        option={this.state.columnarChartOption}
                        style={{height: '100%', width: '100%'}}
                        className=''/>
                </div>
            </div>
        );
    }
}
