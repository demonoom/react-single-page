import React from 'react';
import {} from 'antd-mobile';

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
            url = WebServiceUtil.mobileServiceURL + "classDemeanor?ident=" + this.state.ident;
        } else {
            url = WebServiceUtil.mobileServiceURL + "classHonor?ident=" + this.state.ident;
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
        var url = WebServiceUtil.mobileServiceURL + "studentDutyList?access_user=" + this.state.ident;
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
                <li style={{fontSize: '25px'}} onClick={this.turnToRingBinding}>手环绑定</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToCurriculumSchedule.bind(this, 1)}>课程表列表</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToCurriculumSchedule.bind(this, 2)}>公共教室课程表</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToClassroomManage}>教室管理页面</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToClassDemeanor.bind(this, 1)}>班级风采</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToClassDemeanor.bind(this, 2)}>班级荣誉</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToMoralEducation}>德育评价</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToNotifyBack}>通知后台</li>
                <li style={{fontSize: '25px'}} onClick={this.turnToStudentDutyList}>班级值日表</li>
            </div>
        );
    }
}




