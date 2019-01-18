import React from "react";
import { List, InputItem, Radio, Flex, WhiteSpace, Toast } from "antd-mobile";
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
        document.title = "进入课堂";
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var userName = searchArray[1].split('=')[1];
        var vid = searchArray[2].split('=')[1];
        var pwd = searchArray[3].split('=')[1];
        var classId = searchArray[3].split('=')[1];
        this.setState({
            ident,
            userName,
            vid,
            pwd,
            classId
        })
        this.getTeacherClasses(ident)
    }

    getTeacherClasses = (ident) => {
        var param = { "method": "getTeacherClasses", "ident": ident }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
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
        this.setState({
            value: value.value,
            classId: value.label.split("#")[0]
        });
    };

    /**
     * 输入框改变
     */
    inputOnchange = (v) => {
        this.setState({
            inputValue: v
        })
    }
    /**
     * 点击提交按钮
     */
    toJoinClass = () => {
        if (this.state.pwd == this.state.inputValue) {
            /**
             * 进入正在开课的页面
             */
            var data = {
                method: 'joinClass',
                userId: this.state.ident,
                vid: this.state.vid,
                userName: this.state.userName,
                classId: this.state.classId,
            }
            console.log(data)
            Bridge.callHandler(data, null, function (error) {
            });

        } else {
            Toast.info("邀请码不正确～")
        }
    }
    /**
   * 返回箭头
   */
    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }
    render() {
        const { value } = this.state;
        return (
            <div id='joinClass'>
                <div className='topTitle line_public'><span className='icon_back' onClick={this.historyGoBack}>返回</span><span>历史回顾</span></div>
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