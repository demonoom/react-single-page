import React from 'react';
import {Button, Toast, InputItem, List, Radio, Icon, ListView, Card, WingBlank, WhiteSpace} from 'antd-mobile';
import '../css/bindingBracelet.less'

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
            tableDivHeight: document.body.clientHeight,
            searchCheckValue: '',
            macId: '',
            chooseResultDiv: 'none',
            stNameValue: '',
            searchData: [],
        };
    }

    componentDidMount() {
        var loginUser = JSON.parse(localStorage.getItem('loginUserRingBind'));
        this.setState({loginUser});
        this.viewWatchPage(loginUser);
    }

    /**
     * 查看绑定的设备
     */
    viewWatchPage(loginUser) {
        var _this = this;
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
     * 解绑
     * @param obj
     */
    unbindWatch(obj) {
        var param = {
            "method": 'unbindWatch',
            "wid": obj.macAddress,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('解绑成功', 1);
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
        // var _this = this;
        // var height = this.state.tableDivHeight;
        // var timer = setInterval(function () {
        //     height -= 30;
        //     _this.setState({tableDivHeight: height});
        //     if (height <= 0) {
        //         clearInterval(timer);
        //     }
        // }, 10);
        $('.tableDiv').hide("fast");
    };

    /**
     * 关闭添加手环的界面
     */
    cancelAddModel = () => {
        // var _this = this;
        // var windowHeight = document.body.clientHeight;
        // var height = this.state.tableDivHeight;
        // var timer = setInterval(function () {
        //     height += 30;
        //     _this.setState({tableDivHeight: height});
        //     if (height >= windowHeight) {
        //         clearInterval(timer);
        //     }
        // }, 10);
        $('.tableDiv').show("fast");
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
                console.log(result);
                if (result.msg == '调用成功' && result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = [];
                        result.response.forEach(function (v, i) {
                            var obj = {
                                value: v.colUid,
                                label: v.userName,
                                extra: `${v.clazz.name}  ${v.colAccount}`
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
                            // thumb={rowData.bindingUser.avatar}
                            thumb='http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg'
                            extra={<span className='noomCardUnbind'
                                         onClick={_this.unbindWatch.bind(this, rowData)}>解绑</span>}
                        />
                        <Card.Body>
                            <div>{rowData.macAddress}</div>
                        </Card.Body>
                        <Card.Footer content={rowData.bindingUser.clazz.name}
                                     extra={<div>{rowData.bindingUser.colAccount}</div>}/>
                    </Card>
                    <WhiteSpace size="lg"/>
                </WingBlank>
            )
        };

        return (
            <div id="bindingBracelet" style={{height: document.body.clientHeight}}>
                <div className='tableDiv' style={{height: this.state.tableDivHeight}}>
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
                            height: this.state.tableDivHeight,
                        }}
                    />
                    <div className='addBunton' onClick={this.addRing}>+</div>
                </div>
            
                <div className='addModel' style={{height: document.body.clientHeight}}>
                    <div onClick={this.cancelAddModel} className="close" >
                        关闭
                    </div>
                    <h1>新增手环</h1>
                    <List>
                        <div className='macAddress'>
                            <InputItem
                                value={bindDing.state.macId}
                                editable={false}
                            >MAC:</InputItem>
                            <img className='scanIcon' src={require('../imgs/timg.png')} alt="" onClick={this.scanMac}/>
                        </div>

                        <div className='stName'>
                            <InputItem
                                placeholder="请输入学生姓名并搜索"
                                data-seed="logId"
                                onChange={this.inputOnChange.bind(this)}
                                value={this.state.stNameValue}
                            >姓名:</InputItem>
                            <Icon className='stIcon' type='search' onClick={this.searchWatchBindCandidate}/>
                        </div>

                        <div className='chooseResult' style={{display: this.state.chooseResultDiv}}>
                            {this.state.searchData.map(i => (
                                <RadioItem key={i.value} checked={this.state.searchCheckValue === i.value}
                                    /*这个checked的写法很好*/
                                           onChange={() => this.searchResultOnChange(i)}>
                                    {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                </RadioItem>
                            ))}
                        </div>
                    </List>
                    <div className='binding' onClick={this.binding}>
                        <Button type="primary">确认绑定</Button>
                    </div>
                </div>
            </div>
        );
    }
}
