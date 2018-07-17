import React from 'react';
import {
    Toast,
    Radio,
    ListView,
    Card,
    WingBlank,
    WhiteSpace,
    Modal,
    PullToRefresh
} from 'antd-mobile';

const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var bindDing;

export default class bindPeopleList extends React.Component {

    constructor(props) {
        super(props);
        bindDing = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            calmHeight: document.body.clientHeight - 296,
            searchCheckValue: '',
            macId: '',
            chooseResultDiv: 'none',
            stNameValue: '',
            searchData: [],
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '老人健康手环绑定列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        this.viewWatchPage(uid);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', bindDing.onWindowResize);
        // Toast.info(locationHref,100);
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', bindDing.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            bindDing.setState({ clientHeight: document.body.clientHeight, calmHeight: document.body.clientHeight - 296 });
        }, 100)
    }

    /**
     * 查看绑定的设备
     */
    viewWatchPage(uid) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'viewWatchPage',
            "aid": uid,
            "cid": -1,
            "pn": PageNo,
        };


        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    // var arr = result.response;
                    var arr = [
                        {
                            name: "aass",
                            macAddress: 123123123123123,
                            ID: 22222,
                            className: "zs"
                        }
                    ]
                    var pager = result.pager;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    if (arr.length > 0) {
                        if (pager.pageCount == 1 && pager.rsCount < 30) {
                            isLoading = false;
                        } else {
                            isLoading = true;
                        }
                    } else {
                        isLoading = false;
                    }
                    _this.initData = _this.initData.concat(arr);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: isLoading,
                        refreshing: false
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 解绑弹出框
     */
    showAlert = (data) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        var _this = this;
        const alertInstance = alert('您确定要解除绑定吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.unbindWatch(data) },
        ], phone);
    };

    /**
     * 解绑
     * @param obj
     */
    unbindWatch(obj) {
        var _this = this;
        var param = {
            "method": 'unbindWatch',
            "wid": obj.macAddress,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('解绑成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (obj.id == v.id) {
                            _this.initData.splice(i, 1);
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
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
     * 跳转绑定页面
     */
    toaddRing = () => {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "addOldPeople?uid=" + bindDing.state.uid);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    /**
     * 跳转健康详情页面
     */
    toHealthDetail = () => {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "healthDetail");
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
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
        this.setState({ isLoadingLeft: true, defaultPageNo: currentPageNo });
        _this.viewWatchPage(_this.state.loginUser);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({ defaultPageNo: 1, refreshing: true, isLoadingLeft: true });
        this.viewWatchPage(this.state.loginUser);
    }

    render() {

        var _this = this;

        const row = (rowData, sectionID, rowID) => {
            rowData = {
                macAddress: 123123123123123,
                ID: 22222,
                className: "zs"
            }
            console.log(rowData)
            return (
                <WingBlank size="lg">
                    <WhiteSpace size="lg" />
                    <Card>
                        <Card.Header
                            className='noomCardHeader studentCardHeader'
                            title={rowData.name}
                            // thumb={rowData.bindingUser.avatar}
                            //thumb='http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg'
                            extra={<div className="student_list2 text_hidden"><span>手环名称：</span><span>{rowData.ID}</span></div>}
                        />
                        <Card.Body>
                            <div className="student_contList">
                                
                                <div className="student_list text_hidden"><span>手环：</span><span>{rowData.macAddress}</span></div>
                            </div>
                            <div><span onClick={_this.showAlert.bind(this, rowData)}>解绑</span>
                                <span onClick={_this.toHealthDetail.bind(this, rowData)}>健康详情</span>
                            </div>
                            {/* <div className="studen_contList2">
                                <span className="class">班级：</span><span className="classinfo">{rowData.className}</span>
                            </div> */}
                        </Card.Body>
                    </Card>
                </WingBlank>
            )
        };

        return (
            <div id="bindPeopleList" style={{ height: bindDing.state.clientHeight }}>
                <div className='tableDiv' style={{ height: bindDing.state.clientHeight }}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{ paddingTop: 5, paddingBottom: 40, textAlign: 'center' }}>
                                {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                            </div>)}
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: bindDing.state.clientHeight,
                        }}
                        pullToRefresh={<PullToRefresh
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80}
                        />}
                    />
                    <div className='addBunton' onClick={this.toaddRing}>
                        绑定
                        {/* <img src={require("../imgs/addBtn.png")}/> */}
                    </div>
                </div>

            </div>
        );
    }
}
