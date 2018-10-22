import React from 'react';
import '../css/warningAdminList.less'
import {List, Toast, ListView, Tabs, InputItem,Modal} from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

export default class warningAdminList extends React.Component {

    constructor(props) {
        super(props);
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var schoolId = locationSearch.split("&")[0].split('=')[1];
        var userId = locationSearch.split("&")[1].split('=')[1];
        console.log(userId);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            clientHeight: document.body.clientHeight,
            defaultPageNo: 1,
            listData: [],
            hasMore:true,
            schoolId: schoolId,   //
            userId:userId
        };

    }

    componentDidMount() {

        document.title = "预警人员管理";
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.setState({
            dataSource: dataSource.cloneWithRows(this.state.listData)
        })
        this.getBraceletDangerAreaManagerBySchoolId(this.state.schoolId);
    }

    //通过学校id获取预警人员列表
    getBraceletDangerAreaManagerBySchoolId(schoolId) {
        var PageNo = this.state.defaultPageNo;
        var param = {
                "method": 'getBraceletDangerAreaManagerBySchoolId',
                "schoolId": schoolId,
                "pageNo": PageNo,
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result.response);
                if (result.msg == '调用成功' || result.success) {
                    var arr = result.response;
                    var pager = result.pager;
                    var isLoading = false;
                    var hasMore = true;
                    if (arr.length > 0) {
                        // for(var i = 0 ;i< 30;i++){
                        //     arr.push(arr[0]);
                        // }
                        if (pager.pageCount == 1 && pager.rsCount < 30) {
                            isLoading = false;
                        } else {
                            isLoading = true;
                        }
                    } else {
                        isLoading = false;
                        hasMore = false;
                    }
                    this.initData = this.initData.concat(arr);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.initData),
                        isLoadingLeft: isLoading,
                        hasMore: hasMore,
                    })
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
            }
        });
    }

    //删除人员事件
    deleteItem(id,userName){
        this.showAlert(function(){
            // 确定
            console.log('准备删除'+id);
            this.deleteDangerAreaManager(id);
        }.bind(this),function(){
            // 取消
            console.log('已取消')
        }.bind(this),userName)
    }

    //删除请求
    deleteDangerAreaManager(userId){
        var param = {
            "method": 'deleteDangerAreaManager',
            "id": userId,
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.response && result.success) {
                    Toast.info("删除成功",1);
                    this.initData = [];
                    this.getBraceletDangerAreaManagerBySchoolId(this.state.schoolId);
                }else{
                    Toast.info('删除失败')
                }
            },
            onError: function (error) {
            }
        });
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

        const alertInstance = alert('确定删除'+userName+'吗?', '', [
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

    //跳转至添加预警人员页面
    toAddAdmin(){
        var url = WebServiceUtil.mobileServiceURL + "addWarnAdmin?userId="+this.state.userId;
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }


    //获取地址栏指定参数
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
        _this.getBraceletDangerAreaManagerBySchoolId();
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(this.initData),
        //     isLoadingLeft: true,
        // });
    };


    render() {

        const row = (item) => {
            return (
                <List className="my-list">
                    <Item align="top" thumb={item.avatar}
                          multipleLine>
                        {item.userName} <Brief>{item.colUtype}</Brief>
                        <div className="itemDelete deleteBtn_common" onClick={this.deleteItem.bind(this,item.colUid,item.userName)}></div>
                    </Item>
                </List>
            )
        };
        return (
            <div id="warningAdminList">
                {/*{this.state.listInnerHTML}*/}
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                            {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list notifyList"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: this.state.clientHeight,
                    }}
                />
                <div className="addBunton" onClick={this.toAddAdmin.bind(this)}>
                    <img src={require("../imgs/addBtn.png")}/>
                </div>
            </div>
        );
    }
}
