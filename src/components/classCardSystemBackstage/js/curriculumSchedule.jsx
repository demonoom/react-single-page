import React from 'react';
import {Picker, List, WhiteSpace} from 'antd-mobile';
import '../css/curriculumSchedule.less'

const seasons = [
    [
        {
            label: '二年级一班',
            value: '2013',
        },
        {
            label: '二年级二班',
            value: '2014',
        },
    ],
    [
        {
            label: '春',
            value: '春',
        },
        {
            label: '夏',
            value: '夏',
        },
    ],
];

export default class curriculumSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cols: 1,
            pickerValue: [],
            asyncValue: [],
            sValue: ['2013', '春'],
            visible: false,
        };
    }

    componentDidMount() {
        document.title = '班级课程表';
    }

    onClick = () => {
        this.setState({
            data: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}]
        });
    };

    onPickerChange = (val) => {
        const d = [...this.state.data];
        const asyncValue = [...val];
        this.setState({
            data: d,
            cols: 1,
            asyncValue,
        });
    };

    render() {
        var _this = this;
        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                <Picker
                    data={seasons}
                    title="请选择"
                    cascade={false}
                    value={this.state.sValue}
                    onChange={v => this.setState({sValue: v})}
                    onOk={v => this.setState({sValue: v})}
                >
                    <List.Item arrow="horizontal">班级,学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => console.log(v)}
                >
                    <List.Item arrow="horizontal" onClick={this.onClick}>日期</List.Item>
                </Picker>
            </div>
        );
    }
}
