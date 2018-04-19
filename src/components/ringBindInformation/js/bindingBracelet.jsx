import React from 'react';
import {Button, Toast, InputItem, List, Radio} from 'antd-mobile';
import '../css/bindingBracelet.less'

const RadioItem = Radio.RadioItem;

var bindDing;
export default class bindingBracelet extends React.Component {

    constructor(props) {
        super(props);
        bindDing = this;
        this.state = {
            tableDivHeight: document.body.clientHeight,
            value2: 0,
        };
    }

    componentDidMount() {
        var loginUser = JSON.parse(localStorage.getItem('loginUserRingBind'));
        this.setState({loginUser});
        this.viewWatchPage(loginUser);
    }

    /**
     * 查看绑定的设备
     */
    viewWatchPage(loginUser) {
        var _this = this;
        var param = {
            "method": 'viewWatchPage',
            "aid": loginUser.ident,
            "cid": -1,
            "pn": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    var array = [];
                    arr.forEach(function (v, i) {
                        var li = <li className='liName' onClick={_this.unbindWatch.bind(this, v)}>{v.name}</li>;
                        array.push(li);
                    });
                    _this.setState({array});
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 解绑
     * @param obj
     */
    unbindWatch(obj) {
        var param = {
            "method": 'unbindWatch',
            "wid": obj.macAddress,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('解绑成功', 1);
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 开启添加手环的界面
     */
    addRing = () => {
        // var _this = this;
        // var height = this.state.tableDivHeight;
        // var timer = setInterval(function () {
        //     height -= 30;
        //     _this.setState({tableDivHeight: height});
        //     if (height <= 0) {
        //         clearInterval(timer);
        //     }
        // }, 10);
        $('.tableDiv').hide("normal");
    };

    /**
     * 关闭添加手环的界面
     */
    cancelAddModel = () => {
        // var _this = this;
        // var windowHeight = document.body.clientHeight;
        // var height = this.state.tableDivHeight;
        // var timer = setInterval(function () {
        //     height += 30;
        //     _this.setState({tableDivHeight: height});
        //     if (height >= windowHeight) {
        //         clearInterval(timer);
        //     }
        // }, 10);
        $('.tableDiv').show("normal");
    };

    /**
     * 调用客户端扫码
     */
    scanMac() {
        var data = {
            method: 'ringBinding'
        };
        Bridge.callHandler(data, function (mes) {
            //获取二维码MAC地址
            document.getElementById('macAddress').innerHTML = mes;
            bindDing.setState({macId: mes});
        }, function (error) {
            Toast.fail(error, 1);
        });
    }

    /**
     * 绑定
     */
    binding = () => {
        var param = {
            "method": 'bindWatch',
            "uid": this.state.studentId,
            "mac": bindDing.state.macId,
            "opId": this.state.loginUser.ident,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('绑定成功', 1);
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    inputOnChange(e) {
        this.setState({studentId: e.target.value});
    }

    onChange2 = (value) => {
        console.log('checkbox');
        this.setState({
            value2: value,
        });
    };

    render() {
        const {value2} = this.state;
        const data2 = [
            {value: 0, label: 'basketball', extra: 'details'},
            {value: 1, label: 'football', extra: 'details'},
            {value: 2, label: 'basketball', extra: 'details'},
            {value: 3, label: 'football', extra: 'details'},
            {value: 4, label: 'basketball', extra: 'details'},
            {value: 5, label: 'football', extra: 'details'},
            {value: 6, label: 'basketball', extra: 'details'},
            {value: 7, label: 'football', extra: 'details'},
            {value: 8, label: 'basketball', extra: 'details'},
            {value: 9, label: 'football', extra: 'details'},
        ];

        return (
            <div id="bindingBracelet" style={{height: document.body.clientHeight}}>
                <div className='tableDiv' style={{height: this.state.tableDivHeight}}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ul>
                        {this.state.array}
                    </ul>
                    <div className='addBunton' onClick={this.addRing}>+</div>
                </div>
                <div className='addModel' style={{height: document.body.clientHeight}}>
                    <div onClick={this.cancelAddModel}>
                        关闭
                    </div>
                    <h1>新增手环</h1>
                    <div>
                        MAC地址:
                        <span className='macAddress' id='macAddress'></span>
                        <img className='scanIcon' src={require('../imgs/timg.png')} alt="" onClick={this.scanMac}/>
                    </div>
                    {/*<List>*/}
                        {/*<InputItem*/}
                            {/*value=""*/}
                            {/*editable={false}*/}
                        {/*>MAC:</InputItem>*/}

                        {/*<InputItem*/}
                            {/*placeholder="please input content"*/}
                            {/*data-seed="logId"*/}
                        {/*>姓名:</InputItem>*/}

                        {/*<div className='chooseResult'>*/}
                            {/*{data2.map(i => (*/}
                                {/*<RadioItem key={i.value} checked={value2 === i.value}*/}
                                           {/*onChange={() => this.onChange2(i.value)}>*/}
                                    {/*{i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                {/*</RadioItem>*/}
                            {/*))}*/}
                        {/*</div>*/}
                    {/*</List>*/}

                    <div>
                        学生姓名:
                        <input type="text" onChange={this.inputOnChange.bind(this)}/>
                    </div>
                    <div className='binding' onClick={this.binding}>
                        <Button type="primary">确认绑定</Button>
                    </div>
                </div>
            </div>
        );
    }
}
