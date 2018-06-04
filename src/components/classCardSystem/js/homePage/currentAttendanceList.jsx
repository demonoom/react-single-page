import React from 'react';
import {} from 'antd-mobile';
import "../../css/homePage/currentAttendanceList.less"

var demeanor;
var timer;
var allStudents = [];
export default class currentAttendanceList extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
        this.getBraceletAttend = this.getBraceletAttend.bind(this);
        this.getStudentByCourseTableItem = this.getStudentByCourseTableItem.bind(this);
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var classTableId = searchArray[0].split('=')[1];
        this.setState({classTableId})
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        var classTableId = this.state.classTableId;
        this.getStudentByCourseTableItem(classTableId);
        this.openTimeInterVal(classTableId);
    }

    openTimeInterVal(classTableId) {
        //开启定时器获取实到人数
        timer = setInterval(function () {
            demeanor.getBraceletAttend(classTableId);
        }, 10000)
    }

    /**
     * 应到人数
     */
    getStudentByCourseTableItem(classTableId) {
        var _this = this;
        var param = {
            "method": 'getStudentByCourseTableItem',
            "id": classTableId
            // "id": 3
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    allStudents = result.response;
                    _this.setState({peopleNum: result.response.length});
                }
                _this.getBraceletAttend(classTableId);
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 获取手环考勤数据
     * 实到人数
     * @param data
     */
    getBraceletAttend(classTableId) {
        var _this = this;
        var param = {
            "method": 'getBraceletAttend',
            "cid": classTableId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({"currentPeopleNum": result.response.length});
                }
                _this.buildStudentList(response);
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 构建学生头像列表，其中要判断当前学生是否已签到
     * @param currentStudents
     */
    buildStudentList(currentStudents) {
        var _this = this;
        //应到人数
        // var allStudents = this.state.allStudents;
        var studentHeaderTagList = [];
        if (allStudents != null && allStudents != undefined) {
            allStudents.forEach(function (studentOfAll) {
                var colUid = studentOfAll.colUid;
                var isExist = _this.checkIsExistCurrentStudent(currentStudents, colUid);
                var checkedTip = "";
                var classFlag = "imgDiv";
                if (isExist === false) {
                    checkedTip = "未签到";
                    classFlag = "imgDiv no";
                }
                var studentAvatar = studentOfAll.avatar;
                if (studentAvatar == null || studentAvatar == undefined || studentAvatar == "") {
                    studentAvatar = "../../img/maaee_face.png";
                }
                var studentHeaderTag = <div className="photoItem">
                    <div className={classFlag}><img src={studentAvatar}/></div>
                    <img className="signIcon_green" hidden={!isExist} src={require('../../img/green_right_image.png')} alt="" />
                    <div className="signIcon" hidden={isExist}>{checkedTip}</div>
                    <div className="studentName">
                        {studentOfAll.userName}
                    </div>
                </div>
                studentHeaderTagList.push(studentHeaderTag);
            })
        }
        _this.setState({studentHeaderTagList});
    }

    /**
     * 检查当前学生是否在已签到的用户数组中
     */
    checkIsExistCurrentStudent(currentStudents, colUid) {
        var isExist = false;
        for (var i = 0; i < currentStudents.length; i++) {
            var currentStudent = currentStudents[i];
            if (currentStudent != null && currentStudent.colUid == colUid) {
                isExist = true;
                break;
            }

        }
        return isExist;
    }


    /**
     * 回首页
     */
    turnToHomePage() {
        clearInterval(timer)
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
        // history.back()
    }


    render() {
        return (
            <div id="currentAttendanceList" className="home_content">
                <div className="inner_bg">
                    <div className="navBar">
                        <span onClick={this.turnToHomePage}>首页</span>
                        <span className="icon"> &gt; </span>
                        <span>考勤详情</span>
                        <div className="right">
                            <span style={{marginLeft: '20px'}}>
                                <span className="item">应到：<span className="blue">{this.state.peopleNum}</span></span>
                                <span className="item">实到：<span
                                    className="blue">{this.state.currentPeopleNum}</span></span>
                                <span className="noSign"><span className="white btn">未签到</span><span
                                    className="text">{parseInt(this.state.peopleNum) - parseInt(this.state.currentPeopleNum)}</span></span>
                            </span>
                        </div>
                    </div>

                    <div className="content">
                        {this.state.studentHeaderTagList}
                    </div>
                </div>
            </div>
        );
    }
}
