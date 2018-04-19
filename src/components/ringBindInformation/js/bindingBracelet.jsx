import React from 'react';
import {Button, Toast, InputItem, List, Radio, Icon} from 'antd-mobile';
import '../css/bindingBracelet.less'

const RadioItem = Radio.RadioItem;
var bindDing;

export default class bindingBracelet extends React.Component {

    constructor(props) {
        super(props);
        bindDing = this;
        this.state = {
            tableDivHeight: document.body.clientHeight,
            searchCheckValue: '',
            macId: '',
            chooseResultDiv: 'none',
            stNameValue: '',
            searchData: [],
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
        $('.tableDiv').hide("fast");
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
        $('.tableDiv').show("fast");
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
            bindDing.setState({macId: mes});
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 绑定
     */
    binding = () => {
        var _this = this;
        if (this.state.searchCheckValue == '' || bindDing.state.macId == '') {
            Toast.fail('未选择学生或手环',)
            return
        }
        var param = {
            "method": 'bindWatch',
            "uid": this.state.searchCheckValue,
            "mac": bindDing.state.macId,
            "opId": this.state.loginUser.ident,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('绑定成功', 1);
                    $('.tableDiv').show("fast");
                    _this.viewWatchPage(_this.state.loginUser);
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
     * 搜索未绑定手环的用户
     */
    searchWatchBindCandidate = () => {
        Toast.loading('正在搜索');
        this.setState({searchData: []});
        var _this = this;
        if (this.state.stNameValue.trim().length == 0) {
            Toast.fail('请输入学生姓名', 1)
            return
        }
        var param = {
            "method": 'searchWatchBindCandidate',
            "keyWord": this.state.stNameValue.trim(),
            "aid": this.state.loginUser.ident
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = [];
                        result.response.forEach(function (v, i) {
                            var obj = {
                                value: v.colUid,
                                label: v.userName,
                                extra: `${v.clazz.name}  ${v.colAccount}`
                            }
                            arr.push(obj);
                        });
                        _this.setState({
                            chooseResultDiv: 'block',
                            searchData: arr,
                            stNameValue: result.response[0].userName,
                            searchCheckValue: result.response[0].colUid
                        });
                        Toast.hide();
                    } else {
                        Toast.fail('没有找到该学生', 1)
                    }
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    };

    /**
     * 输入框改变的回调
     */
    inputOnChange(e) {
        this.setState({stNameValue: e});
    }

    /**
     * 点击搜索结果的回调
     */
    searchResultOnChange = (i) => {
        // this.setState({chooseResultDiv: 'none'});   label
        this.setState({
            searchCheckValue: i.value,
            stNameValue: i.label
        });
    };

    render() {
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
                    <List>
                        <div className='macAddress'>
                            <InputItem
                                value={bindDing.state.macId}
                                editable={false}
                            >MAC:</InputItem>
                            <img className='scanIcon' src={require('../imgs/timg.png')} alt="" onClick={this.scanMac}/>
                        </div>

                        <div className='stName'>
                            <InputItem
                                placeholder="请输入学生姓名并搜索"
                                data-seed="logId"
                                onChange={this.inputOnChange.bind(this)}
                                value={this.state.stNameValue}
                            >姓名:</InputItem>
                            <Icon className='stIcon' type='search' onClick={this.searchWatchBindCandidate}/>
                        </div>

                        <div className='chooseResult' style={{display: this.state.chooseResultDiv}}>
                            {this.state.searchData.map(i => (
                                <RadioItem key={i.value} checked={this.state.searchCheckValue === i.value}
                                    /*这个checked的写法很好*/
                                           onChange={() => this.searchResultOnChange(i)}>
                                    {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                </RadioItem>
                            ))}
                        </div>
                    </List>
                    <div className='binding' onClick={this.binding}>
                        <Button type="primary">确认绑定</Button>
                    </div>
                </div>
            </div>
        );
    }
}
