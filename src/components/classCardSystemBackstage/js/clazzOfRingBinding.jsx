import React from 'react';
import {Icon, Toast} from 'antd-mobile';

import "../css/clazzDutyList.less"

var classD;
var timer;
/**
 * clazzOfRingBinding 手环绑定的班级列表
 */
export default class clazzOfRingBinding extends React.Component {

    constructor(props) {
        super(props);
        classD = this;
        this.state = {
            dataType: 1,  //1是班级2是学生
        };
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        this.setState({ident})
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '手环绑定学生班级列表';
        this.getClazzesByUserId(this.state.ident);
    }

    /**
     * 获取此用户所在班级
     */
    getClazzesByUserId(ident) {
        var _this = this;
        var param = {
            // "method": 'searchClazz',
            "method": 'searchClazzByUserId',
            "userId": ident,
            "keyWord": "",
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        _this.setState({
                            listData: result.response
                            , dataType: 1
                        })
                    }
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });
    }

    /**
     * 跳转至绑定手环界面
     */
    turnToRingBindPage(id, name) {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "bindingBracelet?clazzId=" + id + "&clazzName=" + name + "&uid=" + classD.state.ident);
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    clearSearch = () => {
        this.input.value = '';
        this.setState({showClear: false})
        this.viewWatchPage(this.state.loginUser);
    }

    searchInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.viewWatchPage(this.state.ident);
        }, 400);
        this.setState({
            showClear: (this.input.value != '')
        })
    }

    viewWatchPage = (loginUser) => {
        var _this = this;
        // _this.state.dataSource = [];
        // _this.state.dataSource = new ListView.DataSource({
        //     rowHasChanged: (row1, row2) => row1 !== row2,
        // });
        // const dataBlob = {};
        // var PageNo = this.state.defaultPageNo;
        if (this.input.value === '') {
            this.getClazzesByUserId(this.state.ident);
            return
        }
        var param = {
            "method": 'viewWatchPage',
            "aid": loginUser,
            "cid": '-1',
            "searchKeyWords": this.input.value,
            "pn": 1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    _this.setState({listData: arr, dataType: 2})
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        let items = [];
        let item = this.state.listData;
        console.log(item);
        for (var k in item) {
            if (this.state.dataType == 1) {
                items.push(<li className="am-list-item am-list-item-middle"
                               onClick={this.turnToRingBindPage.bind(this, item[k].id, item[k].name)}>
                    <div className="am-list-line">
                        <div className="am-list-content">
                            {item[k].name}
                        </div>
                        <div className="am-list-arrow am-list-arrow-horizontal"></div>

                    </div>
                </li>);
            } else {
                items.push(<li className="am-list-item am-list-item-middle">
                    <div className="am-list-line">
                        <img src={item[k].bindingUser.avatar} alt=""/>
                        <div className="am-list-content">
                            {item[k].name}
                        </div>
                        <div>
                            MAC:{item[k].macAddress}
                        </div>
                        <div>
                            ID:{item[k].colAccount}
                        </div>
                        <div>解绑</div>
                    </div>
                </li>);
            }

        }
        return (
            <div id="clazzDutyList" style={{height: document.body.clientHeight, overflow: "auto"}}>
                <div className="nav search-nav">
                    <i></i><input type="text" ref={input => this.input = input} onInput={this.searchInput.bind(this)}
                                  placeholder="请搜索不存在于班级内的学生"/><span style={
                    this.state.showClear ? {display: 'block'} : {display: 'none'}
                } onClick={this.clearSearch} className="close"></span>
                </div>
                <div className="noticeMsg_common">请在列表中选择班级进行设置</div>
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
}