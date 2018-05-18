import React from 'react';
import {Picker, List, WhiteSpace, Grid, Button, Icon} from 'antd-mobile';
import '../css/studentDutyList.less'

const seasons = [
    [],
    []
];

export default class studentDutyList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cols: 1,
            pickerValue: [],
            asyncValue: ['1'],
            sValue: [],
            visible: false,
            studentList: [],
            clazzId: '14',
            week: '1',
            termId: '1'
        };
        this.getClassBrandStudentDuty = this.getClassBrandStudentDuty.bind(this);
        this.getClazzesByUserId = this.getClazzesByUserId.bind(this);
        this.getSemesterList = this.getSemesterList.bind(this);
    }

    componentDidMount(){
        document.title = '值日表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var userId = locationSearchArray[0].split("=")[1];
        this.getClazzesByUserId(userId);
        this.getSemesterList(userId);
        this.setState({userId});
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
        console.log("week:" + val);
        const d = [...this.state.data];
        const asyncValue = [...val];
        var week = val[0];

        this.setState({
            data: d,
            cols: 1,
            asyncValue,
            week
        });
        this.getClassBrandStudentDuty(this.state.clazzId, week, this.state.termId);
    };

    turnToAddDutyPage = () => {
        var addStudentDutyUrl = WebServiceUtil.mobileServiceURL + "addStudentDuty?access_user="+this.state.userId;
        location.href = addStudentDutyUrl;
        /*var data = {
            method: 'openNewPage',
            url: addStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });*/
    }

    getClassBrandStudentDuty(clazzId, week, termId) {
        var _this = this;
        var param = {
            "method": 'getClassBrandStudentDuty',
            "clazzId": clazzId,
            "week": week,
            "termId": termId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var studentList = [];
                var studentIdList=[];
                var dutyId = -1;
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            _this.setState({"isLoadingLeft": false})
                        } else {
                            var clazzObj = result.response;
                            console.log(clazzObj);
                            dutyId = clazzObj.id;
                            var users = clazzObj.users;

                            users.forEach(function (student) {
                                if (student != null && student != undefined) {
                                    var stuId = student.colUid;
                                    var stuName = student.userName;
                                    var icon = student.avatar;
                                    var stuJson = {text: stuName, icon};
                                    studentList.push(stuJson)
                                    studentIdList.push(stuId);
                                }
                            })
                        }
                    }
                }
                _this.setState({studentList,studentIdList,dutyId});
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 进入学生值日页面时，根据用户id获取当前用户的班级
     * @param userId
     */
    getClazzesByUserId(userId){
        var _this = this;
        var param = {
            "method": 'getClazzesByUserId',
            "userId": userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var studentList = [];
                var studentIdList=[];
                var dutyId = -1;
                console.log(result);
                // seasons[0].splice(0);
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        response.forEach(function (clazz) {
                            var clazzId = clazz.id;
                            //班级
                            var clazzName = clazz.name;
                            //年级
                            var grade = clazz.grade;
                            var gradeName = grade.name;
                            var clazzJson = {
                                label: gradeName+clazzName,
                                // value: clazzId+"",
                                value: 14+"",
                            };
                            if(seasons[0]!=null && seasons[0]!=undefined){
                                seasons[0].push(clazzJson);
                            }
                        })

                    }
                }
                _this.setState({studentList,studentIdList,dutyId});
            },
            onError: function (error) {
            }
        });
    }


    /**
     * 进入学生值日页面时，根据用户id获取当前用户的班级
     * @param userId
     */
    getSemesterList(userId){
        var _this = this;
        var param = {
            "method": 'getSemesterList',
            "uid": userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    console.log(response);
                    if (response != null && response != undefined) {
                        response.forEach(function (term) {
                            var id = term.id;
                            var name = term.name;
                            var termJson = {
                                label: name,
                                value: id+"",
                            };
                            if(seasons[1]!=null && seasons[1]!=undefined){
                                seasons[1].push(termJson);
                            }
                        })

                    }
                }
                _this.setState({seasons});
            },
            onError: function (error) {
            }
        });
    }


    onClassChange = (val) => {
        var clazzId = val[0];
        var termId = val[1];
        this.setState({sValue: val, clazzId, termId});
        this.getClassBrandStudentDuty(clazzId, this.state.week, termId);
    };

    /**
     * 修改班级的值日信息
     * 需要将当前页面的查询数据传递到下个页面，然后构建修改页面的数据
     */
    editStudentDuty=()=>{
        var studentIdStr = this.state.studentIdList.join(",");
        var editStudentDutyUrl = WebServiceUtil.mobileServiceURL + "editStudentDuty";
        editStudentDutyUrl+="?clazzId="+this.state.clazzId+"&termId="+this.state.termId+"&week="+this.state.week+"&studentIds="+studentIdStr+"&dutyId="+this.state.dutyId+"&access_user="+this.state.userId;
        location.href = editStudentDutyUrl;

        /*var data = {
            method: 'openNewPage',
            url: editStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });*/
    };

    render() {
        console.log(1);
        var _this = this;
        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                <Picker
                    data={seasons}
                    title="请选择"
                    cascade={false}
                    value={this.state.sValue}
                    onOk={v => this.onClassChange(v)}
                >
                    <List.Item arrow="horizontal">班级</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onOk={v => this.onPickerChange(v)}
                >
                    <List.Item arrow="horizontal" onClick={this.onClick}>日期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <Button type="primary" inline size="small" className="am-button-borderfix" onClick={this.editStudentDuty}>修改</Button>
                <Grid data={_this.state.studentList} columnNum={3} activeStyle={false}/>
                <Icon type="plus" onClick={this.turnToAddDutyPage}/>
            </div>
        );
    }
}
