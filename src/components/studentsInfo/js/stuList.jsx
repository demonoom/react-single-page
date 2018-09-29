import React from 'react';
import '../css/stuList.less'
import {List, Toast, ListView, Button, InputItem, Radio, WhiteSpace, Modal} from 'antd-mobile';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const Item = List.Item;
const Brief = Item.Brief;
export default class stuList extends React.Component {

    constructor(props) {
        super(props);
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
        };

    }

    componentDidMount() {
        document.title = "孩子列表";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            userId: userId
        }, () => {
            //获取此家长下面的学生列表
            this.getBindedChildren();
        });

    }

    //获取此家长绑定的学生列表
    getBindedChildren() {
        var _this = this;
        var param = {
            "method": 'getBindedChildrenAndHeartRate',
            "parentId": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' && result.success) {
                    _this.buildStuLists(result.response)
                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }

    //设置心率阀值
    updateBindedChildrenAndHeartRate(){
        var param = {
            "method": 'updateBindedChildrenAndHeartRate',
            "userId": this.state.userId,
            "heartRate": this.state.heartRate
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' && result.success) {
                    console.log('设置成功')
                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }

    showModal(){
        console.log('弹窗')
    }

    buildStuLists(res) {
        var _this = this
        var arr = [<div>您绑定的孩子</div>]
        if (!WebServiceUtil.isEmpty(res)) {
            res.forEach(function (v, i) {
                arr.push(
                    <li className="StudentList">
                        姓名: {v.user.userName} <span
                        onClick={_this.weChatUnbindStduent.bind(this, v.user)}>解绑</span>
                        <div>
                            <span>心率阀值: {v.childrenHeartRate}</span>
                            <span onClick={_this.showModal.bind(_this)}>更改图标</span>
                        </div>
                    </li>
                )
            })
        }
        _this.setState({stuLis: arr, stuArr: res})
    }

    //家长解绑学生帐号
    weChatUnbindStduent = (stu) => {
        var _this = this
        var param = {
            "method": 'weChatUnbindStduent',
            "pId": this.state.userId,
            "studId": stu.colUid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' && result.success) {
                    Toast.success('解绑成功', 1)
                    var arr = _this.state.stuArr;
                    arr.forEach(function (v, i) {
                        if (v.colUid == stu.colUid) {
                            arr.splice(i, 1)
                        }
                    })
                    _this.buildStuLists(arr, _this.state.col_obj)
                }
            },
            onError: function (error) {
                Toast.info('验证用户类型请求失败');
            },
        });
    }


    render() {
        return (
            <div id="stuList">
                {this.state.stuLis}
            </div>
        );
    }
}
