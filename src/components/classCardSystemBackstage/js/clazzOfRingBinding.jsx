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
            page: 1,
            isLoadingMore: true,
            hasMoreClass: true,
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
        this.state.page = 1;
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
        if (this.input.value === '') {
            this.getClazzesByUserId(this.state.ident);
            return
        }
        var param = {
            "method": 'viewWatchPage',
            "aid": loginUser,
            "cid": '-1',
            "searchKeyWords": this.input.value,
            "pn": this.state.page,
        };
        if (this.state.page == 1) {
            this.state.listData = []
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    if (_this.state.page === result.pager.pageCount) {
                        _this.setState({hasMoreClass: false})
                    }
                    _this.setState({
                        dataType: 2,
                        listData: _this.state.listData.concat(result.response),
                        isLoadingMore: false,
                        page: _this.state.page + 1,
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    loadMoreHandle = () => {
        console.log(1);
    }

    render() {
        let items = [];
        let item = this.state.listData;
        console.log(item, 'item');
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
                <span style={{display: this.state.dataType == 1 ? 'none' : ''}}>
                    {

                        this.state.hasMoreClass ? this.state.isLoadingMore ? <span>加载中...</span> :
                            <span onClick={this.loadMoreHandle}>加载更多</span> : <span>没有更多了</span>
                    }
                </span>
            </div>
        );
    }
}