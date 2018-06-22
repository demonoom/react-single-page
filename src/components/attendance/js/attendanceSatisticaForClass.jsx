import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, Button, ActivityIndicator,WhiteSpace
} from 'antd-mobile';
import '../css/attendanceSatisticaForClass.less'
import '../css/macarons'

export default class attendanceSatisticaForClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            domArray: [],
            clientHeight: document.body.clientHeight,
            animating:false
        }
    }

    componentDidMount() {
        document.title = '班级出勤率统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
        var date = new Date();
        this.setState({
            schoolId: schoolId,
            date:date
        }, function () {
            this.getBraceletStudentAttendanceBar();
            // this.getData();
        }.bind(this))
    }


    buildChartOption = (xClassArray,lateArray,allArray,actuallyArray,noAttendanceArray) => {
        return {
            title:{
              text:'班级出勤统计',
                left:'center'
            },
            backgroundColor:'white',
            //color: ['#003366', '#006699', '#4cabce', '#e5323e'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['应到', '准时', '缺勤', '迟到'],
                bottom:'0'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: xClassArray
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '应到',
                    type: 'bar',
                    label: '应到',
                    data: allArray,
                    label: {
                        normal: {
                            show: true,            //显示数字
                            position: 'top'        //这里可以自己选择位置
                        }
                    },
                    barWidth: 12,
                },
                {
                    name: '准时',
                    type: 'bar',
                    label: '准时',
                    data: actuallyArray,
                    label: {
                        normal: {
                            show: true,            //显示数字
                            position: 'top'        //这里可以自己选择位置
                        }
                    },
                    barWidth: 12,
                },
                {
                    name: '缺勤',
                    type: 'bar',
                    label: '缺勤',
                    data: noAttendanceArray,
                    label: {
                        normal: {
                            show: true,            //显示数字
                            position: 'top'        //这里可以自己选择位置
                        }
                    },
                    barWidth: 12,
                },
                {
                    name: '迟到',
                    type: 'bar',
                    barGap: 0,
                    label: '迟到',
                    data: lateArray,
                    label: {
                        normal: {
                            show: true,            //显示数字
                            position: 'top'        //这里可以自己选择位置
                        }
                    },
                    barWidth: 12,
                },

            ]
        };
    };


    getData(data) {   //设置数据结构
        console.log(data);
        var xClassArray = [],lateArray=[],allArray=[],actuallyArray=[],noAttendanceArray=[];
        for(var k in data){
            xClassArray.push(data[k].clazz.name);
            lateArray.push(data[k].attendanceLate);
            allArray.push(data[k].allSchoolStudent);
            actuallyArray.push(data[k].attendanceStudent);
            noAttendanceArray.push(data[k].noAttendanceStudent);
        }
        var columnarChartOption = this.buildChartOption(xClassArray,lateArray,allArray,actuallyArray,noAttendanceArray);
        var reactDom =
            <ReactEcharts
                option={columnarChartOption}
                style={{height: this.state.clientHeight / 2, width: '100%'}}
                theme='macarons'
                className=''/>
        this.setState({
            domArray: reactDom,
        });
        this.hideToast();
    }


    getBraceletStudentAttendanceBar() {
        this.showToast();
        var param = {
            "method": 'getBraceletStudentAttendanceBar',
            "schoolId": this.state.schoolId,
            "attendDate": WebServiceUtil.formatYMD(this.state.date.getTime())
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    this.getData(result.response);
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    showToast = () => {
        this.setState({animating: true});
    }

    hideToast = () => {
        this.setState({animating: false});
    }

    dateChange(event) {
        this.setState({
            date: event,
        }, function () {
            this.getBraceletStudentAttendanceBar();
        }.bind(this))
    }


    render() {
        return (
            <div id="attendanceSatisticaForClass" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto',
            }}>
                    <DatePicker
                        mode="date"
                        // title="Select Date"
                        extra={this.state.date}
                        value={this.state.date}
                        // onChange={date => this.setState({ date })}
                        onOk={this.dateChange.bind(this)}

                    >
                        <List.Item arrow="horizontal" className="data_list">选择日期</List.Item>
                    </DatePicker>
                <WhiteSpace size="lg"/>
                <div className="dom_cont">
                    {this.state.domArray}
                </div>

                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.animating}
                />
            </div>
        );
    }

}