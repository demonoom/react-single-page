import React from 'react';
import '../css/addWarnAdmin.less'
import {SearchBar,List, Toast, Modal, Tabs, InputItem} from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;


export default class addWarnAdmin extends React.Component {

    constructor(props) {
        super(props);
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        this.state = {
            listData: [],
            listInnerHTML: [],
            userId: userId,
            clientHeight: document.body.clientHeight,
        };

    }

    componentDidMount() {
        document.title = "添加预警人员";
    }


    //开始搜索
    searchSubmit(event){
        this.searchTeacher(this.state.userId,event);
    }

    //添加预警人员
    saveDangerAreaManager(userId,schoolId){
        var param = {
            "method": 'saveDangerAreaManager',
            "schoolId": schoolId,
            "userId": userId,
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'result')
                if (result.msg == '调用成功' || result.success) {
                    Toast.info("添加成功",0.5);
                    this.navBack();
                }else{
                    Toast.info('已经添加该老师!',1);
                }
            },
            onError: function (error) {
                Toast.info('搜索失败', 1);
            }
        });
    }

    navBack(){
        var data = {
            method: 'finishForRefresh',
        };

        Bridge.callHandler(data, null, function (error) {
            // console.log(error);
        });
    }


    searchTeacher(aid,userName){
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'searchTeacher',
            "aid": aid,
            "keyWord": userName,
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log();
                if(!result.response[0]){
                    Toast.info('无搜索结果!',1);
                    return;
                }
                if (result.msg == '调用成功' || result.success) {
                    //构建html以及写入全局变量
                    var arr = [];
                    result.response.forEach(function (value, index) {
                        // console.log(value.name);
                        let html = <List className="my-list">
                            <Item align="top" thumb={value.avatar}
                                  multipleLine>
                                {value.userName} <Brief>{value.colAccount}</Brief>
                                <div className="itemAdd" onClick={this.addItem.bind(this,value.colUid,value.userName,value.schoolId)}>添加</div>
                            </Item>
                        </List>
                        arr.push(html);
                    }.bind(this))
                    this.setState({
                        listInnerHTML:arr,
                    })
                }
            },
            onError: function (error) {
                Toast.info('搜索失败', error);
            }
        });
    }

    //获取地址栏指定参数
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


    //显示弹出框
    showAlert = (success, cancel,userName) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        const alertInstance = alert('确定添加'+userName+'为预警人员吗?','', [
            {
                text: '取消', onPress: () => {
                if (cancel) {
                    cancel();
                }
            }, style: 'default'
            },
            {
                text: '确定', onPress: () => {
                if (success) {
                    success()
                }
            }
            },
        ], phone);
    }

    addItem(userId,userName,schoolId){
        this.showAlert(function(){
            // console.log('添加成功')
            this.saveDangerAreaManager(userId,schoolId);

        }.bind(this),function(){
            console.log('取消');
        }.bind(this),userName)
        // console.log('添加成功'+event);
    }

    render() {

        return (
            <div id="addWarnAdmin">
                <SearchBar showCancelButton={true} cancelText="搜索" onCancel={this.searchSubmit.bind(this)} onSubmit={this.searchSubmit.bind(this)} placeholder="请输入预警人姓名" maxLength={8} />
                <div className='content_box' style={{height:this.state.clientHeight - 52 + 'px',overflow:'auto'}}>
                    {this.state.listInnerHTML}
                </div>
            </div>
        );
    }
}
