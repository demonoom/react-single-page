import React from 'react';
import { Icon, Toast } from 'antd-mobile';
import '../css/classCardHomePageDoor.less'

export default class classCardHomePageDoor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        this.setState({ ident })
        this.getUserByAccount(ident)
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班牌系统'
    }

    getUserByAccount(ident) {
        var _this = this;
        var param = {
            "method": 'getUserByAccount',
            "account": 'te' + ident,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({ schoolId: result.response.schoolId })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 手环绑定
     */
    turnToRingBinding = () => {
        var url = WebServiceUtil.mobileServiceURL + "ringBinding?ident=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 课程表列表
     */
    turnToCurriculumSchedule = (type) => {
        var url = WebServiceUtil.mobileServiceURL + "getClassRoomList?ident=" + this.state.ident;

        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 教室管理页面
     */
    turnToClassroomManage = () => {
        var url = WebServiceUtil.mobileServiceURL + "classroomManage?uid=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 班级风采
     */
    turnToClassDemeanor = (type) => {

        var url;
        if (type == 1) {
            url = WebServiceUtil.mobileServiceURL + "classDemeanorList?ident=" + this.state.ident;
        } else {
            url = WebServiceUtil.mobileServiceURL + "classHonorList?ident=" + this.state.ident;
        }

        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 德育评价
     */
    turnToMoralEducation = () => {
        var url = WebServiceUtil.mobileServiceURL + "moralEducation?ident=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 通知后台
     */
    turnToNotifyBack = () => {
        var url = WebServiceUtil.mobileServiceURL + "notifyBack?access_user=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 班级值日表
     */
    turnToStudentDutyList = () => {
        var url = WebServiceUtil.mobileServiceURL + "clazzDutyList?access_user=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 课堂预警
     */
    turnToWarnList = () => {
        var url = WebServiceUtil.mobileServiceURL + "warnList?userId=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 学生运动轨迹
     */
    turnToStudentMovement = () => {
        var url = WebServiceUtil.mobileServiceURL + "studentMovement?userId=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    turnWarningAdminList = () => {
        var url = WebServiceUtil.mobileServiceURL + "warningAdminList?schoolId=" + this.state.schoolId + "&userId=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    toAttendanceStatistical = () => {
        var url = WebServiceUtil.mobileServiceURL + "attendanceStatistical?schoolId=" + this.state.schoolId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    toAttendanceSatisticaForClass = () => {
        var url = WebServiceUtil.mobileServiceURL + "attendanceSatisticaForClass?schoolId=" + this.state.schoolId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    
    /**
     * 考勤时段设置
     */
    turnToAttendanceTime = () => {
        var url = WebServiceUtil.mobileServiceURL + "attendanceTime?uid="+ this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    
    }
    /**
     * 半拍皮肤设置
     */
    turnToSetSkin = () => {
        var url = WebServiceUtil.mobileServiceURL + "classBrandTemplateSkin?uid="+ this.state.schoolId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    
    }

    render() {
        return (
            <div id="classCardHomePageDoor" style={{height: document.body.clientHeight , overflow: 'auto'}}>
                <ul className="classCardHomePageDoor my_flex">
                    <li onClick={this.turnToClassroomManage}><i className="icon icon_ClassroomManagement"></i><div>教室管理</div></li>
                    <li onClick={this.turnToRingBinding}><i className="icon icon_bracelet"></i><div>手环/班牌绑定管理</div></li>
                    <li onClick={this.turnToCurriculumSchedule.bind(this, 1)}><i
                        className="icon icon_course"></i><div>课程表管理</div></li>
                    <li onClick={this.turnToNotifyBack}><i className="icon icon_notify"></i><div>通知管理</div></li>
                    {/*<li onClick={this.turnToCurriculumSchedule.bind(this, 2)}><i className="icon icon_publiCourse"></i><div>公共教室课程表</div></li>*/}
                    <li onClick={this.turnToClassDemeanor.bind(this, 1)}><i className="icon icon_classDemeanor"></i><div>班级风采管理</div></li>
                    <li onClick={this.turnToClassDemeanor.bind(this, 2)}><i className="icon icon_honor"></i><div>班级荣誉管理</div></li>
                    <li onClick={this.turnToStudentDutyList}><i className="icon icon_studentOnDuty"></i><div>班级值日表管理</div></li>
                    <li onClick={this.turnToMoralEducation}><i className="icon icon_moralEducationScore"></i><div>德育评价管理</div></li>
                    {/*<li onClick={this.turnToWarnList}><i className="icon icon_earlyWarning"></i><div>课堂预警</div></li>
                    <li onClick={this.turnToStudentMovement}><i className="icon icon_exercise"></i><div>学生运动轨迹</div></li>*/}
                    <li onClick={this.turnWarningAdminList}><i className="icon icon_warning"></i><div>预警人员管理</div></li>
                    <li onClick={this.turnToAttendanceTime}><i className="icon icon_attendanceTime"></i><div>考勤时段设置</div></li>
                    {/*<li onClick={this.toAttendanceStatistical}><i className="icon icon_moralEducationScore"></i><div>出勤率统计(饼图)</div></li>
                    <li onClick={this.toAttendanceSatisticaForClass}><i className="icon icon_moralEducationScore"></i><div>出勤率统计(柱状图)</div></li>*/}
                    <li onClick={this.turnToSetSkin}><i className="icon icon_attendanceTime"></i><div>班牌皮肤设置</div></li>
                </ul>
            </div>
        );
    }
}




