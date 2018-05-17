import React from 'react';
import { Picker, List, WhiteSpace, Button, WingBlank, InputItem, DatePicker, TextareaItem } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

import '../css/addMoralEducation.less'
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));

// Make sure that in `time` mode, the maxDate and minDate are within one day.
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);

function formatDate(date) {
    /* eslint no-confusing-arrow: 0 */
    const pad = n => n < 10 ? `0${n}` : n;
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${dateStr} ${timeStr}`;
}
const CustomChildren = ({ extra, onClick, children }) => (
    <div
        onClick={onClick}
        style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px' }}
    >
        {children}
        <span style={{ float: 'right', color: '#888' }}>{extra}</span>
    </div>
);
export default class addCurriculumSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cols: 1,
            data: [{ value: '1', label: '星期一' },
            { value: '2', label: '星期二' },
            { value: '3', label: '星期三' },
            { value: '4', label: '星期四' },
            { value: '5', label: '星期五' },
            { value: '6', label: '星期六' },
            { value: '7', label: '星期日' }],
            classData: [],
            posData: [],
            termData: [{ value: '-1', label: '自定义学期' }],
            asyncValue: [],
            termAsyncValue: [],
            classAsyncValue: [],
            posAsyncValue: [],
            ClassTableArr: [],  //课表结构
            ClassTableDataArr: [],  //课表数据
            date: now,
            time: now,
            utcDate: utcNow,
            dpValue: null,
            customChildValue: null,
            visible: false,
        };
    }

    componentDidMount() {
        document.title = '添加课程表';
    }

    /**
     * 星期切换的回调
     * @param val
     */
    onPickerChange = (val) => {
        const d = [...this.state.data];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
        });
    };

    /**
     * 班级切换的回调
     * @param val
     */
    onClassPickerChange = (val) => {
        const d = [...this.state.classData];
        const classAsyncValue = [...val];
        this.setState({
            classData: d,
            classAsyncValue,
        });
    }

    /**
     * 学期切换的回调
     * @param val
     */
    onTermPickerChange = (val) => {
        const d = [...this.state.termData];
        const termAsyncValue = [...val];
        this.setState({
            termData: d,
            termAsyncValue,
        });
    };

    /**
     * 上课地点切换的回调
     * @param val
     */
    onPosPickerChange = (val) => {
        const d = [...this.state.posData];
        const posAsyncValue = [...val];
        this.setState({
            posData: d,
            posAsyncValue,
        });
    }

    /**
     * 新增课表项
     */
    addCourseTableItem = () => {
        console.log(this.state.ClassTableDataArr);
    }

    /**
     * 课程名称数据框动态绑定内容的方法
     * @param index
     * @param value
     */
    inputOnChange = (index, value) => {
        this.state.ClassTableDataArr[index].clazzName = value;
    }

    /**
     * 备注数据框动态绑定内容的方法
     * @param index
     * @param value
     */
    textareaOnChange = (index, value) => {
        this.state.ClassTableDataArr[index].nodeDetal = value;
    }

    /**
     * 开课时间动态绑定内容的方法
     * @param v
     * @param i
     */
    startTimeOnOk(v, i) {
        this.state.ClassTableDataArr[i].startTimeData = WebServiceUtil.formatHM(new Date(v).getTime());
    }

    /**
     * 下课时间动态绑定内容的方法
     * @param v
     * @param i
     */
    endTimeOnOk(v, i) {
        this.state.ClassTableDataArr[i].endTimeData = WebServiceUtil.formatHM(new Date(v).getTime());
    }

    addMoralEduction() {
        if (v[0] == -1) {
            //跳转到编辑学期页面
            var url = WebServiceUtil.mobileServiceURL + "definedTerm";
            var data = {
                method: 'openNewPage',
                url: url
            };

            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        }
    }

    chooseWeeks = () => {
        var _this = this;
        var param = {
            "method": 'getSemesterList',
            "uid": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = []
                        result.response.forEach(function (v, i) {
                            arr.push(
                                {
                                    value: v.id,
                                    label: v.name
                                })
                        })
                        _this.setState({ termData: _this.state.termData.concat(arr) })
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        return (
            <div id="addMoralEducation" style={{ height: document.body.clientHeight }}>
                <WhiteSpace size="lg" />
                {/*选择班级*/}
                <Picker
                    data={this.state.classData}
                    cols={1}
                    value={this.state.classAsyncValue}
                    onPickerChange={this.onClassPickerChange}
                    onOk={v => console.log(v)}
                >
                    <List.Item arrow="horizontal">选择班级</List.Item>
                </Picker>
                <WhiteSpace size="lg" />
                {/*选择学期*/}
                <Picker
                    data={this.state.termData}
                    cols={1}
                    value={this.state.termAsyncValue}
                    onPickerChange={this.onTermPickerChange}
                    onOk={v => this.termOnOk(v)}
                >
                    <List.Item arrow="horizontal" onClick={this.chooseWeeks}>选择学期</List.Item>
                </Picker>
                <WhiteSpace size="lg" />
                {/*选择日期*/}
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.date}
                    onChange={date => this.setState({ date })}
                >
                    <List.Item arrow="horizontal">选择日期</List.Item>
                </DatePicker>
                <WhiteSpace size="lg" />
                <div className='CourseTableArea'>
                    <div>
                        <button onClick={this.addMoralEduction}>自定义</button>
                        <div className="classSearchResultInfo">
                            <span className="resultName">班级礼貌评分</span>
                            <span className="resultGrade">89分</span>
                        </div>
                    </div>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.addCourseTableItem}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
