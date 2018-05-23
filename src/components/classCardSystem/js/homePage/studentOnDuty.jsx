import React from 'react';
import {} from 'antd-mobile';

var demeanor;

/**
 * 班牌首页显示的今日值日生列表
 */
export default class studentOnDuty extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            studentList: []
        };
        this.getClassBrandStudentDutyByToday = this.getClassBrandStudentDutyByToday.bind(this);
    }

    componentWillMount() {
        var clazzId = localStorage.getItem("clazzId");
        this.getClassBrandStudentDutyByToday(clazzId);
    }

    componentWillReceiveProps(nextProps) {
        console.log('studentOnDuty', nextProps.classCommand);
    }

    /**
     * 班牌值日今日信息查询
     * @param clazzId
     */
    getClassBrandStudentDutyByToday(clazzId) {
        var _this = this;
        var param = {
            "method": 'getClassBrandStudentDutyByToday',
            "clazzId": clazzId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var weekOfTody = new Date().getDay();
                console.log("week:" + weekOfTody);
                var todyDuty = [];
                var nextDuty = [];
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            _this.setState({"isLoadingLeft": false})
                        } else {
                            var clazzDutyList = result.response;
                            clazzDutyList.forEach(function (clazzDuty) {
                                var users = clazzDuty.users;
                                var clazzDutyWeek = clazzDuty.week;
                                if (WebServiceUtil.isEmpty(users) == false) {
                                    users.forEach(function (student) {
                                        if (student != null && student != undefined) {
                                            var stuId = student.colUid;
                                            var stuName = student.userName;
                                            var icon = student.avatar;
                                            var stuJson = {text: stuName, icon};
                                            var stuImgTag = <li className="studentOnDuty_list">
                                                <div className="studentOnDuty_face"><img className="studentOnDuty_face"
                                                                                         src={student.avatar}/></div>
                                                <div
                                                    className="home_contfont text_hidden studentOnDuty_name">{stuName}</div>
                                            </li>;
                                            if (clazzDutyWeek == weekOfTody) {
                                                todyDuty.push(stuImgTag)
                                            } else {
                                                nextDuty.push(stuImgTag)
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
                _this.setState({todyDuty, nextDuty});
            },
            onError: function (error) {
            }
        });
    }

    render() {
        return (
            <div id="studentOnDuty" className="home_card studentOnDuty_height">
                <h3 className="home_title">值日生</h3>
                <div className="home_cardCont studentOnDuty_cont">
                    <h4 className="studentOnDuty_today">今日值日生</h4>
                    <div>{this.state.todyDuty}</div>
                    <h4 className="studentOnDuty_today">明日值日生</h4>
                    <div>{this.state.nextDuty}</div>
                </div>
            </div>
        );
    }
}
