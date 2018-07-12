import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/classCardHomePage.less';
import '../../css/skin/skin_default.less';
import '../../css/skin/skin_primarySchool.less';
import {MsgConnection} from '../../../../helpers/msg_websocket_connection';
import {SimpleWebsocketConnection} from '../../../../helpers/simple_websocket_connection';
import CurrentAttendance from './currentAttendance'
import Course from './course'
import Notify from './notify'
import Application from './application'
import ClassDemeanor from './classDemeanor'
import StudentOnDuty from './studentOnDuty'
import MoralEducationScore from './moralEducationScore'
import Header from './header'
import Health from '../../../warnAndHealthModule/js/health'

var demeanor;
//消息通信js
window.ms = null;
window.simpleMS = null;

export default class classCardHomePage extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            messageInfo: '1',
            classCommand: '',
        };
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var clazzId = searchArray[0].split('=')[1];
        var roomId = searchArray[1].split('=')[1];
        var mac = searchArray[2].split('=')[1];
        var pro = {
            "command": "braceletBoxConnect",
            "data": {
                "type": "web",
                "machine": mac,
                "version": '1.0',
                "webDevice": WebServiceUtil.createUUID()
            }
        };
        ms = new MsgConnection();
        ms.connect(pro);
        localStorage.setItem("clazzId", clazzId);
        localStorage.setItem("roomId", roomId);
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount() {
        this.msListener()
        this.simpleListener()
    }

    msListener() {
        ms.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
            }, onWarn: function (warnMsg) {
                // Toast.fail(warnMsg)
            }, onMessage: function (info) {
                demeanor.setState({messageInfo: info});
            }
        }
    }

    simpleListener() {
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: function (info) {
                demeanor.setState({classCommand: info});
            }
        };
    }

    /**
     * 一分钟的回调
     */
    timeOut() {
        // demeanor.refs.health.getBraceletSportStepByClazzId(localStorage.getItem("clazzId"))
    }

    render() {
        return (
            <div id="skin_default">
                <div id="classCardHomePage" style={{height: document.body.clientHeight}}>
                    <Header
                        timeOut={this.timeOut}
                    />
                    <div className="home_content home_content_index">
                        <div className="">
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
                                <StudentOnDuty
                                    classCommand={this.state.classCommand}
                                />
                                <MoralEducationScore
                                    classCommand={this.state.classCommand}
                                />
                            </div>
                            <div className="home_center">
                                <ClassDemeanor
                                    classCommand={this.state.classCommand}
                                />
                                <div>
                                    <Notify
                                        classCommand={this.state.classCommand}
                                    />
                                    <Application/>
                                </div>
                            </div>
                            {/*<div>*/}
                            {/*<Health*/}
                            {/*ref="health"*/}
                            {/*typeFromNoom='step'*/}
                            {/*/>*/}
                            {/*<Health*/}
                            {/*ref="health"*/}
                            {/*typeFromNoom='calories'*/}
                            {/*/>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
