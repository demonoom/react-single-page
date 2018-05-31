import React from 'react';
import {Icon} from 'antd-mobile';
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
        this.setState({ident})
    }

    componentDidMount() {
        document.title = '班牌系统'
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
        var url = WebServiceUtil.mobileServiceURL + "curriculumSchedule?ident=" + this.state.ident + "&curriculumType=" + type;

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

    render() {
        return (
            <div id="classCardHomePageDoor" style={{height: document.body.clientHeight}}>
                <ul className="classCardHomePageDoor">
                    <li onClick={this.turnToClassroomManage}><i className="icon icon_ClassroomManagement"></i>教室管理<i className="arrow_right"></i></li>
                    <li onClick={this.turnToRingBinding}><i className="icon icon_bracelet"></i>手环/班牌绑定管理<i className="arrow_right"></i></li>
                    <li onClick={this.turnToCurriculumSchedule.bind(this, 1)}><i className="icon icon_course"></i>课程表管理<i className="arrow_right"></i></li>
                    {/*<li onClick={this.turnToCurriculumSchedule.bind(this, 2)}><i className="icon icon_publiCourse"></i>公共教室课程表<i className="arrow_right"></i></li>*/}
                    <li onClick={this.turnToNotifyBack}><i className="icon icon_notify"></i>通知管理<i className="arrow_right"></i></li>
                    <li onClick={this.turnToClassDemeanor.bind(this, 1)}><i className="icon icon_classDemeanor"></i>班级风采管理<i className="arrow_right"></i></li>
                    <li onClick={this.turnToClassDemeanor.bind(this, 2)}><i className="icon icon_honor"></i>班级荣誉管理<i className="arrow_right"></i></li>
                    <li onClick={this.turnToStudentDutyList}><i className="icon icon_studentOnDuty"></i>班级值日表管理<i className="arrow_right"></i></li>
                    <li onClick={this.turnToMoralEducation}><i className="icon icon_moralEducationScore"></i>德育评价管理<i className="arrow_right"></i></li>
                </ul>
            </div>
        );
    }
}




