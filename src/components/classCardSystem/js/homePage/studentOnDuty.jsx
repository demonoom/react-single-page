import React from 'react';
import {} from 'antd-mobile';

var demeanor;

export default class studentOnDuty extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            studentList:[]
        };
        this.getClassBrandStudentDutyByToday = this.getClassBrandStudentDutyByToday.bind(this);
    }

    componentWillMount() {
        var clazzId = localStorage.getItem("clazzId");
        this.getClassBrandStudentDutyByToday(clazzId);
    }

    componentDidMount() {

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
                var studentList = [];
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            _this.setState({"isLoadingLeft": false})
                        } else {
                            var clazzObj = result.response;
                            console.log(clazzObj);
                            var users = clazzObj.users;

                            users.forEach(function (student) {
                                if (student != null && student != undefined) {
                                    var stuId = student.colUid;
                                    var stuName = student.userName;
                                    var icon = student.avatar;
                                    var stuJson = {text: stuName, icon};
                                    var stuImgTag=<li className="studentOnDuty_list">
                                        <div className="studentOnDuty_face"><img  className="studentOnDuty_face"  src={student.avatar}/></div>
                                        <div className="home_contfont text_hidden studentOnDuty_name">{stuName}</div>
                                    </li>
                                    studentList.push(stuImgTag)
                                }
                            })
                        }
                    }
                }
                _this.setState({studentList});
            },
            onError: function (error) {
            }
        });
    }

    render() {
        return (
            <div id="studentOnDuty" className="home_card studentOnDuty_height">
                <h3 className="home_title">今日值日生</h3>
                <div className="home_cardCont">
                    {this.state.studentList}
                </div>
            </div>
        );
    }
}
