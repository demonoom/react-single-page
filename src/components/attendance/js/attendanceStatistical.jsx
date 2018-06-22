import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, Button, ActivityIndicator,WhiteSpace
} from 'antd-mobile';
import '../css/attendanceStatistical.less'
import '../css/macarons'
export default class attendanceStatistical extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            domArray: [],
            clientHeight: document.body.clientHeight,
            animating: false
        }
    }

    componentDidMount() {
        document.title = '全校出勤统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
        this.setState({
            schoolId: schoolId,
            date: new Date(),
        }, function () {
            this.getBraceletStudentAttendancePie();
            // this.getData();
        }.bind(this))
    }


    buildChartOption = (noAttendanceStudent, attendanceStudent,attendanceLate, allSchoolStudent, attendancePercent) => {
        return {
            backgroundColor:'white',
            title: {
                text: '出勤率：' + (attendancePercent * 100) + '%',
                subtext: '应到：' + allSchoolStudent + '人',
                left: 'center',
                subtextStyle: {
                    color: '#999',          // 副标题文字颜色
                    fontSize:'12px',
                }
            },
            tooltip: {
                trigger: 'item',
                // formatter: "{a} <br/>{b} : {c} 岁"
            },
            legend: {
                bottom: 0,
                left: 'center',
            },
            series: [
                {
                    name: '出勤率',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '55%'],
                    // selectedMode: 'single',
                    data: [{
                        name: '缺勤',
                        value: noAttendanceStudent
                    }, {
                        name: '准时',
                        value: attendanceStudent
                    },
                        {
                            name: '迟到',
                            value: attendanceLate
                        }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{b}:{c}人: ({d}%)',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        }
                    }
                }
            ]
        };
    };


    getData(data) {   //设置数据结构
        console.log(data, 'data');
        if(!data){
            Toast.info('暂无数据',1);
        }
        var noAttendanceStudent = data.noAttendanceStudent; //缺勤
        var attendanceStudent = data.attendanceStudent;   //实到
        var allSchoolStudent = data.allSchoolStudent; //应到
        var attendancePercent = data.attendancePercent; //百分比
        var attendanceLate = data.attendanceLate; //迟到
        var columnarChartOption = this.buildChartOption(noAttendanceStudent, attendanceStudent,attendanceLate, allSchoolStudent, attendancePercent);
        var reactDom =
            <ReactEcharts
                option={columnarChartOption}
                style={{height: this.state.clientHeight / 2 + this.state.clientHeight * 0.05, width: '100%'}}
                theme='macarons'
            />
        this.setState({
            domArray: reactDom,
        });
        this.hideToast();
    }

    dateChange(event) {
        this.setState({
            date: event,
        }, function () {
            this.getBraceletStudentAttendancePie();
        }.bind(this))
    }


    getBraceletStudentAttendancePie() {
        this.showToast();
        var param = {
            "method": 'getBraceletStudentAttendancePie',
            "schoolId": this.state.schoolId,
            "attendDate": WebServiceUtil.formatYMD(this.state.date.getTime()),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // console.log(result);
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


    render() {
        return (
            <div id="attendanceStatistical" style={{
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