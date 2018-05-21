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
        var clazzId = '819';
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
                                    var stuImgTag=<span>
                                        <div><img style={{width:'80px',height:'80px'}}  src={student.avatar}/></div>
                                        <div>{stuName}</div>
                                    </span>
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
            <div id="studentOnDuty">
                <span>今日值日生</span>
                <div>
                    {this.state.studentList}
                </div>
            </div>
        );
    }
}
