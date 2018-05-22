import React from 'react';
import {} from 'antd-mobile';

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
        var clazzId = searchArray[0].split('=')[1];
        this.setState({clazzId})
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        var cid = this.state.clazzId;
        this.getStudentByCourseTableItem(cid);
        this.openTimeInterVal(cid);
    }

    openTimeInterVal(cid) {
        //开启定时器获取实到人数
        timer = setInterval(function () {
            demeanor.getBraceletAttend(cid);
        }, 10000)
    }

    /**
     * 应到人数
     */
    getStudentByCourseTableItem(cid) {
        var _this = this;
        var param = {
            "method": 'getStudentByCourseTableItem',
            "id": cid
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' || result.success == true) {
                    allStudents = result.response;
                    _this.setState({peopleNum: result.response.length});
                }
                _this.getBraceletAttend(cid);
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
    getBraceletAttend(cid) {
        var _this = this;
        var param = {
            "method": 'getBraceletAttend',
            "cid": cid
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({"currentPeopleNum": result.response.length});
                    console.log('getBraceletAttend', result.response.length);
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
                if (isExist === false) {
                    checkedTip = "未签到";
                }
                var studentAvatar = studentOfAll.avatar;
                if (studentAvatar == null || studentAvatar == undefined || studentAvatar == "") {
                    studentAvatar = "../../img/maaee_face.png";
                }
                var studentHeaderTag = <div>
                    <img style={{width: 40, height: 40}} src={studentAvatar}/>
                    <div>{checkedTip}</div>
                    <div>
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
        history.back()
    }


    render() {
        return (
            <div id="currentAttendanceList">
                <div>
                    <span onClick={this.turnToHomePage}>首页</span>
                    <span> &gt; </span>
                    <span>考勤详情</span>
                    <span style={{marginLeft: '20px'}}>
                        <span>应到：{this.state.peopleNum}</span>
                        <span>实到：{this.state.currentPeopleNum}</span>
                        <span>未签到：{parseInt(this.state.peopleNum) - parseInt(this.state.currentPeopleNum)}</span>
                    </span>
                </div>
                <div style={{display: 'inline-flex'}}>
                    {this.state.studentHeaderTagList}
                </div>
            </div>
        );
    }
}
