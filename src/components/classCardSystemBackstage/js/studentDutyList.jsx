import React from 'react';
import {Picker, List, WhiteSpace, Grid, Button, Icon} from 'antd-mobile';
import '../css/studentDutyList.less'

const seasons = [
    []
];

/**
 * 值日生查询页
 */
export default class studentDutyList extends React.Component {

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
            pickerValue: [],
            asyncValue: ['1'],
            sValue: [],
            visible: false,
            studentList: [],
            clazzId: '',
            week: '1',
            editButtonDisabled:true
        };
        this.getClassBrandStudentDuty = this.getClassBrandStudentDuty.bind(this);
        this.getClazzesByUserId = this.getClazzesByUserId.bind(this);
    }

    componentDidMount(){
        document.title = '值日表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var userId = locationSearchArray[0].split("=")[1];
        this.getClazzesByUserId(userId);
        this.setState({userId});
    }

    /**
     * 星期改变时查询当前星期对应的值日生列表
     * @param val
     */
    onWeekPickerChange = (val) => {
        const d = [...this.state.data];
        const asyncValue = [...val];
        var week = val[0];

        this.setState({
            data: d,
            cols: 1,
            asyncValue,
            week
        });
        this.getClassBrandStudentDuty(this.state.clazzId, week);
    };

    /**
     * 获取班级值日生的列表
     * @param clazzId 班级id
     * @param week 星期
     */
    getClassBrandStudentDuty(clazzId, week) {
        var _this = this;
        var param = {
            "method": 'getClassBrandStudentDuty',
            "clazzId": clazzId,
            "week": week
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var studentList = [];
                var studentIdList=[];
                var dutyId = -1;
                var editButtonDisabled = true;
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            _this.setState({"isLoadingLeft": false})
                        } else {
                            var clazzObj = result.response;
                            dutyId = clazzObj.id;
                            var users = clazzObj.users;
                            editButtonDisabled = false;
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
                _this.setState({studentList,studentIdList,dutyId,editButtonDisabled});
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
                                value: clazzId+"",
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
     * 班级选项改变的响应函数
     * 切换班级时，查询当前班级对应条件下的值日生
     * @param val
     */
    onClassChange = (val) => {
        var clazzId = val[0];
        this.setState({sValue: val, clazzId});
        this.getClassBrandStudentDuty(clazzId, this.state.week);
    };

    /**
     * 修改班级的值日信息
     * 需要将当前页面的查询数据传递到下个页面，然后构建修改页面的数据
     */
    editStudentDuty=()=>{
        var studentIdStr = this.state.studentIdList.join(",");
        var editStudentDutyUrl = WebServiceUtil.mobileServiceURL + "editStudentDuty";
        editStudentDutyUrl+="?clazzId="+this.state.clazzId+"&week="+this.state.week+"&studentIds="+studentIdStr+"&dutyId="+this.state.dutyId+"&access_user="+this.state.userId;
        location.href = editStudentDutyUrl;

        var data = {
            method: 'openNewPage',
            url: editStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    /**
     * 跳转到添加值日生的页面
     */
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

    render() {
        var _this = this;
        return (
            <div id="studentDutyList" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                <Picker
                    data={seasons}
                    title="请选择"
                    cascade={false}
                    value={this.state.sValue}
                    onOk={v => this.onClassChange(v)}
                >
                    <List.Item arrow="horizontal">班级名称 学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onOk={v => this.onWeekPickerChange(v)}
                >
                    <List.Item arrow="horizontal" onClick={this.onClick}>选择星期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <div className="dutyList">
                    <div className="planTitle">
                        <span>值日安排</span>
                        <Button type="primary" inline size="small" className="am-button-borderfix modifyBtn" disabled={this.state.editButtonDisabled} onClick={this.editStudentDuty}>修改</Button>
                    </div>
                    <Grid data={_this.state.studentList} columnNum={3} activeStyle={false}/>
                    <div className="addBunton"><Icon type="plus" onClick={this.turnToAddDutyPage}/></div>
                </div>
            </div>
        );
    }
}
