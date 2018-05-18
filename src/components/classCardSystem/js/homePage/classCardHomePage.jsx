import React from 'react';
import {} from 'antd-mobile';
import '../../css/classCardHomePage.less'
import {MsgConnection} from '../../../../helpers/msg_websocket_connection';
import CurrentAttendance from './currentAttendance'
import Course from './course'
import Notify from './notify'

var demeanor;
//消息通信js
window.ms = null;

export default class classCardHomePage extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {
        var pro = {
            "command": "messagerConnect",
            "data": {
                "type": "web",
                "machine": '02:00:00:00:00:00',
                "version": '1.0'
            }
        };
        ms = new MsgConnection();
        // ms.connect(pro);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div id="classCardHomePage" style={{height: document.body.clientHeight}}>
                {/*班牌首页*/}
                <CurrentAttendance/>
                <Course/>
                <Notify/>
            </div>
        );
    }
}
