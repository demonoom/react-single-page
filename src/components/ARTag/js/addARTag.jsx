import React from "react";
import {
    InputItem, Tag, Button
} from 'antd-mobile';

function onChange(selected, e) {
    console.log(`tag selected: ${selected}`);
    console.log(e, "value")
}
var calm;
export default class addARTag extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {

        }
    }
    componentDidMount(){
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({"uid": uid});
    }
    onChange(selected) {
        console.log(`tag selected: ${selected}`);
        // console.log(e, "value")
    }
    
    onChangeTag(selected) {
        console.log(`tag selected: ${selected}`);
        // console.log(e, "value")
    }
    /**
     * 提交
     */
    submit() {
        var param = {
            "method": 'addARBookTag',
            "tagData":{
                "creatorId":calm.state.uid,     // 创建者id
                "content": calm.state.ARTagValue       // 标签内容
             }
        }
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result,"re")
                if (result.msg == '调用成功' || result.success == true) {
                    
                } else {
                    // Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
        console.log(calm.state.ARTagValue)
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


                {/* <div className="tag-container">
                    <Tag closable onChange={calm.onChange}
                        onClose={() => {
                            console.log('onClose');
                        }}
                        afterClose={() => {
                            console.log('afterClose');
                        }}>Callback</Tag>

                    <Tag closable onChange={calm.onChangeTag}
                        onClose={() => {
                            console.log('onClose');
                        }}
                        afterClose={() => {
                            console.log('afterClose');
                        }}>Callback2</Tag>

                </div> */}
            </div>
        )
    }
}