import React from 'react';
import {Toast} from 'antd-mobile';

export default class classCardHomePageDoor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {
        // var locationHref = decodeURI(window.location.href);
        // var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var searchArray = locationSearch.split("&");
        // var clazzId = searchArray[0].split('=')[1];
        // var roomId = searchArray[1].split('=')[1];
        // var mac = searchArray[2].split('=')[1];
    }

    componentDidMount() {

    }

    render() {
        return (
            <div id="classCardHomePageDoor" style={{height: document.body.clientHeight}}>
                <li onClick={this.turnTo}>手环绑定</li>
                <li onClick={this.turnTo}>课程表列表</li>
                <li onClick={this.turnTo}>公共教室课程表</li>
                <li onClick={this.turnTo}>教室管理页面</li>
                <li onClick={this.turnTo}>班级风采</li>
                <li onClick={this.turnTo}>班级荣誉</li>
                <li onClick={this.turnTo}>德育评价</li>
                <li onClick={this.turnTo}>通知后台</li>
                <li onClick={this.turnTo}>班级值日表</li>
            </div>
        );
    }
}

// {<li><Link to="/ringBinding?ident=23836"
//            style={{fontSize: '24px'}}>手环绑定</Link></li>}

// to="/curriculumSchedule?ident=23836&curriculumType=1&access=23836"
// style={{fontSize: '24px'}}>课程表列表</Link></li>
//
// <li><Link
// to="/curriculumSchedule?ident=23836&curriculumType=2&access=23836"
// style={{fontSize: '24px'}}>公共教室课程表列表</Link></li>
// <li><Link
//
// to="/classroomManage?uid=23836"
// style={{fontSize: '24px'}}>教室管理页面</Link></li>
// <li><Link
// to="/classDemeanor?ident=23836&access=23836"
// style={{fontSize: '24px'}}>班级风采</Link></li>
// <li><Link
// to="/classHonor?ident=23836&access=23836"
// style={{fontSize: '24px'}}>班级荣誉</Link></li>
// <li><Link
// to="/moralEducation?ident=23836"
// style={{fontSize: '24px'}}>德育评价</Link></li>
// <li><Link
//
// to="/notifyBack?access_user=23836"
// style={{fontSize: '24px'}}>通知后台</Link></li>
// <li><Link
// to="/studentDutyList?access_user=23836"
// style={{fontSize: '24px'}}>班级值日表</Link></li>
