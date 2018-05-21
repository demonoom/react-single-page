import React from 'react';
import {} from 'antd-mobile';
import '../../css/homePage/currentAttendance.less'

var demeanor;
var timer;

export default class currentAttendance extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            openClass: true
        };
        this.turnToAttendanceList = this.turnToAttendanceList.bind(this);
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.messageUtilObj.command == 'brand_class_open') {
            //获取应到人数
            this.getStudentByCourseTableItem(nextProps.messageUtilObj.data);
            this.openTimeInterVal(nextProps.messageUtilObj.data);
            this.setState({openClass: true})
        } else if (nextProps.messageUtilObj.command == 'brand_class_close') {
            this.setState({openClass: false});
            clearInterval(timer)
        }
    }

    componentDidMount() {
        this.getBraceletAttend()
        this.getStudentByCourseTableItem()
        // this.openTimeInterVal()
    }

    openTimeInterVal(data) {
        //开启定时器获取实到人数
        timer = setInterval(function () {
            demeanor.getBraceletAttend(data)
        }, 10000)
    }

    /**
     * 应到人数
     */
    getStudentByCourseTableItem(data) {
        var _this = this;
        var param = {
            "method": 'getStudentByCourseTableItem',
            // "id": data.classTableId
            "id": 3
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
            // "cid": data.classTableId
            "cid": 3
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log('getBraceletAttend', result.response.length);
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
    turnToAttendanceList(){
        var currentAttendanceListUrl = WebServiceUtil.mobileServiceURL + "currentAttendanceList";
        location.href = currentAttendanceListUrl;

        /*var data = {
            method: 'openNewPage',
            url: editStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });*/
    }

    render() {
        return (
            <div id="currentAttendance" className="home_card currentAttendance_height">
                <h3 className="home_title" onClick={this.turnToAttendanceList}>考勤详情</h3>
                {!this.state.openClass ?
                    <div className='classTableA'>暂未开课</div> :
                    <div className='classTableA'>
                        <div className="due">应到人数：<span className="number">{this.state.peopleNum}</span></div>
                        <div className="due">实到人数：<span className="number">{this.state.peopleNumReality}</span></div>
                    </div>}
            </div>
        );
    }
}
