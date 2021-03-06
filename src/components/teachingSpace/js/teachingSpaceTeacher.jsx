import React from 'react';
import {Toast} from 'antd-mobile';
import {SimpleWebsocketConnection} from '../../../helpers/simple_websocket_connection';

import '../css/teachingSpaceTeacher.less'

window.simpleMS = null;
export default class teachingSpaceTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS',
            classTeacher: false,
        };
    }

    componentWillMount() {
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount() {
        try {
            Bridge.setRefreshAble("false");
        } catch (e) {
            console.log(e);
        }
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var ident = decodeURI(locationSearchArray[0].split("=")[1]);
        // var pwd = decodeURI(locationSearchArray[1].split("=")[1]);
        this.setState({
            ident,
            // pwd
        })
        this.getUserById(ident)
        this.getStructureRoleUserByUserId(ident)
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({phone: 'IOS'})
        } else {
            this.setState({phone: 'Android'})
        }


        this.simpleListener()
    }

    simpleListener = () => {
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: (info) => {
                console.log(info, "info")
            }
        };
    }

    /**
     * 获取该用户下的用户角色
     * public List<StructureRoleUser>  getStructureRoleUserByUserId(String userId)
     * @param ident
     */
    getStructureRoleUserByUserId = (ident) => {
        var _this = this;
        var param = {
            "method": 'getStructureRoleUserByUserId',
            "userId": ident,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var res = result.response.filter((e) => {
                        return e.type == 6
                    })

                    if (res.length !== 0) {
                        _this.setState({classTeacher: true})
                    }

                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
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
                        schoolId: result.response.schoolId
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
        if (method == "openNativePage_RealBooth") {
            var obj = {
                "command": "open_zhaitan_click",
                "data": {
                    "userId": this.state.ident
                }
            }
            console.log("sendObj", obj);
            simpleMS.send(obj);
            var data = {
                method: "local_class_open_zhaitan",
                vid: this.state.ident
            };
            // alert(JSON.stringify(data))
            console.log(data, "data")
            Bridge.callHandler(data, null, function (error) {

            });
        } else if (method == 'openNativePage_ARTextbook') {
            var obj = {
                "command": "arsyc_play_inited",
                "data": {
                    "userId": this.state.ident
                }
            }
            simpleMS.send(obj);
            var data = {
                method: method,
                vid: this.state.ident
            };
            Bridge.callHandler(data, null, function (error) {

            });
        } else {
            var data = {
                method: method,
                ident: this.state.ident
            };

            console.log(data, "data")
            Bridge.callHandler(data, null, function (error) {

            });
        }
    }
    /**
     * 跳转网页
     */
    toPage = (type) => {
        var url;
        // 回顾页面
        if (type == "ReviewStatistics") {
            url = "https://jiaoxue.maaee.com:9093/#/cloudSchoolClassesStatistical?ident=" + this.state.ident + "&judgelag=1"
            // url = "http://192.168.43.169:7093/#/cloudSchoolClassesStatistical?ident=" + this.state.ident+"&judgelag=1"
        } else if (type == "Approval") {
            // 审批页面
            url = "http://www.maaee.com:80/Excoord_PhoneService/flowGroup/getAllFlowGroupBySchoolId/" + this.state.schoolId + "/" + this.state.ident
        } else if (type == "Attendance") {
            // 考勤页面
            url = "https://www.maaee.com/Excoord_PhoneService/attendance/recordCard/" + this.state.ident
        } else if (type == "HomeworkFaceStatistics") {
            // 作业表情分析
            url = "https://jiaoxue.maaee.com:9093/#/HomeWorkUnderstandAnalysisGuideByNoom?access_user=" + this.state.ident
        } else if (type == "openNativePage_RingDataStatistics") {
            url = "https://jiaoxue.maaee.com:9093/#/analysisHomePage"
        } else if (type == "honorManage") {
            //  荣誉管理
            Toast.info('请在浏览器中的小蚂蚁教师端完成该功能', 3)
            return
            // var phoneType = navigator.userAgent;
            // if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1 || phoneType.indexOf('Android') > -1) {
            //     Toast.info('请在浏览器中的小蚂蚁教师端完成该功能', 3)
            //     return
            // }
        } else if (type == "demeanorManage") {
            //  风采管理
            Toast.info('请在浏览器中的小蚂蚁教师端完成该功能', 3)
            return
            // var phoneType = navigator.userAgent;
            // if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1 || phoneType.indexOf('Android') > -1) {
            //     Toast.info('请在浏览器中的小蚂蚁教师端完成该功能', 3)
            //     return
            // }
        } else if (type == "dutyManage") {
            //  值日管理
            url = "https://jiaoxue.maaee.com:9091/#/clazzDutyList?access_user=" + this.state.ident
            // url = "https://192.168.50.29:9091/#/clazzDutyList?access_user=" + this.state.ident
        } else if (type == "notifyManage") {
            //  通知管理
            url = "https://jiaoxue.maaee.com:9091/#/notifyBack?access_user=" + this.state.ident
            // url = "https://192.168.50.29:9091/#/notifyBack?access_user=" + this.state.ident
        } else if (type = "Errorbook") {
            url = 'http://jiaoxue.maaee.com:8094/#/wrongQuestionList?userId=' + this.state.ident
            // url = 'http://192.168.50.72:7094/#/wrongQuestionList?uid='+this.state.ident
        }
        var data = {
            method: "openNewPage",
            url: url
        };
        // console.log(data, "data1111");
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
                        <li onClick={this.toPage.bind(this, "Attendance")}>
                            <i className="Icon-teacher Icon-teacher-attendance"></i>
                            <div>考勤</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_AntPlate")}>
                            <i className="Icon-teacher Icon-teacher-antDisk"></i>
                            <div>蚁盘</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>开启课堂</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_OpenClassRoom")}>
                            <i className="Icon-teacher Icon-teacher-classroom"></i>
                            <div>开启班级课堂</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_OpenLiveBroadcast")}>
                            <i className="Icon-teacher Icon-teacher-live"></i>
                            <div>开启直播</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_OpenCloudClass")}>
                            <i className="Icon-teacher Icon-teacher-eSchool"></i>
                            <div>开启云课堂</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_RealBooth")}>
                            <i className="Icon-teacher Icon-teacher-shiwu"></i>
                            <div>实物展台</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_ARTextbook")}>
                            <i className="Icon-teacher Icon-teacher-ARmaterial"></i>
                            <div>AR教材</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>课前准备</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_LessonPlan")}>
                            <i className="Icon-teacher Icon-teacher-plan"></i>
                            <div>备课计划</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_ResourceLibrary")}>
                            <i className="Icon-teacher Icon-teacher-repository"></i>
                            <div>资源库</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_TopicLibrary")}>
                            <i className="Icon-teacher Icon-teacher-questionBank"></i>
                            <div>题库</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_Examine")}>
                            <i className="Icon-teacher Icon-teacher-survey"></i>
                            <div>调查</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_BraceletOutdoorHelper")}>
                            <i className="Icon-teacher Icon-teacher-bracelet"></i>
                            <div>手环户外助手</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_FamousTeacherSpace")}
                            style={{display: this.state.phone == "Android" ? "block" : "none"}}>
                            <i className="Icon-teacher Icon-teacher-famousTeacher"></i>
                            <div>名师空间</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_MicroClassRecord")}
                            style={{display: this.state.phone == "Android" ? "block" : "none"}}>
                            <i className="Icon-teacher Icon-teacher-SmallClass"></i>
                            <div>录制微课</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>数据中心</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toPage.bind(this, "ReviewStatistics")}>
                            <i className="Icon-teacher Icon-teacher-ClassReview"></i>
                            <div>课堂回顾统计</div>
                        </li>
                        <li onClick={this.toPage.bind(this, "openNativePage_RingDataStatistics")}>
                            <i className="Icon-teacher Icon-teacher-braceletData"></i>
                            <div>物联校园数据统计中心</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>作业</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkAssignment")}>
                            <i className="Icon-teacher Icon-teacher-AssignHomework"></i>
                            <div>布置作业</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkStatistics")}>
                            <i className="Icon-teacher Icon-teacher-homeworkStatistics"></i>
                            <div>作业统计</div>
                        </li>
                        <li onClick={this.toPage.bind(this, "HomeworkFaceStatistics")}>
                            <i className="Icon-teacher Icon-teacher-expression"></i>
                            <div>作业表情统计</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_HomeworkCorrecting")}
                            style={{display: this.state.phone == "Android" ? "block" : "none"}}>
                            <i className="Icon-teacher Icon-teacher-homeworkCorrecting"></i>
                            <div>批改作业</div>
                        </li>
                        <li
                            onClick={this.toPage.bind(this, "Errorbook")}>
                            <i className="Icon-teacher Icon-teacher-wrongBook"></i>
                            <div>错题本</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item"
                     style={{display: this.state.phone == "Android" ? "block" : "none"}}
                >
                    <h1>考试系统</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_TestPaper")}>
                            <i className="Icon-teacher Icon-teacher-testPaper"></i>
                            <div>组卷</div>
                        </li>
                        <li onClick={this.toClient.bind(this, "openNativePage_Examination")}>
                            <i className="Icon-teacher Icon-teacher-examination"></i>
                            <div>考试</div>
                        </li>
                    </ul>
                </div>
                <div className="teacher-item">
                    <h1>其它</h1>
                    <ul className="my_flex teacherUl">
                        <li onClick={this.toClient.bind(this, "openNativePage_EducationalAdministration")}>
                            <i className="Icon-teacher Icon-teacher-EducationManage"></i>
                            <div>教务管理</div>
                        </li>
                        <li style={{display: this.state.classTeacher ? '' : 'none'}}
                            onClick={this.toPage.bind(this, "honorManage")}>
                            <i className="Icon-teacher Icon-teacher-honorManage"></i>
                            <div>班牌荣誉</div>
                        </li>
                        <li style={{display: this.state.classTeacher ? '' : 'none'}}
                            onClick={this.toPage.bind(this, "demeanorManage")}>
                            <i className="Icon-teacher Icon-teacher-demeanorManage"></i>
                            <div>班牌风采</div>
                        </li>

                        <li style={{display: this.state.classTeacher ? '' : 'none'}}
                            onClick={this.toPage.bind(this, "notifyManage")}>
                            <i className="Icon-teacher Icon-teacher-notifyManage"></i>
                            <div>班牌通知</div>
                        </li>

                        <li style={{display: this.state.classTeacher ? '' : 'none'}}
                            onClick={this.toPage.bind(this, "dutyManage")}>
                            <i className="Icon-teacher Icon-teacher-dutyManage"></i>
                            <div>班牌值日</div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
