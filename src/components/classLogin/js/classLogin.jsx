import React from "react";
import { Toast } from "antd-mobile"
import "../css/classLogin.less"
import { SimpleWebsocketConnection } from '../../../helpers/simple_websocket_connection'
export default class classLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountArr: []
        }
    }
    componentDidMount() {
        document.title = "登录页面";
        var machineId = '';
        var simple = new SimpleWebsocketConnection();
        simple.connect();
        machineId = this.createMachineId();
        simple.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: function (info) {
                var command = info.command;
                if (command == "allowLoginTeachSystem") {
                    var data = info.data;
                    var uuid = data.uuid;
                    if (uuid == machineId) {
                        // var url = WebServiceUtil.mobileServiceURL + 'classSortPage?teacherId=' + data.user.colUid + '&teacherName=' + data.user.userName + '';
                        var url = WebServiceUtil.mobileServiceURL + 'classSortPage?teacherId=' + data.user.colUid + '&fileId=-1&title=蚁盘题目&phoneType=0';
                        var data = {
                            method: 'openNewPage',
                            url: url,
                        };
                        Bridge.callHandler(data, null, function (error) {
                            window.location.href = url;
                        });
                    } else {
                    }
                }
            }
        };
    }


    /**
    * 去重
    * @param arr
    * @returns {*}
    */
    makeArr = function (arr, properties) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i][properties] == arr[j][properties]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr
    }

    /**
     * 创建uuid
     */
    createMachineId = () => {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    /**
     * 登录
     */
    login = () => {
        if ($('#act').val().trim() == '') {
            alert('请输入账号');
            return;
        } else if ($('#pwd').val().trim() == '') {
            alert('请输入密码');
            return;
        }
        var _this = this;
        var param = {
            "method": "login",
            "username": $('#act').val().trim(),
            "password": $('#pwd').val().trim()
        };
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res)=> {
                if (res.success) {
                    if ($("#act").val() !== "" && $("#pwd").val() !== "") {
                        var accountArr = [];
                        accountArr.push({
                            account: $("#act").val(),
                            password: $("#pwd").val()
                        });
                    }
                    var tempArr = JSON.parse(localStorage.getItem("accountData")) == null ? this.state.accountArr : JSON.parse(localStorage.getItem("accountData"));
                    accountArr = accountArr.concat(tempArr);
                    accountArr = _this.makeArr(accountArr, "account");
                    localStorage.setItem('accountData', JSON.stringify(accountArr));
                    this.setState({
                        accountArr:this.state.accountArr.concat(accountArr)
                    },()=>{
                    })
                    var url = WebServiceUtil.mobileServiceURL + 'classSortPage?teacherId=' + res.response.colUid + '&fileId=-1&title=蚁盘题目&phoneType=0';
                    var data = {
                        method: 'openNewPage',
                        url: url,
                    };
                    Bridge.callHandler(data, null, function (error) {
                        window.location.href = url;
                    });
                } else {
                    Toast.fail(res.msg);
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    /**
     * 账户失去聚焦
     */
    accountOnBlur=()=>{
        setTimeout(function () {
            $("#actData").css("display", "none");
        }, 300)
    }
    /**
     * 账户聚焦
     */
    accountFocus=()=>{
        var accountArr = [];
        accountArr = JSON.parse(localStorage.getItem("accountData")) == null ? accountArr : JSON.parse(localStorage.getItem("accountData"));
        this.setState({
            accountArr: this.makeArr(accountArr, "account")
        },()=>{
            $("#actData").css("display", "block");
        })
    }
    /**
     * 选择账户
     */
    getAccount = (account,password)=>{
        $("#act").val(account);
        $("#pwd").val(password);
    }
    /**
     * 删除账户
     */
    deleteAccount = (index)=>{
        this.state.accountArr = JSON.parse(localStorage.getItem("accountData")) == null ?  this.state.accountArr : JSON.parse(localStorage.getItem("accountData"));
        this.state.accountArr.forEach((v,i)=>{
            if(i == index){
                this.state.accountArr.splice(i,1);
                this.setState({
                    accountArr:this.state.accountArr
                },()=>{
                    localStorage.setItem('accountData', JSON.stringify(this.state.accountArr));

                })
            }
        })
     
    }
    render() {
        return (
            <div>
                <div>
                    <div id="account">账号登录</div>
                </div>
                <div className="account">
                    <div className="inputWrap">
                        <input id='act' onBlur={this.accountOnBlur} onFocus={this.accountFocus} type="text"  placeholder="请输入小蚂蚁账号" />
                        <div style={{ display: "none" }} id="actData">
                        {
                            this.state.accountArr.map((v,i)=>{
                                return(
                                    <div>
                                    <span onClick={this.getAccount.bind(this,v.account,v.password)}>{v.account}</span>
                                    <span onClick={this.deleteAccount.bind(this,i)}>删除</span>

                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                    <input id="pwd" type="password" placeholder="请输入密码" />
                    <button id="login" onClick={this.login}>登录</button>
                </div>
                <div className="scan">
                    <img id="scan_image" src="./img/school.png" alt="" />
                    <div>打开手机小蚂蚁教师端扫一扫</div>
                </div>
            </div>
        )
    }
}