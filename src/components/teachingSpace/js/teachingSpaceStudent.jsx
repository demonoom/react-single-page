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
            this.setState({phone: 'IOS'})
        } else {
            this.setState({phone: 'Android'})
        }
        this.applicationCacheChange()
    }

    /**
     * 更新离线数据缓存
     * 此页面设置为离线缓存页面,当内容更新时触发此方法可避免两次才能更新页面的问题
     */
    applicationCacheChange = () => {
        // Check if a new cache is available on page load.

        window.applicationCache.addEventListener('updateready', function (e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                window.applicationCache.swapCache();
                setTimeout(function () {
                    window.location.reload();
                }, 500)
            } else {

            }
        }, false);
    }

    /**
     * 跳转客户端
     */
    toClient = (method) => {
        var data = {
            method: method,
            ident: this.state.ident
        };
        console.log(data, "data")
        Bridge.callHandler(data, null, function (error) {
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
                        <li onClick={this.toClient.bind(this, "openNativePage_ClassReview_Stu")}>
                            <i className="Icon-teacher Icon-student-ClassReview"></i>
                            <div>课堂回顾</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_LiveReview_Stu")}>
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
                        <li style={{display: this.state.phone == "Android" ? "block" : "none"}}
                            onClick={this.toClient.bind(this, "openNativePage_MyTestPaper_Stu")}>
                            <i className="Icon-teacher Icon-teacher-testPaper"></i>
                            <div>考试</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkStatistics_Stu")}>
                            <i className="Icon-teacher Icon-teacher-homeworkStatistics"></i>
                            <div>作业统计</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>学习资源</h1>
                    <ul className="my_flex teacherUl">
                        <li style={{display: this.state.phone == "Android" ? "block" : "none"}}
                            onClick={this.toClient.bind(this, "openNativePage_DoExercises_Stu")}>
                            <i className="Icon-teacher Icon-teacher-questionBank"></i>
                            <div>玩转习题</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_ResourceLibrary_Stu")}>
                            <i className="Icon-teacher Icon-teacher-repository"></i>
                            <div>资源库</div>
                        </li>
                        <li style={{display: this.state.phone == "Android" ? "block" : "none"}}
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
                        <li style={{display: this.state.phone == "Android" ? "block" : "none"}}
                            onClick={this.toClient.bind(this, "openNativePage_AdmissionStatistics_Stu")}>
                            <i className="Icon-teacher Icon-student-turnover"></i>
                            <div>出入校统计</div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
