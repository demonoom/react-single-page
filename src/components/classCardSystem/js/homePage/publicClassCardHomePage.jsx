import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/classCardHomePage.less'
import {MsgConnection} from '../../../../helpers/msg_websocket_connection';
import {SimpleWebsocketConnection} from '../../../../helpers/simple_websocket_connection';
import CurrentAttendance from './currentAttendance'
import Course from './course'
import Notify from './notify'
import Header from './header'

var demeanor;
//消息通信js
window.ms = null;
window.simpleMS = null;

export default class publicClassCardHomePage extends React.Component {

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
        var roomId = searchArray[0].split('=')[1];
        var mac = searchArray[1].split('=')[1];
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

    render() {
        return (
            <div id="classCardHomePage" style={{height: document.body.clientHeight}}>
                <Header/>
                <div className="home_content">
                    {/*公共教室班牌首页*/}
                    <div className="publicHome_left">
                        <Notify
                            classCommand={this.state.classCommand}
                        />
                    </div>
                    <div className="publicHome_right">
                        <CurrentAttendance
                            messageUtilObj={this.state.messageInfo}
                        />
                    </div>
                    <div className="publicHome_center">
                        <Course
                            messageUtilObj={this.state.messageInfo}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
