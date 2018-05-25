import React from 'react';
import {List, Picker, InputItem, TextareaItem, Button, WhiteSpace, Toast} from 'antd-mobile';
import '../css/notify.less'

var calm;

export default class addNotify extends React.Component {

    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            pickerData: [],  //选择项容器
            asyncValue: [],
            title: '',
            content: '',
            classroomId: ''  //所选班级id
        };
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("&")[0].split('=')[1];
        this.setState({ident});
    }

    componentDidMount() {
        document.title = "通知列表";
        // this.getClazzesByUserId();
    }
    getClassRoomId(){
        var _this = this;
        //获取班级选择项
        var param = {
            "method": 'viewClassRoomPage',
            "uid": calm.state.ident,
            "pn":1
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
                        calm.setState({pickerData: arr});
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
            classroomId: asyncValue[0],
        });

        
    };

    //提交
    submitClass = () => {
        let warn = '', classInfo = this.state;
        var _this = this;
        if (classInfo.classroomId == '') {
            warn = '请选择班级';
        } else if (classInfo.title == '') {
            warn = '请输入标题'
        } else if (classInfo.content == '') {
            warn = '请输入内容'
        }

        if (warn == '') {
            // 通过验证,开始提交
            let classObject = {
                uid:calm.state.ident,
                noticeContent:classInfo.content,
                classroomId:classInfo.classroomId,
                noticeTitle:classInfo.title,
                type:1
            };
            var param = {
                "method": 'saveClassBrandNotice',
                "classBrandNoticeJson": classObject,
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: (result) => {
                    if (result.msg == '调用成功' || result.success == true) {
                        Toast.success('调用成功', 1);
                        var data = {
                            method: 'finishForRefresh',
                        };
                        Bridge.callHandler(data, null, function (error) {
                            console.log(error);
                        });
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
                <WhiteSpace size="lg"/>
                <Picker data={this.state.pickerData}
                        cols={1}
                        className="forss"
                        value={this.state.asyncValue}
                        onPickerChange={this.onPickerChange}
                        onOk={v => this.viewCourseTableItemPage(v)}>
                    <List.Item arrow="horizontal" onClick={this.getClassRoomId}>选择教室</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <InputItem
                    placeholder="请输入标题"
                    clear
                    moneyKeyboardAlign="left"
                    value={this.state.title}
                    onChange={this.titleHandleChange}
                >输入标题</InputItem>
                <WhiteSpace size="lg"/>
                <List>
                    <div className="import_title">输入内容</div>
                    <TextareaItem
                        title={""}
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
