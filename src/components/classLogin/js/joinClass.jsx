import React from "react";
import { List, InputItem, Radio, Flex, WhiteSpace } from "antd-mobile";
import "../css/joinClass.less"
const RadioItem = Radio.RadioItem;
export default class joinClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            classData: [],
            inputValue: ""
        }
    }
    componentDidMount() {
        document.title = "进入课堂页面";
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var userName = searchArray[1].split('=')[1];
        var vid = searchArray[2].split('=')[1];
        var pwd = searchArray[3].split('=')[1];
        this.setState({
            ident,
            userName,
            vid,
            pwd
        })
        this.getTeacherClasses(ident)
    }

    getTeacherClasses = (ident) => {
        var param = { "method": "getTeacherClasses", "ident": ident }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result)
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = []
                    result.response.forEach((v, i) => {
                        arr.push({
                            value: i,
                            label: v
                        })
                    })
                    this.setState({
                        classData: arr
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

    }
    onChange = (value) => {
        console.log(value.label.split("#"), "000")
        this.setState({
            value: value.value,
            classId: value.label.split("#")[0]
        });
    };

    /**
     * 输入框改变
     */
    inputOnchange = (v) => {
        console.log(v)
        this.setState({
            inputValue: v
        })
    }
    /**
     * 点击提交按钮
     */
    toJoinClass = () => {
        console.log(this.state.classId)
        console.log(this.state.pwd)
        if (this.state.pwd == this.state.inputValue) {
            console.log("0000")
            /**
             * 进入正在开课的页面
             */
        }
    }
    render() {
        const { value } = this.state;
        return (
            <div id='joinClass'>
                <InputItem
                    clear
                    placeholder="请输入邀请码"
                    ref={el => this.autoFocusInst = el}
                    onChange={this.inputOnchange.bind(this)}
                ></InputItem>
                <List renderHeader={() => '选择班级'}>
                    {this.state.classData.map(i => (
                        <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i)}>
                            {i.label.split("#")[1]}
                        </RadioItem>
                    ))}
                </List>

                <div className='submitBtn' onClick={this.toJoinClass}><span>提交</span></div>
            </div>
        )
    }
}