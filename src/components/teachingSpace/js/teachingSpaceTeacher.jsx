import React from 'react';

export default class teachingSpaceTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS'
        };
    }

    /**
     * 跳转客户端
     */
    toClient = (method) => {
        var data = {
            method: method,
            ident: this.state.ident
        };
        console.log(data,"data")
        Bridge.callHandler(data, null, function (error) {
        });
    }

    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var ident = decodeURI(locationSearchArray[0].split("=")[1]);
        this.setState({
            ident
        })
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({ phone: 'IOS' })
        } else {
            this.setState({ phone: 'Android' })
        }
    }
    render() {
        return (
            <div id="teachingSpaceTeacher">
                <div>
                    常用
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_Approval")}>审批</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_Attendance")}>考勤</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_AntPlate")}>蚁盘</span>
                    </div>
                </div>
                <div>
                    开启课堂
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_OpenClassRoom")}>开启班级课堂</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_OpenLiveBroadcast")} >开启直播</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_OpenCloudClass")}>开启云课堂</span>
                    </div>
                </div>
                <div>
                    课前准备
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_LessonPlan")}>备课计划</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_ResourceLibrary")}>资源库</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_TopicLibrary")}>题库</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_Examine")}>调查</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_BraceletOutdoorHelper")}>手环户外助手</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_FamousTeacherSpace")}
                            style={{ display: this.state.phone == "Android" ? "block" : "none" }}>名师空间</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_RecordingVideo")}
                            style={{ display: this.state.phone == "Android" ? "block" : "none" }}>录制课件视频</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_MicroClassRecord")}>录制微课</span>
                    </div>
                </div>
                <div>
                    数据中心
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_ClassReview")} >课堂回顾统计</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_RingDataStatistics")} >手环数据统计</span>
                    </div>
                </div>
                <div>
                    作业
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_HomeworkAssignment")}>布置作业</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_HomeworkStatistics")}>作业统计</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_HomeworkFaceStatistics")}>作业表情统计</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_HomeworkCorrecting")}
                            style={{ display: this.state.phone == "Android" ? "block" : "none" }}>批改作业</span>
                    </div>
                </div>
                <div style={{ display: this.state.phone == "Android" ? "block" : "none" }}>
                    考试系统
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_TestPaper")}>组卷</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_Examination")}>考试</span>
                    </div>
                </div>
                <div>
                    其它
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_EducationalAdministration")} >教务管理</span>
                    </div>
                </div>
            </div>
        );
    }
}
