import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/classCardHomePage.less'
import {MsgConnection} from '../../../../helpers/msg_websocket_connection';
import CurrentAttendance from './currentAttendance'
import Course from './course'
import Notify from './notify'

var demeanor;
//消息通信js
window.ms = null;

export default class publicClassCardHomePage extends React.Component {

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
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var clazzId = searchArray[0].split('=')[1];
        var roomId = searchArray[1].split('=')[1];
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
                <div className="home_content">
                    {/*公共教室班牌首页*/}
                    <div className="home_left">
                        <Notify/>
                    </div>
                    <div className="home_right">
                        <CurrentAttendance
                            messageUtilObj={this.state.messageInfo}
                        />
                    </div>
                    <div className="home_center">
                        <Course
                            messageUtilObj={this.state.messageInfo}
                        />
                    </div>
                </div>
            </div>
        );
    }
}