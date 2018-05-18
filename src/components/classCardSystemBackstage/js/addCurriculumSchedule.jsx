import React from 'react';
import {Toast, Picker, List, WhiteSpace, Button, WingBlank, InputItem, DatePicker, TextareaItem} from 'antd-mobile';
import '../css/addCurriculumSchedule.less'

export default class addCurriculumSchedule extends React.Component {
    constructor(props) {
        super(props);
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
            posData: [],
            terData: [],
            termData: [{value: '-1', label: '自定义学期'}],
            asyncValue: [],
            termAsyncValue: [],
            classAsyncValue: [],
            posAsyncValue: [],
            terAsyncValue: [],
            ClassTableArr: [],  //课表结构
            ClassTableDataArr: [],  //课表数据
        };
    }

    componentDidMount() {
        document.title = '添加课程表';
        this.viewClassRoomPage();
        this.getTeacherByCreator();
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

    onTerPickerChange = (val) => {
        const d = [...this.state.terData];
        const terAsyncValue = [...val];
        this.setState({
            terData: d,
            terAsyncValue,
        });
    }

    /**
     * 新增课表项
     */
    addCourseTableItem = () => {
        var _this = this;
        if (this.state.classAsyncValue.length == 0) {
            Toast.fail('请选择班级');
            return
        }
        if (this.state.termAsyncValue.length == 0) {
            Toast.fail('请选择学期');
            return
        }
        if (this.state.asyncValue.length == 0) {
            Toast.fail('请选择星期');
            return
        }
        if (this.state.ClassTableDataArr.length == 0) {
            Toast.fail('课表不能为空');
            return
        }
        for (var i = 0; i < this.state.ClassTableDataArr.length; i++) {
            var v = this.state.ClassTableDataArr[i];
            if (v.classAd == '上课地点' || v.startTimeData == '开始时间' || v.endTimeData == '结束时间' || v.clazzName == '' || v.teacherName == '') {
                Toast.fail('课表存在空值');
                return false
            }
        }
        var param = {
            "method": 'addCourseTableItem',
            "cti": {
                "creatorId": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid,
                "week": this.state.asyncValue[0],
                "classId": this.state.classAsyncValue[0],
                "semesterId": this.state.termAsyncValue[0]
            }
        };
        var classArray = [];
        this.state.ClassTableDataArr.forEach(function (v, i) {
            classArray.push({
                "courseName": v.clazzName,
                "index": i + 1,
                "teacherId": v.teacherName,
                "classRoomId": v.classAddress,
                "isPublic": false,
                "openTime": v.startTimeData,
                "closeTime": v.endTimeData,
                "comment": v.nodeDetal
            })
        })
        param.cti.schedules = classArray;
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('成功');
                    // _this.state.asyncValue.splice(0);
                    // _this.state.classAsyncValue.splice(0);
                    // _this.state.termAsyncValue.splice(0);
                    // _this.state.ClassTableDataArr.splice(0);
                    // _this.buildClassTable();
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 课程名称数据框动态绑定内容的方法
     * @param index
     * @param value
     */
    inputOnChange = (index, value) => {
        this.state.ClassTableDataArr[index].clazzName = value;
        this.buildClassTable();
    }

    /**
     * 备注数据框动态绑定内容的方法
     * @param index
     * @param value
     */
    textareaOnChange = (index, value) => {
        this.state.ClassTableDataArr[index].nodeDetal = value;
        this.buildClassTable();
    }

    /**
     * 开课时间动态绑定内容的方法
     * @param v
     * @param i
     */
    startTimeOnOk(v, i) {
        this.state.ClassTableDataArr[i].startTimeData = WebServiceUtil.formatHM(new Date(v).getTime());
        this.buildClassTable();
    }

    /**
     * 下课时间动态绑定内容的方法
     * @param v
     * @param i
     */
    endTimeOnOk(v, i) {
        this.state.ClassTableDataArr[i].endTimeData = WebServiceUtil.formatHM(new Date(v).getTime());
        this.buildClassTable();
    }

    getTeacherByCreator = () => {
        var _this = this;
        var param = {
            "method": 'getTeacherByCreator',
            "aid": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = [];
                        result.response.forEach(function (v, i) {
                            arr.push({
                                value: v.colUid, label: v.userName
                            })
                        })
                        _this.setState({terData: arr});
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    viewClassRoomPage = () => {
        var _this = this;
        var param = {
            "method": 'viewClassRoomPage',
            "uid": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid,
            "pn": -1
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
                        _this.setState({posData: arr});
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    posPickerOnOk(v, i) {
        var classAd = ''
        this.state.posData.forEach(function (item, index) {
            if (item.value == v) {
                classAd = item.label
            }
        })
        this.state.ClassTableDataArr[i].classAd = classAd;
        this.state.ClassTableDataArr[i].classAddress = v[0];
        this.buildClassTable();
    }

    terPickerOnOk(v, i) {
        var terName = ''
        this.state.terData.forEach(function (item, index) {
            if (item.value == v) {
                terName = item.label
            }
        })
        this.state.ClassTableDataArr[i].teacherId = terName;
        this.state.ClassTableDataArr[i].teacherName = v[0];
        this.buildClassTable();
    }

    /**
     * 根据数据构建,完成数据的动态绑定
     */
    buildClassTable = () => {
        var _this = this;
        var ClassTableArr = [];
        this.state.ClassTableDataArr.forEach(function (v, i) {
            ClassTableArr.push(<div className="">
                <div className="flex_container my_flex flex_addElement">
                    <DatePicker
                        mode="time"
                        use24Hours
                        title='开始时间'
                        onOk={(time) => _this.startTimeOnOk(time, i)}
                    >
                        <span className="add_element">{_this.state.ClassTableDataArr[i].startTimeData}</span>
                    </DatePicker>
                    <DatePicker
                        mode="time"
                        use24Hours
                        title='结束时间'
                        onOk={(time) => _this.endTimeOnOk(time, i)}
                    >
                        <span className="add_element">{_this.state.ClassTableDataArr[i].endTimeData}</span>
                    </DatePicker>
                    {/*上课地点*/}
                    <Picker
                        data={_this.state.posData}
                        cols={1}
                        value={_this.state.posAsyncValue}
                        onPickerChange={_this.onPosPickerChange}
                        onOk={v => _this.posPickerOnOk(v, i)}
                    >
                        <span className="add_element">{_this.state.ClassTableDataArr[i].classAd}</span>
                    </Picker>
                    <Picker
                        data={_this.state.terData}
                        cols={1}
                        value={_this.state.terAsyncValue}
                        onPickerChange={_this.onTerPickerChange}
                        onOk={v => _this.terPickerOnOk(v, i)}
                    >
                        <span className="add_element">{_this.state.ClassTableDataArr[i].teacherId}</span>
                    </Picker>
                </div>
                <div className="flex_container my_flex flex_addElement">
                    <InputItem
                        className="add_element"
                        placeholder="请输入课程名称"
                        value={v.clazzName}
                        onChange={_this.inputOnChange.bind(this, i)}
                    ></InputItem>
                </div>
                <div className="flex_container my_flex flex_addElement">
                    <TextareaItem
                        rows={2}
                        className="add_element"
                        placeholder="添加备注"
                        labelNumber={2}
                        value={v.nodeDetal}
                        onChange={_this.textareaOnChange.bind(this, i)}
                    />
                </div>
            </div>)
            _this.setState({ClassTableArr})
        })
    };

    /**
     * 新增课表表单
     * 新增只是增加数据,然后到构建的方法中根据数据构建
     */
    addClassTable = () => {
        /**
         * startTimeData开课时间
         * endTimeData结束时间
         * classAd开课地点
         * clazzName课程名称
         */
        this.state.ClassTableDataArr.push({
            startTimeData: '开始时间',
            endTimeData: '结束时间',
            classAd: '上课地点',
            teacherId: '选择老师',
            tercherName: '',
            clazzName: '',
            nodeDetal: ''
        });
        this.buildClassTable();
    };

    /**
     * 选择学期点击确定的回调
     */
    termOnOk(v) {
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
                        _this.setState({termData: _this.state.termData.concat(arr)})
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    getClazzesByUserId(id) {
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

    classOnOk(v) {
        this.setState({classAsyncValue: v});
    }

    render() {
        return (
            <div id="addCurriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                {/*选择班级*/}
                <Picker
                    data={this.state.classData}
                    cols={1}
                    value={this.state.classAsyncValue}
                    onPickerChange={this.onClassPickerChange}
                    onOk={v => this.classOnOk(v)}
                >
                    <List.Item
                        arrow="horizontal"
                        onClick={this.getClazzesByUserId.bind(this, JSON.parse(localStorage.getItem('loginUserSchedule')).colUid)}
                    >选择班级</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
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
                <WhiteSpace size="lg"/>
                {/*选择星期*/}
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                >
                    <List.Item arrow="horizontal">选择星期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <div className='CourseTableArea'>
                    {
                        this.state.ClassTableArr.map((v) => {
                            return <div>{v}</div>
                        })
                    }
                    <img onClick={this.addClassTable} className='addClassTable'
                         src={require('../imgs/addClassTable.png')} alt=""/>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg"/>
                    <WingBlank>
                        <Button type="warning" onClick={this.addCourseTableItem}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
