import React from 'react';
import {List, Picker, InputItem, TextareaItem, Button,Toast} from 'antd-mobile';
import '../css/notify.less'

export default class addNotify extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pickerData: [],  //选择项容器
            asyncValue: [],
            title: '',
            content: '',
            classId: ''  //所选班级id
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        document.title = "通知列表";
        this.getClazzesByUserId();
    }
    getClazzesByUserId(){
        var _this = this;
        //获取班级选择项
        var param = {
            "method": 'getClazzesByUserId',
            "userId": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = [];
                        result.response.forEach(function (v, i) {
                            arr.push({
                                value: v.id, label: v.name
                            })
                        })
                        _this.setState({pickerData: arr});
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
    //选择器改变事件
    onPickerChange = (val) => {
        const d = [...this.state.pickerData];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
        });
    };
    //选择器确定事件
    viewCourseTableItemPage = (val) => {
        const d = [...this.state.pickerData];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
            classId: asyncValue[0],
        });
    };

    //提交
    submitClass = () => {
        let warn = '', classInfo = this.state;
        var _this = this;
        if (classInfo.classId == '') {
            warn = '请选择班级';
        } else if (classInfo.title == '') {
            warn = '请输入标题'
        } else if (classInfo.content == '') {
            warn = '请输入内容'
        }

        if (warn == '') {
            // 通过验证,开始提交
            let classObject = {
                uid:JSON.parse(localStorage.getItem('loginUserSchedule')).colUid,
                noticeContent:classInfo.content,
                cid:classInfo.classId,
                noticeTitle:classInfo.title
            };
            var param = {
                "method": 'saveClassBrandNotice',
                "classBrandNoticeJson": classObject,
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: (result) => {
                    if (result.msg == '调用成功' || result.success == true) {

                    }
                },
                onError: function (error) {
                   Toast.warn('保存失败');
                }
            });
        } else {
            Toast.info(warn,1);
        }
    };
    //标题双向绑定
    titleHandleChange = event => {
        this.setState({title: event});
    }
    //内容双向绑定
    contentHandleChange = event => {
        this.setState({content: event});
    }

    render() {
        return (
            <div id="notify" style={{height: document.body.clientHeight}}>
                <Picker data={this.state.pickerData}
                        cols={1}
                        className="forss"
                        value={this.state.asyncValue}
                        onPickerChange={this.onPickerChange}
                        onOk={v => this.viewCourseTableItemPage(v)}>
                    <List.Item arrow="horizontal">选择班级</List.Item>
                </Picker>
                <InputItem
                    placeholder="请输入标题"
                    clear
                    moneyKeyboardAlign="left"
                    value={this.state.title}
                    onChange={this.titleHandleChange}
                >输入标题</InputItem>
                <List>
                    <TextareaItem
                        title={"输入内容"}
                        placeholder={"请输入添加内容"}
                        rows={5}
                        count={100}
                        value={this.state.content}
                        onChange={this.contentHandleChange}
                    />
                </List>
                <div className="submitBtn">
                    <Button type="primary" onClick={this.submitClass}>提交</Button>
                </div>
            </div>
        );
    }
}
