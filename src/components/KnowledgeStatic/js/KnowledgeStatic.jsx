import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, ActivityIndicator, WhiteSpace
} from 'antd-mobile';
import '../css/KnowledgeStatic.less'

export default class KnowledgeStatic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            domArray: [],
            clientHeight: document.body.clientHeight,
            animating: false
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班级出勤率统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var date = new Date();
        this.setState({
            userId: userId,
            date: date
        }, function () {
            this.getAvgMasteryAccuaryLineChartData();
        }.bind(this))
    }


    buildChartOption = (xClassArray, lateArray) => {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
        };
    };


    getData(data) {   //设置数据结构
        console.log(data);
        if (!data) {
            Toast.info('暂无数据', 1);
        }
        var columnarChartOption = this.buildChartOption();
        var reactDom =
            <ReactEcharts start

                          option={columnarChartOption}
                          style={{height: this.state.clientHeight / 2 + 50, width: '100%'}}
                          // theme='macarons'
                          className=''/>
        this.setState({
            domArray: reactDom,
        });
        this.hideToast();
    }


    getAvgMasteryAccuaryLineChartData() {
        this.showToast();
        var param = {
            "method": 'getAvgMasteryAccuaryLineChartData',
            "startTime": WebServiceUtil.formatYMD(new Date('2000-01-01').getTime()),
            "endTime": WebServiceUtil.formatYMD(this.state.date.getTime()),
            "userId" :23836
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'图标数据');
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
            <div id="KnowledgeStatic" style={{
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