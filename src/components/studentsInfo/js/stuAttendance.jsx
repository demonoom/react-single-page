import React from 'react';
import '../css/stuAttendance.less'
import {List, Toast, ListView, Button, InputItem, Radio, WhiteSpace, Modal} from 'antd-mobile';

export default class stuAttendance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        this.setState({

        }, () => {

        });

    }


    render() {
        return (
            <div id="stuAttendance">
                学生考勤
            </div>
        );
    }
}
