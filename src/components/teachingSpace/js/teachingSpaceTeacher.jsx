import React from 'react';
import '../css/teachingSpaceTeacher.less'
export default class teachingSpaceTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS'
        };
    }
    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var ident = decodeURI(locationSearchArray[0].split("=")[1]);
        this.setState({
            ident
        })
        this.getUserById(ident)
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({ phone: 'IOS' })
        } else {
            this.setState({ phone: 'Android' })
        }
    }
    /**
     * 获取用户信息
     */
    getUserById(ident) {
        var _this = this;
        var param = {
            "method": 'getUserById',
            "ident": ident,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({
                        schoolId:result.response.schoolId
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
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

    /**
     * 跳转网页
     */
    toPage=(type)=>{
        var url;
        // 回顾页面
        if(type == "ReviewStatistics"){
            url = "http://jiaoxue.maaee.com:8093/#/cloudSchoolClassesStatistical?ident="+this.state.ident

        }else if(type == "Approval"){
            // 审批页面
            url = "http://www.maaee.com:80/Excoord_PhoneService/flowGroup/getAllFlowGroupBySchoolId/"+this.state.schoolId+"/"+this.state.ident

        }else if (type == "Attendance"){
            // 考勤页面
            url = "http://jiaoxue.maaee.com:8093/#/cloudSchoolClassesStatistical?ident="+this.state.ident

        }
        var data = {
            method: "openNewPage",
            url: url
        };
        console.log(data,"data")
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    
    render() {
        return (
            <div id="teachingSpaceTeacher">
                <div className="teacher-item">
                    <h1>常用</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toPage.bind(this, "Approval")}>
                            <i className="Icon-teacher Icon-teacher-approval"></i>
                            <div>审批</div>
                        </li>
                        <li onClick={this.toPage.bind(this, "Attendance")} >考勤</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_AntPlate")}>蚁盘</li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>开启课堂</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_OpenClassRoom")}>开启班级课堂</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_OpenLiveBroadcast")} >开启直播</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_OpenCloudClass")}>开启云课堂</li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>课前准备</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_LessonPlan")}>备课计划</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_ResourceLibrary")}>资源库</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_TopicLibrary")}>题库</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_Examine")}>调查</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_BraceletOutdoorHelper")}>手环户外助手</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_FamousTeacherSpace")}
                            style={{ display: this.state.phone == "Android" ? "block" : "none" }}>名师空间</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_RecordingVideo")}
                            style={{ display: this.state.phone == "Android" ? "block" : "none" }}>录制微课</li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>数据中心</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toPage.bind(this, "ReviewStatistics")}  >课堂回顾统计</li>
                        <li style={{ display: this.state.phone == "Android" ? "block" : "none" }} 
                        onClick={this.toClient.bind(this, "openNativePage_RingDataStatistics")} >手环数据统计</li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>作业</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkAssignment")}>布置作业</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkStatistics")}>作业统计</li>
                        <li style={{ display: this.state.phone == "Android" ? "block" : "none" }} 
                        onClick={this.toClient.bind(this, "openNativePage_HomeworkFaceStatistics")}>作业表情统计</li>
                        <li  style={{ display: this.state.phone == "Android" ? "block" : "none" }}
                        onClick={this.toClient.bind(this, "openNativePage_HomeworkCorrecting")}
                            style={{ display: this.state.phone == "Android" ? "block" : "none" }}>批改作业</li>
                    </ul>
                </div>
                <div className="teacher-item" style={{ display: this.state.phone == "Android" ? "block" : "none" }}>
                    <h1>考试系统</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_TestPaper")}>组卷</li>
                        <li onClick={this.toClient.bind(this, "openNativePage_Examination")}>考试</li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>其它</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_EducationalAdministration")} >教务管理</li>
                    </ul>
                </div>
            </div>
        );
    }
}
