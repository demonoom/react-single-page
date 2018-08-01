import React from "react";
import {
    InputItem, Toast, Button
} from 'antd-mobile';

var calm;
export default class addARTag extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {

        }
    }
    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '添加AR标签';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
    }

    /**
     * 提交
     */
    submit() {
        var param = {
            "method": 'addARBookTag',
            "tagData": {
                "creatorId": calm.state.uid,     // 创建者id
                "content": calm.state.ARTagValue       // 标签内容
            }
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "re")
                if (result.msg == '调用成功' || result.success == true) {
                    //关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };

                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });
    }
    render() {
        return (
            <div id="ARTag">
                <InputItem
                    placeholder="请输入教材名称"
                    ref={el => this.labelFocusInst = el}
                    onChange={v => calm.setState({
                        ARTagValue: v
                    })}
                >
                    <div className="textTitle" onClick={() => this.labelFocusInst.focus()}>AR标签名<i className="redStar">*</i></div>
                </InputItem>
                <div className="submitBtn">
                    <Button type="warning" onClick={calm.submit}>提交</Button>
                </div>
            </div>
        )
    }
}