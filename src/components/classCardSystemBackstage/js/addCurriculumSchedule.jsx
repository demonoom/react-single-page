import React from 'react';
import {Picker, List, WhiteSpace, Button, WingBlank, InputItem, DatePicker} from 'antd-mobile';
import '../css/addCurriculumSchedule.less'

var ClassTableArr = [];

export default class addCurriculumSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}],
            classData: [],
            termData: [],
            cols: 1,
            asyncValue: [],
            ClassTableArr: [],
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
     * 新增课表项
     */
    addCourseTableItem() {

    }

    /**
     * 新增课表表单
     */
    addClassTable = () => {
        var ClassTableDiv = <div>
            <div>
                <DatePicker
                    mode="time"
                    minuteStep={2}
                    use12Hours
                    value={this.state.time}
                    onChange={time => this.setState({time})}
                >
                    <span>课程开始时间</span>
                </DatePicker>
                <DatePicker
                    mode="time"
                    minuteStep={2}
                    use12Hours
                    value={this.state.time}
                    onChange={time => this.setState({time})}
                >
                    <span>课程结束时间</span>
                </DatePicker>
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => console.log(v)}
                >
                    <span>上课地点</span>
                </Picker>
            </div>
            <List>
                <InputItem
                    clear
                    placeholder="请输入课程名称"
                    ref={el => this.autoFocusInst = el}
                >课程名称</InputItem>
            </List>
            <div>添加备注</div>
        </div>
        ClassTableArr.push(ClassTableDiv);
        this.setState({ClassTableArr: ClassTableArr})
    }

    render() {
        return (
            <div id="addCurriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                <Picker
                    data={this.state.classData}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => console.log(v)}
                >
                    <List.Item arrow="horizontal">选择班级</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <Picker
                    data={this.state.termData}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => console.log(v)}
                >
                    <List.Item arrow="horizontal">选择学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
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
