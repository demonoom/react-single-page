import React from 'react';
import '../css/teachingSpaceTeacher.less'

export default class teachingSpaceStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS'
        };
    }

    componentDidMount() {
        try {
            Bridge.setRefreshAble("false");
        } catch (e) {
            console.log(e, 'teachingSpaceStudent');
        }
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

    /**
     * 跳转客户端
     */
    toClient = (method) => {
        var data = {
            method: method,
            ident: this.state.ident
        };
        if (method == "openNativePage_Errorbook_Stu") {
            data.href = 'http://jiaoxue.maaee.com:8094/#/topicWrongList?userId='
            // data.href = 'http://192.168.50.72:7094/#/topicWrongList?userId='
        }
        console.log(data, "data")
        Bridge.callHandler(data, null, function (error) {
        });
    }

    cloudSchoolClassesStatistical = () => {
        var url = 'http://jiaoxue.maaee.com:8093/#/cloudSchoolClassesStatistical?access_user=' + this.state.ident
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    liveReview = () => {
        var url = 'http://jiaoxue.maaee.com:8093/#/liveReview?access_user=' + this.state.ident
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    inAndOutSchool = () => {
        var url = 'http://jiaoxue.maaee.com:8093/#/inAndOutSchool?access_user=' + this.state.ident
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {

        return (
            <div id="teachingSpaceTeacher">
                <div className="teacher-item">
                    <h1>课堂</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_TheSchoolClassroom_Stu")}>
                            <i className="Icon-teacher Icon-teacher-classroom"></i>
                            <div>班级课堂</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_LiveClass_Stu")}>
                            <i className="Icon-teacher Icon-teacher-live"></i>
                            <div>直播课堂</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_AntCloudClass_Stu")}>
                            <i className="Icon-teacher Icon-teacher-eSchool"></i>
                            <div>小蚂蚁云课堂</div>
                        </li>
                        <li onClick={this.cloudSchoolClassesStatistical}>
                            <i className="Icon-teacher Icon-student-ClassReview"></i>
                            <div>课堂回顾</div>
                        </li>
                        <li onClick={this.liveReview}>
                            <i className="Icon-teacher Icon-student-live"></i>
                            <div>直播回顾</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>作业/考试</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkToDo_Stu")}>
                            <i className="Icon-teacher Icon-teacher-homeworkCorrecting"></i>
                            <div>作业</div>
                        </li>
                        <li style={{ display: this.state.phone == "Android" ? "block" : "none" }}
                            onClick={this.toClient.bind(this, "openNativePage_MyTestPaper_Stu")}>
                            <i className="Icon-teacher Icon-teacher-testPaper"></i>
                            <div>考试</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkStatistics_Stu")}>
                            <i className="Icon-teacher Icon-teacher-homeworkStatistics"></i>
                            <div>作业统计</div>
                        </li>
                        <li
                            style={{ display: (this.state.phone == "Android" && (this.state.ident == 23991 || this.state.ident == 23993)) ? "block" : "none" }}
                            onClick={this.toClient.bind(this, "openNativePage_Errorbook_Stu")}>
                            <i className="Icon-teacher Icon-teacher-wrongBook"></i>
                            <div>错题本</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>学习资源</h1>
                    <ul className="my_flex teacherUl">
                        <li style={{ display: this.state.phone == "Android" ? "block" : "none" }}
                            onClick={this.toClient.bind(this, "openNativePage_DoExercises_Stu")}>
                            <i className="Icon-teacher Icon-teacher-questionBank"></i>
                            <div>玩转习题</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_ResourceLibrary_Stu")}>
                            <i className="Icon-teacher Icon-teacher-repository"></i>
                            <div>资源库</div>
                        </li>
                        <li style={{ display: this.state.phone == "Android" ? "block" : "none" }}
                            onClick={this.toClient.bind(this, "openNativePage_FamousTeacherSpace_Stu")}>
                            <i className="Icon-teacher Icon-teacher-famousTeacher"></i>
                            <div>名师空间</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>更多</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_QuestionnaireSurvey_Stu")}>
                            <i className="Icon-teacher Icon-student-Survey"></i>
                            <div>问卷调查</div>
                        </li>
                        <li style={{ display: "none" }}
                            onClick={this.inAndOutSchool}>
                            <i className="Icon-teacher Icon-student-turnover"></i>
                            <div>出入校统计</div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
