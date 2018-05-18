import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/classCardHomePage.less'
import {MsgConnection} from '../../../../helpers/msg_websocket_connection';
import CurrentAttendance from './currentAttendance'
import Course from './course'
import Notify from './notify'
import Application from './application'
import ClassDemeanor from './classDemeanor'
import StudentOnDuty from './studentOnDuty'
import MoralEducationScore from './moralEducationScore'

var demeanor;
//消息通信js
window.ms = null;

export default class classCardHomePage extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            messageInfo: '1',
        };
    }

    componentWillMount() {
        var pro = {
            "command": "braceletBoxConnect",
            "data": {
                "type": "web",
                "machine": '02:00:00:00:00:00',
                "version": '1.0'
            }
        };
        ms = new MsgConnection();
        ms.connect(pro);
    }

    componentDidMount() {
        this.msListener()
    }

    msListener() {
        ms.msgWsListener = {
            onError: function (errorMsg) {
                Toast.fail(errorMsg)
            }, onWarn: function (warnMsg) {
                Toast.fail(warnMsg)
            }, onMessage: function (info) {
                demeanor.setState({messageInfo: info});
            }
        }
    }

    render() {
        return (
            <div id="classCardHomePage" style={{height: document.body.clientHeight}}>
                {/*班牌首页*/}
                <CurrentAttendance
                    messageUtilObj={this.state.messageInfo}
                />
                <Course
                    messageUtilObj={this.state.messageInfo}
                />
                <Notify/>
                <Application/>
                <ClassDemeanor/>
                <StudentOnDuty/>
                <MoralEducationScore/>
            </div>
        );
    }
}
