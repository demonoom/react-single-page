import React from 'react';
import {
    Toast,
    Card,
    WingBlank,
    WhiteSpace,
    Modal,
} from 'antd-mobile';
import '../css/bindPeopleList.less';

var bindDing;
const alert = Modal.alert;
export default class bindPeopleList extends React.Component {

    constructor(props) {
        super(props);
        bindDing = this;

        this.state = {
            clientHeight: document.body.clientHeight,
            calmHeight: document.body.clientHeight - 296,
            macId: '',
            stNameValue: '',
            initData: [],
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '老人健康手环绑定列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var uid = locationSearch.split("&")[0].split("=")[1];
        var uid = 'o-w611NdfSQpr6WWypLbVV1c5aLQ'
        this.setState({ "uid": uid });
        this.listWeChatBindingOldManBracelet(uid);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', bindDing.onWindowResize);
        // Toast.info(locationHref,100);
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', bindDing.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            bindDing.setState({ clientHeight: document.body.clientHeight, calmHeight: document.body.clientHeight - 296 });
        }, 100)
    }

    /**
     * 查看绑定的设备
     */
    listWeChatBindingOldManBracelet(uid) {
        var param = {
            "method": 'listWeChatBindingOldManBracelet',
            "openId": uid,
        };
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    bindDing.setState({
                        initData: result.response,
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 解绑弹出框
     */
    showAlert = (data) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        var _this = this;
        const alertInstance = alert('您确定要解除绑定吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.unbindOldManBraceletFromWeChat(data) },
        ], phone);
    };

    /**
     * 解绑
     * @param obj
     */
    unbindOldManBraceletFromWeChat(data) {
        var param = {
            "method": 'unbindOldManBraceletFromWeChat',
            "bid": data.id,
        };
        WebServiceUtil.requestLittleAntApiOldManBracelet(JSON.stringify(param), {
            onResponse: function (result) {
                alert(JSON.stringify(result))
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('解绑成功', 1);
                    var arr = bindDing.state.initData;
                    arr.forEach(function (v, i) {
                        if (data.id == v.id) {
                            bindDing.state.initData.splice(i, 1);
                        }
                    });
                    bindDing.setState({
                        initData: arr
                    })
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }



    /**
     * 跳转绑定页面
     */
    toaddRing = () => {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "addOldPeople?uid=" + bindDing.state.uid);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    /**
     * 跳转健康详情页面
     */
    toHealthDetail = (v) => {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "healthDetail?uid=" + bindDing.state.uid + "&id=" + v.id + "&name=" + v.name + "&macAddress=" + v.macAddress);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        var _this = this;
        return (
            <div id="bindPeopleList" style={{ height: bindDing.state.clientHeight }}>
                <div className='tableDiv' style={{ height: bindDing.state.clientHeight }}>
                    <div className="listCont">
                        {/*<div className="item">
                            <Card>
                                <div className="student_list list1 textOver">
                                    <span className="title">手环名称：</span><span>fhfgh</span>
                                    <span className="untiedBtn" >解绑</span>
                                </div>
                                <Card.Body>
                                    <div className="student_list textOver"><span className="title">手环ID：</span><span>fdfdg</span></div>
                                    <div className="healthDetail"><span>健康详情</span></div>
                                </Card.Body>
                            </Card>
                        </div>*/}
                        {
                            bindDing.state.initData.map((v, i) => {
                                return (
                                    <div className="item">
                                        <Card>
                                            <div className="student_list list1 textOver">
                                                <span className="title">手环名称：</span><span>{v.name}</span>
                                                <span className="untiedBtn" onClick={_this.showAlert.bind(this, v)}>解绑</span>
                                            </div>
                                            <Card.Body>
                                                <div className="student_list textOver"><span className="title">手环ID：</span><span>{v.macAddress}</span></div>
                                                <div className="healthDetail" onClick={_this.toHealthDetail.bind(this, v)}><span>健康详情</span></div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='bindingBtn' onClick={this.toaddRing}>
                        绑定新用户
                        {/* <img src={require("../imgs/addBtn.png")}/> */}
                    </div>
                </div>

            </div>
        );
    }
}
