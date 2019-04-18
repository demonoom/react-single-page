import React from 'react';
import { Icon, Toast, Modal } from 'antd-mobile';
import '../css/classCardHomePageDoor.less';
import { SimpleWebsocketConnection } from '../../../helpers/simple_websocket_connection'
const alert = Modal.alert;

window.simpleMS = null;
export default class schoolInfoManage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount () {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var schoolId = searchArray[1].split('=')[1];
        this.setState({ ident,schoolId })
        this.getUserByAccount(ident)
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount () {
        Bridge.setShareAble("false");
        document.title = '小蚂蚁物联校园管理中心';
        this.simpleListener();
    }

    /**
     * 消息监听
     */
    simpleListener () {
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {
                console.log("班牌管理Error:", errorMsg);
            }, onWarn: function (warnMsg) {
                console.log("班牌管理warnMsg:", warnMsg);
            }, onMessage: function (info) {
                console.log("班牌管理info:", info);
                if (info.command == "refreshClassCardPage") {
                    Toast.success("班牌刷新成功!");
                }
            }
        };
    }

    getUserByAccount (ident) {
        var _this = this;
        var param = {
            "method": 'getUserByAccount',
            "account": 'te' + ident,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({ schoolId: result.response.schoolId })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    //学校简介管理
    turnToAddSchoolInfo = () => {
        var url = WebServiceUtil.mobileServiceURL + "addSchoolInfo?schoolId=" + + this.state.schoolId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    //列表
    turnTogreaTeacherList = () => {
        var url = WebServiceUtil.mobileServiceURL + "greaTeacherList?ident=" + + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
   * 通知后台
   */
    turnToNotifyBack = () => {
        var url = WebServiceUtil.mobileServiceURL + "notifyBack?access_user=" + this.state.ident;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }


    /**
    * 班级风采
    */
    turnToClassDemeanor = (type) => {
        var isPc = WebServiceUtil.isPC();
        if (isPc == true) {
            var url;
            if (type == 1) {
                url = WebServiceUtil.mobileServiceURL + "classDemeanorList?ident=" + this.state.ident;
            } else {
                url = WebServiceUtil.mobileServiceURL + "classHonorList?ident=" + this.state.ident;
            }

            var data = {
                method: 'openNewPage',
                url: url
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        } else {
            Toast.fail("请在电脑端操作,谢谢!", 3);
        }


    }


    render () {
        var _this = this;
        //判断是否是具有班牌刷新管理员权限的用户
        var isManager = false;
        for (var i = 0; i < WebServiceUtil.refreshClassCardUserArray.length; i++) {
            var defineUser = WebServiceUtil.refreshClassCardUserArray[i];
            if (defineUser == _this.state.ident) {
                isManager = true;
                break;
            }
        }
        return (
            <div id="classCardHomePageDoor" style={{ height: document.body.clientHeight, overflow: 'auto' }}>
                <div className="teacher-item">
                    <ul className="classCardHomePageDoor my_flex">
                        <li onClick={this.turnToAddSchoolInfo}><i className="icon icon_SchoolProfile"></i>
                            <div>学校简介管理</div>
                        </li>
                        <li onClick={this.turnToNotifyBack}><i className="icon icon_notify"></i>
                            <div>校园通知管理</div>
                        </li>
                        {/*<li onClick={this.turnToCurriculumSchedule.bind(this, 2)}><i className="icon icon_publiCourse"></i><div>公共教室课程表</div></li>*/}
                        <li onClick={this.turnToClassDemeanor.bind(this, 1)}><i className="icon icon_SchoolStyle"></i>
                            <div>校园风采管理</div>
                        </li>
                        <li onClick={this.turnTogreaTeacherList.bind(this, 1)}><i className="icon icon_teacherStyle"></i>
                            <div>教师风采管理</div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}




