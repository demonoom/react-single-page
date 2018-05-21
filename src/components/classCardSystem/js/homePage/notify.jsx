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
            noticeList:[],
            contentModalVisible:false
        };
        this.getClassBrandNoticeListByClassId = this.getClassBrandNoticeListByClassId.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        var classId = localStorage.getItem("clazzId");
        var initPageNo = 1;
        this.getClassBrandNoticeListByClassId(classId,initPageNo);
    }

    /**
     * 班牌根据教室id查询通知列表
     * @param clazzId
     */
    getClassBrandNoticeListByClassId(classId,pageNo) {
        var _this = this;
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "cid": classId,
            "pageNo":pageNo
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
                                    var noticeTag=<div>
                                        <span onClick={_this.showContentModal.bind(_this,notice)}>{notice.noticeTitle}</span>
                                    </div>
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

    showContentModal=(notice)=>{
        this.setState({contentModalVisible:true,notice});
    }

    render() {
        var noticeTitle = null;
        var noticeContent = null;
        if(this.state.notice!=null && this.state.notice!=undefined){
            noticeTitle = this.state.notice.noticeTitle;
            noticeContent = this.state.notice.noticeContent;
        }
        return (
            <div id="notify">
                <div>
                    <span>通知</span>
                    <span>历史通知</span>
                </div>
                <div>
                    {this.state.noticeList}
                </div>
                <Modal
                    visible={this.state.contentModalVisible}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('modal1')}
                    title={noticeTitle}
                    footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div style={{ height: 200, overflow: 'scroll' }}>
                        {noticeContent}
                    </div>
                </Modal>
            </div>
        );
    }
}
