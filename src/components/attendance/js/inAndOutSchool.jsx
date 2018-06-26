import React from 'react';
import {
    Toast, DatePicker, List, Button, ActivityIndicator,WhiteSpace
} from 'antd-mobile';
import '../css/inAndOutSchool.less'
export default class inAndOutSchool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clientHeight: document.body.clientHeight,
        }
    }

    componentDidMount() {
        document.title = '出入校园考勤';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
    }



    getBraceletStudentAttendancePie() {
        this.showToast();
        var param = {
            "method": 'getBraceletStudentAttendancePie',
            "schoolId": this.state.schoolId,
            "attendDate": WebServiceUtil.formatYMD(this.state.date.getTime()),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // console.log(result);
                if (result.success) {
                    this.getData(result.response);
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    render() {
        return (
            <div id="inAndOutSchool">
                出入校园考勤
            </div>
        );
    }

}