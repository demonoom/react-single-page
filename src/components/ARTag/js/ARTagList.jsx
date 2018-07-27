import React from "react";
import {
    ListView,
    Modal,
    Toast,
    Switch,
    List,
    Button
} from 'antd-mobile';
var calmAdd;
const prompt = Modal.prompt;
const alert = Modal.alert;
export default class ARTagList extends React.Component {
    constructor(props) {
        super(props);
        calmAdd = this;
        this.state = {
            initData: []
        }
    }
    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        this.viewARBookTagPage(uid);
    }
    /**
     * 跳转添加页面
     */
    toAddARTag() {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "addARTag?uid=" + calmAdd.state.uid);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    /**
     * 查看标签列表
     */
    viewARBookTagPage(uid) {
        var param = {
            "method": 'viewARBookTagPage',
            "adminId": uid,
            "pn": -1
        }
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "re")
                if (result.msg == '调用成功' || result.success == true) {
                    calmAdd.setState({
                        initData: result.response
                    })
                } else {
                    // Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
        // console.log(calm.state.ARTagValue)
    }
    /**
     * 删除弹出框
     */
    showAlert = (data, event) => {
        event.stopPropagation();
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定要删除该教材吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.deleteTag(data)},
        ], phone);
    };

     /**
     *　删除AR教材标签
     * @throws Exception
     */
    deleteTag(data) {
        var param = {
            "method": 'deleteARBookTag',
            "tId": data.id,
        };

        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result,"eee")
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('删除成功', 1)
                    console.log(calmAdd.state.initData,"initData")
                    calmAdd.state.initData.forEach(function (v, i) {
                        if (data.id == v.id) {
                            calmAdd.state.initData.splice(i, 1);
                        }
                        calmAdd.setState({
                            initData: calmAdd.state.initData
                        },()=>{
                            calmAdd.viewARBookTagPage(calmAdd.state.uid)
                        });
                    });
                   
                }
            },
            onError: function (error) {
                Toast.fail('删除失败');
            }
        });
    }
    /**
     * 跳转编辑页面
     */
    toUpdate(v){
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "updateARTag?uid=" + calmAdd.state.uid+"&id="+v.id);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {
        return (
            <div>
                {
                    calmAdd.state.initData.map((v, i) => {
                        console.log(v, "v")
                        return (
                            <div>
                                <span>{v.content}</span>
                                <span onClick={calmAdd.showAlert.bind(this, v)}>删除</span>
                                <span onClick={calmAdd.toUpdate.bind(this, v)}>编辑</span>
                            </div>
                        )
                    })
                }
                <button onClick={calmAdd.toAddARTag}>添加</button>
            </div>
        )
    }
}