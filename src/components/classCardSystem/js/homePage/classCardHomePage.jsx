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
import Header from './header'

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
                <Header/>
                <div className="home_content">
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
            </div>
        );
    }
}
