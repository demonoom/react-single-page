import React from "react";
import {
    InputItem,Button
} from 'antd-mobile';
var calm;
export default class updateARTag extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
        }
    }
    componentDidMount() {
        
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var id = locationSearch.split("&")[1].split("=")[1];
        this.viewARBookTag(id)
        this.setState({ "uid": uid, "id": id });


    }
    /**
     * 
     */
    viewARBookTag(tId) {
        var param = {
            "method": 'viewARBookTag',
            "tId": tId,
        }
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "re")
                if (result.msg == '调用成功' || result.success == true) {
                    calm.setState({
                        ARTagValue:result.response.content
                    },()=>{
                        // calm.viewARBookTag(calm.state.id)
                    })
                }else{

                }

            },
            onError: function (error) {
                // message.error(error);
            }
        })
    }



    /**
     *    提交
     */
    submit() {
        var param = {
            "method": 'updateARBookTag',
            "tagData":{
                "id":calm.state.id,
                "creatorId":calm.state.uid,     // 创建者id
                "content": calm.state.ARTagValue       // 标签内容
             }
        }
        console.log(param,"b")
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result,"b")
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
        console.log(calm.state.ARTagValue)
    }
    /**
     * 标签发生改变时候的回调
     * @param {*} v 
     */
    inputOnChang(v){
        calm.setState({
            ARTagValue:v
        })
    }
    render() {
        console.log(calm.state.ARTagValue,"2")
        return (
            <div id="ARTag">
                <InputItem
                    placeholder="请输入教材名称"
                    ref={el => this.labelFocusInst = el}
                    onChange={calm.inputOnChang}
                    value={calm.state.ARTagValue}
                >
                    <div className="textTitle" onClick={() => this.labelFocusInst.focus()}>AR标签名<i className="redStar">*</i></div>
                </InputItem>
                <div className="submitBtn">
                    <Button type="warning"  onClick={calm.submit}>提交</Button>
                </div>
            </div>
        )
    }
}