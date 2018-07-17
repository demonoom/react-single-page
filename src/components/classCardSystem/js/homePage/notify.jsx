import React from 'react';
import {Modal} from 'antd-mobile';

var demeanor;

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

export default class notify extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            noticeList: [],
            contentModalVisible: false
        };
        this.getClassBrandNoticeListByClassId = this.getClassBrandNoticeListByClassId.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        var roomId = localStorage.getItem("roomId");
        var initPageNo = 1;
        this.getClassBrandNoticeListByClassId(roomId, initPageNo);
    }

    componentWillReceiveProps(nextProps) {
        // jsonObject.put("command", "classBrandNotice");
        // jsonObject.put("classroomid", classroomid);
        var roomId = localStorage.getItem("roomId");
        if (nextProps.classCommand.command == "classBrandNotice" && nextProps.classCommand.data.classroomid == roomId) {
            this.getClassBrandNoticeListByClassId(roomId, 1);
        }
        this.setState({defaultId: nextProps.defaultId})
    }

    /**
     * 班牌根据教室id查询通知列表
     * @param clazzId
     */
    getClassBrandNoticeListByClassId(roomId, pageNo) {
        var _this = this;
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "classroomId": roomId,
            "pageNo": pageNo
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var noticeList = [];
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length !== 0) {
                            var notices = result.response;
                            notices.forEach(function (notice) {
                                if (notice != null && notice != undefined) {
                                    var noticeTag = <li>
                                        <span className="notify_list text_hidden"
                                              onClick={_this.showContentModal.bind(_this, notice)}>{notice.noticeTitle}</span>
                                        <i className="titleMore notify_titleMore"></i>
                                    </li>
                                    noticeList.push(noticeTag);
                                }
                            })
                        }
                    }
                }
                _this.setState({noticeList});
            },
            onError: function (error) {
            }
        });
    }

    onClose = key => () => {
        this.setState({
            contentModalVisible: false,
        });
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    showContentModal = (notice) => {
        this.setState({contentModalVisible: true, notice});
    }

    notifySeeMore() {
        var currentAttendanceListUrl = WebServiceUtil.mobileServiceURL + "noticeReadMore?defaultId=" + demeanor.state.defaultId;
        var data = {
            method: 'openNewPage',
            url: currentAttendanceListUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = currentAttendanceListUrl;
        });
    }

    render() {
        var noticeTitle = null;
        var noticeContent = null;
        if (this.state.notice != null && this.state.notice != undefined) {
            noticeTitle = this.state.notice.noticeTitle;
            noticeContent = this.state.notice.noticeContent;
        }
        return (
            <div id="notify" className="home_card notify_height">
                <h3 className="home_title" onClick={this.notifySeeMore}>
                    <span>通知</span>
                    <span className="home_titleMore">历史通知<i className="titleMore"></i></span>
                </h3>
                <div className="notify_cont">
                    {WebServiceUtil.isEmpty(this.state.noticeList) == false && this.state.noticeList.length > 0 ? this.state.noticeList :
                        <div className="empty_center">
                            <div className="empty_icon empty_notify"></div>
                            <div className="empty_text">暂无通知</div>
                        </div>}
                </div>
                <Modal
                    visible={this.state.contentModalVisible}
                    transparent
                    closable
                    maskClosable={false}
                    onClose={this.onClose('modal1')}
                    title={noticeTitle}
                    className="notify_contModal"
                    footer={false}
                    wrapProps={{onTouchStart: this.onWrapTouchStart}}
                >
                    <div className="cont">
                        {noticeContent}
                    </div>
                </Modal>
            </div>
        );
    }
}
