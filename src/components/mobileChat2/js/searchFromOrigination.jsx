import React from 'react';
import {WhiteSpace, Button, Toast, List} from 'antd-mobile';
import '../css/searchFromOrigination.less'

var search_FromOrigination;

const {Item} = List;

export default class searchFromOrigination extends React.Component {

    constructor(props) {
        super(props);
        search_FromOrigination = this;
        this.state = {
            searchValue: '',
        };
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天";   //设置title

        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var colPasswd = searchArray[1].split('=')[1];
        var unionid = searchArray[2].split('=')[1];
        var schoolId = searchArray[3].split('=')[1];

        this.setState({userId, colPasswd, unionid, schoolId});
    }

    componentDidMount() {

    }

    searchBarOnChange(e) {
        search_FromOrigination.setState({searchValue: e.target.value})
    }

    searchStructureUsers() {

        if (search_FromOrigination.state.searchValue.length == 0) {
            Toast.fail('还未输入查找信息', 2)
            return
        }

        var _this = this;
        var param = {
            "method": 'searchStructureUsers',
            "operateUserId": search_FromOrigination.state.userId,
            "pageNo": -1,
            "searchOptions": JSON.stringify(
                {
                    "keywords": search_FromOrigination.state.searchValue,
                    "schoolId": search_FromOrigination.state.schoolId,
                    "userType": "TEAC",
                    "structureId": -1
                }
            )
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {

                    var data = result.response.filter(function (v) {
                        return (v.teacher.user.colUid != search_FromOrigination.state.userId)
                    })

                    search_FromOrigination.buildMembers(data)
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    buildMembers(data) {

        if (WebServiceUtil.isEmpty(data) == false) {
            var arr = [];
            data.forEach(function (v, i) {
                var item = <Item onClick={search_FromOrigination.membersOnClick(v)}>
                    <img className='userImg' src={v.teacher.user.avatar} alt=""/>
                    <span className="text_hidden origination_name">{v.teacher.user.userName}</span>
                </Item>
                arr.push(item)
            })
            search_FromOrigination.setState({memberList: arr})
        } else {
            Toast.fail('未搜到相关人员', 2)
            search_FromOrigination.setState({memberList: []})
        }
    }

    membersOnClick(v) {
        return () => {

            var colPasswd = search_FromOrigination.state.colPasswd

            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil2?fromId=' + search_FromOrigination.state.userId + '&toId=' + v.teacher.user.colUid + '&choosePos=te&unionid=' + search_FromOrigination.state.unionid + '&colPasswd=' + colPasswd + '&toName=' + v.teacher.user.userName + '&mesType=0')
        }
    }

    render() {

        var _this = this;

        return (
            <div id="searchFromOrigination">
                <WhiteSpace/>
                <div className="search-input">
                    <input
                        type="text"
                        placeholder="请输入账号/姓名"
                        value={this.state.searchValue}
                        onChange={this.searchBarOnChange}
                    />
                    <Button type="warning" onClick={this.searchStructureUsers}>查找</Button>
                </div>
                <WhiteSpace/>
                <div className="searchOrigination_cont">
                    {this.state.memberList}
                </div>

            </div>
        );
    }
}
