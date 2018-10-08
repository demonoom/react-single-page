import React from 'react';
import {ListView, Toast, List, WhiteSpace, SearchBar} from 'antd-mobile';
import '../css/originationList.less'

var origination_List;
const {Item} = List;

export default class originationList extends React.Component {

    constructor(props) {
        super(props);
        origination_List = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];

        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            userId: '',
            unionid: '',        //微信登录的unionid
            structureArr: [],
            structureSpanArr: []
        };
    }

    componentWillMount() {

        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var colPasswd = searchArray[1].split('=')[1];
        var unionid = searchArray[2].split('=')[1];
        var structureId = searchArray[3].split('=')[1];
        var schoolId = searchArray[4].split('=')[1];

        this.setState({userId, colPasswd, unionid, structureId, schoolId});
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        this.setState({
            phone:phone
        })
    }

    componentDidMount() {
        this.getStructureById(true, false)
        window.addEventListener('hashchange', this.onhashchange)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onhashchange);
    }

    /**
     * 页面url发送变化
     * 重新reload
     */
    onhashchange() {
        location.reload();
    }

    /**
     * 获取根组织信息
     * id
     * name
     */
    getStructureById(flag, structureId) {

        var _this = this;
        var param = {
            "method": 'getStructureById',
            "operateUserId": this.state.userId,
            "structureId": structureId || this.state.structureId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    _this.state.structureArr.unshift(result.response);

                    if (flag) {
                        document.title = result.response.name;   //设置title
                        _this.listStructures(result.response.id)
                        _this.getStrcutureMembers(result.response.id)
                    }

                    if (WebServiceUtil.isEmpty(result.response.parent) == false) {
                        // 倒退部门,构建数组对象
                        _this.getStructureById(false, result.response.parent.id)
                    } else {
                        _this.buildStructureArr()
                    }

                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

    }

    /**
     * 列举子部门
     * @param id
     */
    listStructures(id) {
        var _this = this;
        var param = {
            "method": 'listStructures',
            "operateUserId": this.state.userId,
            "structureId": id,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {

                    _this.buildStructures(result.response)

                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 列举子部门下的人
     * @param id
     */
    getStrcutureMembers(id) {

        var _this = this;
        var param = {
            "method": 'getStrcutureMembers',
            "operateUserId": this.state.userId,
            "structureId": id,
            "pageNo": -1,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    _this.buildStrcutureMembers(result.response)

                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 构建组织内部门
     * 没有子部门就不必显示
     * @param data
     */
    buildStructures(data) {
        if (WebServiceUtil.isEmpty(data) == false) {
            var arr = []
            data.forEach(function (v, i) {
                var item = <Item onClick={origination_List.structuresOnClick(v)}>
                    <span className="text_hidden origination_name">{v.name}</span>
                    <span className="group_number">{v.memberCount}人</span>
                    <div className="am-list-arrow am-list-arrow-horizontal"></div>
                </Item>
                arr.push(item)
            })
            origination_List.setState({structuresItem: arr})
        }
    }

    /**
     * 构建部门成员
     * @param data
     */
    buildStrcutureMembers(data) {
        if (WebServiceUtil.isEmpty(data) == false) {
            var arr = []
            data.forEach(function (v, i) {
                var item = <Item onClick={origination_List.membersOnClick(v)}>
                    <img className='userImg' src={v.user.avatar}/>
                    <span className="text_hidden">{v.user.userName}</span>
                </Item>
                arr.push(item)
            })
            origination_List.setState({membersItem: arr})
        }
    }

    /**
     * 部门被点击,跳转页面到本页
     * @param v
     * @returns {function()}
     */
    structuresOnClick(v) {
        return () => {

            var colPasswd = origination_List.state.colPasswd;
            var unionid = origination_List.state.unionid;

            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'originationList?fromId=' + origination_List.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&structureId=' + v.id + '&schoolId=' + origination_List.state.schoolId)
        }
    }

    /**
     * 人员被点击,跳转到聊天
     * @param v
     * @returns {function()}
     */
    membersOnClick(v) {
        return () => {

            var colPasswd = this.state.colPasswd

            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil?fromId=' + this.state.userId + '&toId=' + v.user.colUid + '&choosePos=' + this.state.choosePos + '&unionid=' + this.state.unionid + '&colPasswd=' + colPasswd + '&toName=' + v.user.userName + '&mesType=0')
        }
    }

    /**
     * 搜索被点击,跳转至搜索界面
     */
    searchBarOnClick() {

        var colPasswd = origination_List.state.colPasswd;
        var unionid = origination_List.state.unionid;
        var schoolId = origination_List.state.schoolId;

        window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'searchFromOrigination?fromId=' + origination_List.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&schoolId=' + schoolId)
    }

    /**
     * 构建部门条
     */
    buildStructureArr() {
        var arr = []
        origination_List.state.structureArr.forEach(function (v, i) {
            if (i == origination_List.state.structureArr.length - 1) {
                arr.push(
                    <span onClick={origination_List.structureSpanArrOnClick(v)}>{v.name}</span>
                )
            } else {
                arr.push(
                    <span onClick={origination_List.structureSpanArrOnClick(v)}>{v.name}<span className="originationName_arrow">></span></span>
                )
            }
        })
        origination_List.setState({structureSpanArr: arr})
    }

    /**
     * 部门条被点击,跳转
     * 如果点击的部门id==目前的id,return
     * @param data
     * @returns {function()}
     */
    structureSpanArrOnClick(data) {
        return () => {
            if (data.id != origination_List.state.structureId && origination_List.state.structureArr.length != 1) {

                var colPasswd = origination_List.state.colPasswd;
                var unionid = origination_List.state.unionid;

                window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'originationList?fromId=' + origination_List.state.userId + '&colPasswd=' + colPasswd + '&unionid=' + unionid + '&structureId=' + data.id + '&schoolId=' + origination_List.state.schoolId)
            }
        }
    }

    render() {

        var _this = this;

        return (
            <div id="originationList">
                <div id="friendList">
                    <div className="origination_top">
                        <WhiteSpace/>
                        <div onClick={this.searchBarOnClick}>
                            <SearchBar
                                value={this.state.value}
                                placeholder="请输入账号/姓名"
                                disabled={true}
                            />
                        </div>
                        <WhiteSpace/>
                        <Item className="originationName">
                            {this.state.structureSpanArr}
                        </Item>
                        <WhiteSpace/>
                    </div>
                    <div className="origination_cont">
                        <div>
                            {this.state.structuresItem}
                        </div>

                        <WhiteSpace/>

                        <div>
                            {this.state.membersItem}
                        </div>
                    </div>
                </div>
                <div style={
                    this.state.phone == 'ios'?{display:'none'}:{display:'block'}
                } className="contactsListNav">
                    <div className="line_public"></div>
                    <div className="nav-left" onClick={()=>{window.history.back()}}></div>
                    <div className="nav-right" onClick={()=>{window.history.go(1)}}></div>
                </div>
            </div>
        );
    }
}
