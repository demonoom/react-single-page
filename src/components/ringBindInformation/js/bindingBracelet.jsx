import React from 'react';
import {
    Toast,
    InputItem,
    List,
    Radio,
    Icon,
    ListView,
    Card,
    WingBlank,
    WhiteSpace,
    Modal,
    PullToRefresh
} from 'antd-mobile';
import '../css/bindingBracelet.less'

const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var bindDing;

export default class bindingBracelet extends React.Component {

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
        document.title = '手环绑定学生信息';
        var loginUser = JSON.parse(localStorage.getItem('loginUserRingBind'));
        this.setState({loginUser});
        this.viewWatchPage(loginUser);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', bindDing.onWindowResize)
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
            bindDing.setState({clientHeight: document.body.clientHeight, calmHeight: document.body.clientHeight - 296});
        }, 100)
    }

    /**
     * 查看绑定的设备
     */
    viewWatchPage(loginUser) {
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
            "aid": loginUser.ident,
            "cid": -1,
            "pn": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
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
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.unbindWatch(data)},
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
        $('.tableDiv').hide("fast");
    };

    /**
     * 关闭添加手环的界面
     */
    cancelAddModel = () => {
        $('.tableDiv').show("fast");
        this.state.macId = '';
        this.state.stNameValue = '';
        this.setState({chooseResultDiv: 'none'});
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
            // var string = mes.replace(/:/g, '');
            // if (string.length > 16) {
            //     Toast.fail('mac地址超过最大字节数', 2)
            //     return
            // }
            bindDing.setState({macId: mes});
        }, function (error) {
            console.log(error);
        });
    };

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
                    _this.state.macId = '';
                    _this.state.stNameValue = '';
                    _this.setState({chooseResultDiv: 'none'});
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
                            var clazzStr = '';
                            v.clazzList.forEach(function (v) {
                                clazzStr += v.name + ',';
                            })
                            clazzStr = clazzStr.substr(0, clazzStr.length - 1);
                            var obj = {
                                value: v.colUid,
                                label: v.userName,
                                extra: `${clazzStr}`,
                                extra1: `${v.colAccount}`
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
        _this.viewWatchPage(_this.state.loginUser);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({defaultPageNo: 1, refreshing: true, isLoadingLeft: true});
        this.viewWatchPage(this.state.loginUser);
    }

    render() {

        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            return (
                <WingBlank size="lg">
                    <WhiteSpace size="lg"/>
                    <Card>
                        <Card.Header
                            className='noomCardHeader'
                            title={rowData.name}
                            thumb={rowData.bindingUser.avatar}
                            //thumb='http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg'
                            extra={<span className='noomCardUnbind'
                                         onClick={_this.showAlert.bind(this, rowData)}>解绑</span>}
                        />
                        <Card.Body>
                            <div>MAC:{rowData.macAddress}</div>
                        </Card.Body>
                        <Card.Footer content={"班级" + ":" + rowData.bindingUser.clazz.name}
                                     extra={<div>ID:{rowData.bindingUser.colAccount}</div>}/>
                    </Card>
                </WingBlank>
            )
        };

        return (
            <div id="bindingBracelet" style={{height: bindDing.state.clientHeight}}>
                <div className='tableDiv' style={{height: bindDing.state.clientHeight}}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
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
                    <div className='addBunton' onClick={this.addRing}>
                        <img src={require("../imgs/addBtn.png")}/>
                    </div>
                </div>
                <div className='addModel' style={{height: bindDing.state.clientHeight}}>


                    <List>
                        <div className='macAddress'>
                            <InputItem
                                value={bindDing.state.macId}
                                editable={false}
                            >MAC:</InputItem>
                            <img className='scanIcon' src={require('../imgs/icon_scan.png')} alt="" onClick={this.scanMac}/>
                        </div>

                        <div className='stName'>
                            <InputItem
                                placeholder="请输入学生姓名并搜索"
                                data-seed="logId"
                                onChange={this.inputOnChange.bind(this)}
                                value={this.state.stNameValue}
                            >姓名:</InputItem>
                            <img id='stIcon' className='stIcon' src={require('../imgs/icon_search.png')}
                                 onClick={this.searchWatchBindCandidate}/>
                        </div>

                        <div className='chooseResult'
                             style={{display: this.state.chooseResultDiv, height: this.state.calmHeight}}>
                            {this.state.searchData.map(i => (
                                <div onClick={() => this.searchResultOnChange(i)}>
                                    <RadioItem key={i.value} checked={this.state.searchCheckValue === i.value}
                                        /*这个checked的写法很好*/
                                    >
                                        {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                        <List.Item.Brief>{i.extra1}</List.Item.Brief>
                                    </RadioItem>
                                </div>
                            ))}
                        </div>
                    </List>
                    <div className="bottomBox">
                        <span onClick={this.cancelAddModel} className="close">关闭</span>
                        <span className="bind" onClick={this.binding}>确认绑定</span>
                    </div>

                </div>
            </div>
        );
    }
}
