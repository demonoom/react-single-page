import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/homePage/currentAttendance.less'

var demeanor;
var timer;
var timerFlag = false;

export default class currentAttendance extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            openClass: false
        };
        this.turnToAttendanceList = this.turnToAttendanceList.bind(this);
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        var roomId = localStorage.getItem('roomId');
        if (nextProps.messageUtilObj.command == 'brand_class_open') {
            //获取应到人数
            if (roomId == nextProps.messageUtilObj.data.classroomId) {
                this.getStudentByCourseTableItem(nextProps.messageUtilObj.data);
                this.setState({openClass: true, clazzId: nextProps.messageUtilObj.data.classTableId})
                if (!timerFlag) {
                    this.openTimeInterVal(nextProps.messageUtilObj.data);
                }
            }
        } else if (nextProps.messageUtilObj.command == 'brand_class_close') {
            if (roomId == nextProps.messageUtilObj.data.classroomId) {
                this.setState({openClass: false});
                clearInterval(timer)
                timerFlag = false;
            }
        } else if (nextProps.messageUtilObj.command == 'braceletBoxConnect' && WebServiceUtil.isEmpty(nextProps.messageUtilObj.data.classTableId) == false) {
            //重连开课
            if (roomId == nextProps.messageUtilObj.data.classroomId) {
                this.getStudentByCourseTableItem(nextProps.messageUtilObj.data);
                this.setState({openClass: true, clazzId: nextProps.messageUtilObj.data.classTableId})
                if (!timerFlag) {
                    this.openTimeInterVal(nextProps.messageUtilObj.data);
                }
            }
        }
        this.setState({defaultId: nextProps.defaultId})

    }

    componentDidMount() {

    }

    openTimeInterVal(data) {
        //开启定时器获取实到人数
        timer = setInterval(function () {
            demeanor.getBraceletAttend(data)
        }, 10000)
        timerFlag = true
    }

    /**
     * 应到人数
     */
    getStudentByCourseTableItem(data) {
        var _this = this;
        var param = {
            "method": 'getStudentByCourseTableItem',
            "id": data.classTableId
            // "id": 3
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({peopleNum: result.response.length})
                }
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
    getBraceletAttend(data) {
        var _this = this;
        var param = {
            "method": 'getBraceletAttend',
            "cid": data.classTableId
        };
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({peopleNumReality: result.response.length})
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 进入考勤详情页
     */
    turnToAttendanceList() {
        if (!this.state.openClass) {
            Toast.fail('暂未开课', 2)
            return
        }

        var currentAttendanceListUrl = WebServiceUtil.mobileServiceURL + "currentAttendanceList?clazzId=" + this.state.clazzId + "&defaultId=" + demeanor.state.defaultId;
        // var currentAttendanceListUrl = WebServiceUtil.mobileServiceURL + "currentAttendanceList?clazzId=" + localStorage.getItem('clazzId');
        // window.location.href = currentAttendanceListUrl;

        var data = {
            method: 'openNewPage',
            url: currentAttendanceListUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = currentAttendanceListUrl;
        });
    }

    render() {
        return (
            <div id="currentAttendance" className="home_card currentAttendance_height">
                <h3 className="home_title" onClick={this.turnToAttendanceList}>
                    <span>本节考勤</span>
                    <span className="home_titleMore">考勤详情<i className="titleMore"></i></span>
                </h3>
                {!this.state.openClass ?
                    <div className='classTableA'>
                        <div className="empty_center">
                            <div className="empty_icon empty_currentAttendance"></div>
                            <div className="empty_text">暂无考勤</div>
                        </div>
                    </div> :
                    <div className='classTableA'>
                        <div className="due">应到人数：<span className="number">{this.state.peopleNum}</span></div>
                        <div className="due">实到人数：<span className="number">{this.state.peopleNumReality}</span></div>
                    </div>}
            </div>
        );
    }
}
