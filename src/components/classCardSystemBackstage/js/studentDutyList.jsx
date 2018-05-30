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
        var weekOfTody = new Date().getDay();
        weekOfTody=(weekOfTody==0?7:weekOfTody);
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
            asyncValue: [weekOfTody+''],
            sValue: [],
            visible: false,
            studentList: [],
            clazzId: '',
            week: weekOfTody+'',
            editButtonDisabled: true
        };
        this.getClassBrandStudentDutyList = this.getClassBrandStudentDutyList.bind(this);
    }

    componentWillMount() {
        document.title = '班级值日详情页';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var clazzId = locationSearchArray[0].split("=")[1];
        this.getClassBrandStudentDutyList(clazzId);
        this.setState({clazzId});
    }

    /**
     * 查看指定班级的值日列表
     */
    getClassBrandStudentDutyList(clazzId,week,pageNo) {
        var _this = this;
        var param = {
            "method": 'getClassBrandStudentDutyList',
            "clazzId": clazzId,
            "week": week,
            "pageNo": pageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result.response);
                var dutyTagList = [];
                if (result.msg == '调用成功' && result.success == true) {
                    var studentDutyList = result.response;
                    console.log(studentDutyList);
                    studentDutyList.forEach(function (studentDuty) {
                        var dutyId = studentDuty.id;
                        var week = studentDuty.week;
                        var users = studentDuty.users;
                        var studentIdStr = "";
                        var studentList = [];
                        if(WebServiceUtil.isEmpty(users)==false){
                            users.forEach(function (user) {
                                var userId = user.colUid;
                                studentIdStr+=userId+",";
                                var userName = user.userName;
                                var avatar = user.avatar;
                                var stuJson = {text: userName, icon:avatar};
                                studentList.push(stuJson)
                            })
                        }

                        var dutyTag = <div>
                            <div className="planTitle">
                                <div className="top">
                                    <span>星期：{week}</span>
                                    <Button className="modifyBtn_common" type="primary" size="small" onClick={_this.editStudentDuty.bind(_this,week,studentIdStr,dutyId)}></Button>
                                    {/*<Button type="primary" size="small" onClick={_this.editStudentDuty}>修改</Button>*/}
                                    <Button type="primary" size="small" className="btn_del deleteBtn_common" onClick={_this.delStudentDuty.bind(_this,dutyId)}></Button>
                                </div>
                                <Grid data={studentList} columnNum={4} activeStyle={false}/>
                            </div>
                        </div>;
                        dutyTagList.push(dutyTag);
                    })
                }
                _this.setState({dutyTagList});
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 修改班级的值日信息
     * 需要将当前页面的查询数据传递到下个页面，然后构建修改页面的数据
     */
    editStudentDuty = (week,studentIdStr,dutyId) => {
        var studentIdStr = this.state.studentIdList.join(",");
        var editStudentDutyUrl = WebServiceUtil.mobileServiceURL + "editStudentDuty";
        editStudentDutyUrl += "?clazzId=" + this.state.clazzId + "&week=" + this.state.week + "&studentIds=" + studentIdStr + "&dutyId=" + this.state.dutyId + "&access_user=" + this.state.userId;
        location.href = editStudentDutyUrl;

        var data = {
            method: 'openNewPage',
            url: editStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    delStudentDuty=(delId)=>{
        var _this = this;
        var param = {
            "method": 'deleteStudentDuty',
            "id": delId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result.response);
                if (result.msg == '调用成功' && result.success == true) {
                    var result = result.response;
                    console.log(result);
                    if(result.msg == '调用成功' && result.success == true){
                        _this.getClassBrandStudentDutyList(_this.state.clazzId,'',-1);
                    }
                }
            },
            onError: function (error) {
            }
        });
    }
    /**
     * 跳转到添加值日生的页面
     */
    turnToAddDutyPage = () => {
        var addStudentDutyUrl = WebServiceUtil.mobileServiceURL + "addStudentDuty?access_user=" + this.state.userId;
        var data = {
            method: 'openNewPage',
            url: addStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = addStudentDutyUrl;
        });
    }

    render() {
        var _this = this;
        return (
            <div id="studentDutyList" style={{height: document.body.clientHeight}}>
                {_this.state.dutyTagList}
            </div>
        );
    }
}
