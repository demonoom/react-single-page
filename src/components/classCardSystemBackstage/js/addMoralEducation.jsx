import React from 'react';
import { Picker, List, WhiteSpace, Button, WingBlank, InputItem, DatePicker, TextareaItem, Modal, Toast } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

import '../css/addMoralEducation.less'
var moralEdu;
const prompt = Modal.prompt;
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
// const CustomChildren = ({ extra, onClick, children }) => (
//     <div
//         onClick={onClick}
//         style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px' }}
//     >
//         {children}
//         <span style={{ float: 'right', color: '#888' }}>{extra}</span>
//     </div>
// );
export default class addCurriculumSchedule extends React.Component {
    constructor(props) {
        super(props);
        moralEdu = this;
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
        document.title = '添加德育评价';
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
     * 日期切换的回调
     * @param val
     */
    onDatePickerChange = (v) => {
        // const d = [...this.state.posData];
        // const posAsyncValue = [...val];
        // this.setState({
        //     posData: d,
        //     posAsyncValue,
        // });
        var d = new Date(v);
        var newTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        console.log(newTime);
        localStorage.setItem("createTimeKey",JSON.stringify(newTime));
    }

    /**
     * 提交新增的德育项
     */
    addMoralEducationTableItem = () => {
        const param = {
            "method": "saveMoralEducation",
            "moralEducationJson": {
                "cid": JSON.parse(localStorage.getItem("getClassKey")).classId[0],
                "health": $(".healthValue input").val(),
                "politeness": $(".politeValue input").val(),
                "termid": JSON.parse(localStorage.getItem("getTermKey")).termId[0],
                "createTime": JSON.parse(localStorage.getItem("createTimeKey"))
            }
        
        }
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(result);
                    Toast.success('添加成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finish',
                        };

                        Bridge.callHandler(data, null, function (error) {
                            // Toast.fail(error);
                            console.log(error);
                        });
                    }, 1000)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
        // console.log(this.state.ClassTableDataArr);
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

    // addMoralEduction() {
    //     var phoneType = navigator.userAgent;
    //     var phone;
    //     if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
    //         phone = 'ios'
    //     } else {
    //         phone = 'android'
    //     }
    //     prompt('请输入您修改的名称', '', [
    //         {text: '取消'},
    //         {text: '确定', onPress: value => moralEdu.userDefined(value)},
    //     ], 'default', '', [], phone)
    // }

    chooseWeeks = () => {
        var _this = this;
        var param = {
            "method": 'getSemesterList',
            "uid": JSON.parse(localStorage.getItem("userIdKey")).userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
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
    handleClick = () => {
        this.customFocusInst.focus();
    }

    getClazzesByUserId(id){
        var _this = this;
        var param = {
            "method": 'getClazzesByUserId',
            "userId": id
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = [];
                        result.response.forEach(function (v, i) {
                            arr.push({
                                value: v.id, label: v.name
                            })
                        })
                        _this.setState({classData: arr})
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
    getClassKey = (v) => {
        // console.log(v);
        this.setState({classAsyncValue: v});
        var classKey = {
            "classId":v
        }
        localStorage.setItem("getClassKey",JSON.stringify(classKey))
        console.log(JSON.parse(localStorage.getItem("getClassKey")).classId);
    }
    getTermKey = (v) => {
        var termKey = {
            "termId":v
        }
        localStorage.setItem("getTermKey",JSON.stringify(termKey));
        console.log(JSON.parse(localStorage.getItem("getTermKey")).termId);
        // console.log(v);
    }

    userDefined(value){
        console.log(value);
        if (value.length == 0) {
            Toast.fail('文件夹名称不能为空', 1);
            return
        }
        var _this = this;
        var param = {
            "method": 'updateMoralEducation',
            "moralEducationJson": {
                "cid": JSON.parse(localStorage.getItem("getClassKey")).classId[0],
                "health": $(".healthValue input").val(),
                "politeness": $(".politeValue input").val(),
                "termid": JSON.parse(localStorage.getItem("getTermKey")).termId[0],
                "createTime": JSON.parse(localStorage.getItem("createTimeKey"))
            }
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    // 刷新
                    Toast.success('重命名成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (data.id == v.id) {
                            v.name = str;
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                    //解决安卓键盘改变窗口高度问题,所以延迟100
                    // setTimeout(function () {
                    //     _this.setState({
                    //         dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    //     });
                    // }, 100);
                } else {
                    Toast.fail('重命名失败', 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
        // console.log(rowData)
        // console.log("2213");
    }
    render() {
        // const { getFieldProps } = this.props.form;
        return (
            <div id="addMoralEducation" style={{ height: document.body.clientHeight }}>
                <WhiteSpace size="lg" />
                {/*选择班级*/}
                <Picker
                    data={this.state.classData}
                    cols={1}
                    value={this.state.classAsyncValue}
                    onPickerChange={this.onClassPickerChange}
                    onOk={this.getClassKey}
                >
                    <List.Item arrow="horizontal" onClick={this.getClazzesByUserId.bind(this,JSON.parse(localStorage.getItem("userIdKey")).userId)}>选择班级<i className="redStar">*</i></List.Item>
                </Picker>
                <WhiteSpace size="lg" />
                {/*选择学期*/}
                <Picker
                    data={this.state.termData}
                    cols={1}
                    value={this.state.termAsyncValue}
                    onPickerChange={this.onTermPickerChange}
                    onOk={this.getTermKey}
                >
                    <List.Item arrow="horizontal" onClick={this.chooseWeeks}>选择学期<i className="redStar">*</i></List.Item>
                </Picker>
                <WhiteSpace size="lg" />
                {/*选择日期*/}
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.date}
                    onOk={this.onDatePickerChange}
                    onChange={date => this.setState({ date })}
                >
                    <List.Item arrow="horizontal">选择日期<i className="redStar">*</i></List.Item>
                </DatePicker>
                <WhiteSpace size="lg" />
                <div className='CourseTableArea'>
                        <div className="classSearchResultInfo">
                            <List>
                                <InputItem
                                    className="politeValue"
                                    clear
                                    placeholder="请输入分数"
                                    defaultValue=""
                                    // value="123"
                                    ref={el => this.autoFocusInst = el}
                                >班级礼貌评分</InputItem>
                                <InputItem
                                    className="healthValue"
                                    clear
                                    placeholder="请输入分数"
                                    ref={el => this.autoFocusInst = el}
                                >班级健康评分</InputItem>
                            </List>
                    </div>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.addMoralEducationTableItem}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
