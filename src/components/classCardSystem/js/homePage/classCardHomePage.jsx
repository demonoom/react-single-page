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
                <div className="home_content">
                {/*班牌首页*/}
                    <div className="home_right">
                        <Course
                            messageUtilObj={this.state.messageInfo}
                        />
                        <CurrentAttendance
                            messageUtilObj={this.state.messageInfo}
                        />
                    </div>
                    <div className="home_left">
                        <StudentOnDuty/>
                        <MoralEducationScore/>
                    </div>
                    <div className="home_center">
                        <ClassDemeanor/>
                        <div>
                            <Application/>
                            <Notify/>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
