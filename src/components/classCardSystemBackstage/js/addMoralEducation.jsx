import React from 'react';
import {
    Picker,
    List,
    WhiteSpace,
    Button,
    InputItem,
    DatePicker,
    TextareaItem,
    Modal,
    Toast
} from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import '../css/addMoralEducation.less';

var moralEdu;
const prompt = Modal.prompt;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);


export default class addMoralEducation extends React.Component {
    constructor(props) {
        super(props);
        moralEdu = this;
        this.state = {
            cols: 1,
            data: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}],
            classData: [],
            termData: [],
            asyncValue: [],
            termAsyncValue: [],
            classAsyncValue: [],
            ClassTableDataArr: [],  //课表数据
            date: now,
            time: now,
            dpValue: null,
            customChildValue: null,
            visible: false,
            timeValue: null
        };
    }

    componentDidMount() {
        document.title = '添加德育评价';
    }

    /**
     * 班级切换的回调
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
        var d = new Date(v);
        var newTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.setState({
            timeValue: newTime
        })
    }

    /**
     * 提交新增的德育项
     */
    addMoralEducationTableItem = () => {
        if (moralEdu.state.classAsyncValue[0] == 0) {
            Toast.fail('请选择班级')
            return
        }
        if (moralEdu.state.termAsyncValue[0] == 0) {
            Toast.fail('请选择学期')
            return
        }
        if (moralEdu.state.timeValue == null) {
            Toast.fail('请选择日期')
            return
        }
        if ($(".healthValue input").val().trim() == '' || $(".healthValue input").val().trim().length == 0) {
            Toast.fail('请填写礼貌评分')
            return
        }
        if ($(".politeValue input").val().trim() == '' || $(".healthValue input").val().trim().length == 0) {
            Toast.fail('请填写健康评分')
            return
        }
        const param = {
            "method": "saveMoralEducation",
            "moralEducationJson": {
                "cid": moralEdu.state.classAsyncValue[0],
                "health": $(".healthValue input").val(),
                "politeness": $(".politeValue input").val(),
                "termid": moralEdu.state.termAsyncValue[0],
                "createTime": moralEdu.state.timeValue
            }

        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('添加成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finish',
                        };

                        Bridge.callHandler(data, null, function (error) {
                        });
                    }, 1000)
                }
            },
            onError: function (error) {
            }
        });
    }
  

    chooseTerms = () => {
        var _this = this;
        var param = {
            "method": 'getSemesterList',
            "uid": JSON.parse(localStorage.getItem("userIdKey")).userId
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
                        _this.setState({termData: _this.state.termData.concat(arr)})
                    }
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });
    }
    /**
     *获取班级的ID
     */
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
            }
        });
    }

    getClassKey = (v) => {
        this.setState({classAsyncValue: v});
    }
    getTermKey = (v) => {
        this.setState({
            termAsyncValue: v
        })


<<<<<<< HEAD
>>>>>>> e11485a9e5491dc0fa8ff9bd07ead7a67fa0c128
    render() {
        return (
            <div id="addMoralEducation" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                {/*选择班级*/}
                <Picker
                    data={this.state.classData}
                    cols={1}
                    value={this.state.classAsyncValue}
                    onPickerChange={this.onClassPickerChange}
                    onOk={this.getClassKey}
                >
                    <List.Item arrow="horizontal"
                               onClick={this.getClazzesByUserId.bind(this, JSON.parse(localStorage.getItem("userIdKey")).userId)}>选择班级<i
                        className="redStar">*</i></List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                {/*选择学期*/}
                <Picker
                    data={this.state.termData}
                    cols={1}
                    value={this.state.termAsyncValue}
                    onPickerChange={this.onTermPickerChange}
                    onOk={this.getTermKey}
                >
                    <List.Item arrow="horizontal" onClick={this.chooseTerms}>选择学期<i className="redStar">*</i></List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                {/*选择日期*/}
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.date}
                    onOk={this.onDatePickerChange}
<<<<<<< HEAD
                    onChange={date => this.setState({date})}
=======
                    onChange={date => this.setState({ date })}
>>>>>>> e11485a9e5491dc0fa8ff9bd07ead7a67fa0c128
                >
                    <List.Item arrow="horizontal">选择日期<i className="redStar">*</i></List.Item>
                </DatePicker>
                <WhiteSpace size="lg"/>
                <div className='CourseTableArea'>
                        <div className="classSearchResultInfo">
                            <List>
                                <InputItem
                                    className="politeValue"
                                    clear
                                    placeholder="请输入分数"
                                    ref={el => this.autoFocusInst = el}
                                >班级礼貌评分</InputItem>
                                <InputItem
                                    className="healthValue"
                                    clear
                                    placeholder="请输入分数"
                                    ref={el => this.autoFocusInst = el}
                                >班级健康评分</InputItem>
                            </List>
<<<<<<< HEAD
                        </div>
=======
                    </div>
>>>>>>> e11485a9e5491dc0fa8ff9bd07ead7a67fa0c128
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg"/>
                    <WingBlank>
                        <Button type="warning" onClick={this.addMoralEducationTableItem}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
