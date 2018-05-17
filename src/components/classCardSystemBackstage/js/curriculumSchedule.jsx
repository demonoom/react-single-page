import React from 'react';
import {Picker, List, WhiteSpace} from 'antd-mobile';
import '../css/curriculumSchedule.less'

const seasons = [
    [
        {
            label: '请选择',
            value: '0',
        },
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
            label: '请选择',
            value: '0',
        },
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
            data: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}],
            cols: 1,
            asyncValue: [],
            sValue: ['0', '0'],
            visible: false,
        };
    }

    componentDidMount() {
        document.title = '班级课程表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("=")[1];
        var loginUser = {
            "colUid": ident,
        };
        localStorage.setItem("loginUserSchedule", JSON.stringify(loginUser));
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
     * 增加课程表的回调
     */
    addSchedule() {
        var url = WebServiceUtil.mobileServiceURL + "addCurriculumSchedule";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 查看课表项管理页
     * @param v
     */
    viewCourseTableItemPage(v) {
        console.log(v);
        //String uid, String sid, String w, String cid, String ri
    }

    render() {
        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                {/*班级,学期*/}
                <Picker
                    data={seasons}
                    cascade={false}
                    value={this.state.sValue}
                    onChange={v => this.setState({sValue: v})}
                    onOk={v => this.setState({sValue: v})}
                >
                    <List.Item arrow="horizontal">班级,学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                {/*日期*/}
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => this.viewCourseTableItemPage(v)}
                >
                    <List.Item arrow="horizontal">日期</List.Item>
                </Picker>
                <div className='addBunton' onClick={this.addSchedule}>
                    <img src={require("../../ringBindInformation/imgs/addBtn.png")}/>
                </div>
            </div>
        );
    }
}
