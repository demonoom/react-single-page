import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, Button, Picker, Radio
} from 'antd-mobile';
import './css/homeWorkAnalysis.less'
var colors = ['#5793f3', '#d14a61'];
var stuIdArray = [];
var pushTimeGlobal;
var clazzIdGlobal;
const RadioItem = Radio.RadioItem;

// 如果不是使用 List.Item 作为 children
const CustomChildren = (props) => {
    return (
        <div
            onClick={props.onClick}
            style={{backgroundColor: '#fff', height: 45, lineHeight: '45px', padding: '0 15px'}}
        >
            {props.children}
            <span style={{float: 'right'}}>{props.extra}</span>
        </div>
    );
};

export default class HomeWorkUnderstandAnalysisGuide extends React.Component {

    constructor(props) {
        super(props);
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.state = {
            lastPoint: '0',
            currentFaceEmotion: {},
            screenHeight: screen.height,
            stuNameArray: [],
            avgOfTimeLengthArray: [],
            avgOfUnderstandArray: [],
            stuIdArray: [],
            date: now,
            classList: [],
            clazzId: [],
            isLoading: false,
            value: 0,
            analysisUrl: ''
        };
        this.analysisByClass = this.analysisByClass.bind(this);
        this.getTeacherClasses = this.getTeacherClasses.bind(this);
    }

    componentDidMount() {
        document.title = '班级作业平均理解度';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        this.getTeacherClasses(userId);
    }

    analysisByClass() {
        var da = new Date(this.state.date);
        var year = da.getFullYear();
        var month = parseInt(da.getMonth() + 1) > 9 ? da.getMonth() + 1 : "0" + (da.getMonth() + 1);
        var date = parseInt(da.getDate()) > 9 ? da.getDate() : "0" + da.getDate();
        var dayStr = [year, month, date].join('-');
        // console.log(this.state.clazzId+"==="+this.state.date+"======"+dayStr);
        var analysisUrl = "";
        var clazzIdStr = this.state.clazzId[0];
        if (this.state.value == 0) {
            analysisUrl = WebServiceUtil.mobileServiceURL + "homeWorkUnderstandAnalysisByClass?clazzId=" + clazzIdStr + "&pushTime=" + dayStr;
        } else {
            analysisUrl = WebServiceUtil.mobileServiceURL + "homeWorkUnderstandAnalysisByClassSubject?clazzId=" + clazzIdStr + "&pushTime=" + dayStr;
        }


        var data = {
            method: 'openNewPage',
            url: analysisUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    getTeacherClasses(userId) {
        var _this = this;
        var param = {
            "method": 'getTeacherClasses',
            "ident": userId
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                var classList = [];
                response.forEach(function (e) {
                    var classArray = e.split("#");
                    var classId = classArray[0];
                    var className = classArray[1];
                    var classJson = {label: className, value: classId,}
                    classList.push(classJson)
                });
                _this.setState({classList: classList, userId});
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    onChange = (value) => {
        console.log('checkbox' + value);
        this.setState({
            value,
        });
    };

    render() {
        let onEvents = {
            'click': this.onChartClick,
        };

        const data = [
            {value: 0, label: '按班级统计'},
            {value: 1, label: '按题目统计'},
        ];
        const {value} = this.state;
        return (
            <div id="homeWorkAnalysis">
                <div className="understanding_title">班级平均理解度统计</div>
                <div>
                    <div>
                        <span>
                            <DatePicker
                                mode="date"
                                title="Select Date"
                                extra="Optional"
                                value={this.state.date}
                                onChange={date => this.setState({date})}
                            >
                              <List.Item arrow="horizontal">发布日期</List.Item>
                            </DatePicker>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Picker data={this.state.classList} title="选择班级" extra="请选择(可选)" cols={1}
                                    value={this.state.clazzId} onChange={(v) => this.setState({clazzId: v})}>
                                <CustomChildren>班级选择</CustomChildren>
                              </Picker>
                        </span>
                    </div>

                    <div>
                        <List renderHeader={() => '统计方式'}>
                            {data.map(i => (
                                <RadioItem key={i.value} checked={value === i.value}
                                           onChange={() => this.onChange(i.value)}>
                                    {i.label}
                                </RadioItem>
                            ))}
                        </List>
                    </div>

                    <div>
                        <span>
                            <Button onClick={this.analysisByClass}>分析</Button>
                        </span>
                    </div>

                </div>
            </div>
        );
    }

}