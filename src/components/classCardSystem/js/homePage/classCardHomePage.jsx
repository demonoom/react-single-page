import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/classCardHomePage.less';
import '../../css/skin/skin_default.less';
import '../../css/skin/skin_primarySchool.less';
import '../../css/skin/skin_middleSchool.less';
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
            defaultId: 'skin_default'
        };
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var clazzId = searchArray[0].split('=')[1];
        var roomId = searchArray[1].split('=')[1];
        var mac = searchArray[2].split('=')[1];
        if (WebServiceUtil.isEmpty(searchArray[3]) == false) {
            var schoolId = searchArray[3].split('=')[1];
            this.getBraceletBoxSkinBySchoolId(schoolId)
        }
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

    /**
     * 根据学校查询当前的皮肤
     * @param schoolId
     */
    getBraceletBoxSkinBySchoolId(schoolId) {
        var _this = this;

        var param = {
            "method": 'getBraceletBoxSkinBySchoolId',
            "schoolId": schoolId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        _this.setState({defaultId: result.response.skinAttr});
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

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
                console.log(info);
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

    playVideo = (src) => {
        var _this = this;

        var videoPlayer = <video id="videoPlayerAr" controls="controls" minLength={100} autoplay>
            <source type="video/mp4" src={src}/>
        </video>;

        this.setState({videoPlayer}, function () {
            document.getElementById('videoPlayerMask').style.display = 'block'
            document.getElementById("videoPlayerAr").onended = function () {
                _this.closePlayerMask()
            };
        })
        setTimeout(function () {
            document.getElementById('videoPlayerAr').play();
        }, 300)
    }

    closePlayerMask = () => {
        document.getElementById('videoPlayerAr').pause();
        var videoPlayer = '';
        this.setState({videoPlayer}, function () {
            document.getElementById('videoPlayerMask').style.display = 'none'
        });
    }

    render() {
        return (
            <div id={this.state.defaultId}>
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
                                    defaultId={this.state.defaultId}
                                />
                                <CurrentAttendance
                                    messageUtilObj={this.state.messageInfo}
                                    defaultId={this.state.defaultId}
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
                                    playVideo={this.playVideo}
                                />
                                <div>
                                    <Notify
                                        classCommand={this.state.classCommand}
                                        defaultId={this.state.defaultId}
                                    />
                                    <Application
                                        defaultId={this.state.defaultId}
                                    />
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
                    <div id='videoPlayerMask' style={{display: 'none'}}>
                        <span className='close' onClick={this.closePlayerMask}>关闭</span>
                        {this.state.videoPlayer}
                    </div>
                </div>
            </div>
        );
    }
}
