import React from 'react';
import {Picker, List,  WhiteSpace, Button, WingBlank, InputItem, DatePicker, TextareaItem} from 'antd-mobile';
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
            termData: [{value: '-1', label: '自定义学期'},
                {value: '7', label: '星期日'}],
            asyncValue: [],
            termAsyncValue: [],
            classAsyncValue: [],
            posAsyncValue: [],
            ClassTableArr: [],  //课表结构
            ClassTableDataArr: [],  //课表数据
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

    addNotes = (i) => {
        debugger
        this.state.ClassTableDataArr[i].nodeDisplay = 'block';
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
                        onOk={v => console.log(v)}
                    >
                        <span className="add_element">上课地点</span>
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
                <div className="flex_container my_flex flex_addElement" onClick={_this.addNotes.bind(this, i)}>添加备注</div>
                <div className="flex_container my_flex flex_addElement" style={{display: _this.state.ClassTableDataArr[i].nodeDisplay}}>
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
            classAd: '',
            clazzName: '',
            nodeDisplay: 'none',
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
                    onOk={v => console.log(v)}
                >
                    <List.Item arrow="horizontal">选择班级</List.Item>
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
                    <List.Item arrow="horizontal">选择学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                {/*选择星期*/}
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => console.log(v)}
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
