import React from 'react';

export default class teachingSpaceStudent extends React.Component {
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
        console.log(data,"data")
        Bridge.callHandler(data, null, function (error) {
        });
    }
    render() {

        return (
            <div id="teachingSpaceStudent">
                  <div>
                    课堂
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_TheSchoolClassroom_Stu")}>本校课堂</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_LiveClass_Stu")}>直播课堂</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_AntCloudClass_Stu")}>小蚂蚁云课堂</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_ClassReview_Stu")}>课堂回顾</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_LiveReview_Stu")}>直播回顾</span>
                    </div>
                </div>
                  <div>
                    考试作业
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_HomeworkToDo_Stu")}>待做作业</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_MyTestPaper_Stu")}>我的试卷</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_HomeworkStatistics_Stu")}>作业统计</span>
                    </div>
                </div>
                  <div>
                    学习资源
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_DoExercises_Stu")}>玩转习题</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_ResourceLibrary_Stu")}>资源库</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_FamousTeacherSpace_Stu")}>名师空间</span>
                    </div>
                </div>
                  <div>
                    更多
                    <div>
                        <span onClick={this.toClient.bind(this, "openNativePage_QuestionnaireSurvey_Stu")}>问卷调查</span>
                        <span onClick={this.toClient.bind(this, "openNativePage_AdmissionStatistics_Stu")}>出入校统计</span>
                    </div>
                </div>
            </div>
        );
    }
}
