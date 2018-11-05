import React from 'react';
import {
    ListView,
    Modal,
    Toast,
    Switch,
    List,
    Button
} from 'antd-mobile';
import {createForm} from 'rc-form';


import '../css/ClassTimingList.less'

var classBinding;
const prompt = Modal.prompt;
const alert = Modal.alert;

export default class ClassTimingList extends React.Component {

    constructor(props) {
        super(props);
        classBinding = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            clientHeight: document.body.clientHeight,
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班牌定时';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var sid = locationSearch.split("&")[1].split("=")[1];
        this.setState({uid, sid}, () => {
            this.getClazzPlanListByUid();
        });
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', classBinding.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', classBinding.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            classBinding.setState({clientHeight: document.body.clientHeight});
        }, 100)
    }

    /**
     * 根据管理员id获取开关机计划列表
     */
    getClazzPlanListByUid() {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var param = {
            "method": 'getClazzPlanListByUid',
            "uid": _this.state.uid,
            "sid": _this.state.sid,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    _this.initData = _this.initData.concat(arr);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: false,
                        refreshing: false
                    })
                }
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 去课表列表
     **/
    turnToClassTableDetil(rowData) {
        var currentAttendanceListUrl = encodeURI(WebServiceUtil.mobileServiceURL + "ClassTimingItem?pId=" + rowData.pid);

        var data = {
            method: 'openNewPage',
            url: currentAttendanceListUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = currentAttendanceListUrl;
        });
    }

    creatNewTable() {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        prompt('添加任务名称', '', [
            {text: '取消'},
            {text: '确定', onPress: value => classBinding.creatNewT(value)},
        ], 'default', '', [], phone)
        if (phone == 'ios') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    /**
     *  删除定时任务计划
     *  delClazzPlan(String uid,String pid)
     * @param data
     */
    delTable(data) {
        var _this = this;
        var param = {
            "method": 'delClazzPlan',
            "uid": _this.state.uid,
            "pid": data.pid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('删除成功', 1)
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (data.pid == v.pid) {
                            _this.initData.splice(i, 1);
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                }
            },
            onError: function (error) {
                Toast.fail('删除失败');
            }
        });
    }

    /**
     * 删除弹出框
     */
    showAlert = (data, event) => {
        event.stopPropagation();
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定要删除该任务吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delTable(data)},
        ], phone);
    };

    /**
     * 添加新的定时任务
     * saveClazzPlan（String sid，String uid，String name
     **/
    creatNewT(value) {
        var _this = this;
        var param = {
            "method": 'saveClazzPlan',
            "sid": _this.state.sid,
            "uid": _this.state.uid,
            "name": value,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('新建成功', 1)
                    _this.getClazzPlanListByUid()
                } else {
                    Toast.fail(result.msg, 2)
                }
            },
            onError: function (error) {
                Toast.warn('保存失败');
            }
        });
    }

    /**
     * 启用，禁用计划
     * updateClazzPlan(String uid,String sid,String pid,String state
     **/
    changeStatus(checked, rowData) {
        debugger
        var _this = this;
        var param = {
            "method": 'updateClazzPlan',
            "uid": rowData.uid,
            "sid": rowData.sid,
            "pid": rowData.pid,
            "state": checked ? '1' : '0',
        };
        var status,
            str;
        if (checked) {
            status = 1
            str = '启用成功'
        } else {
            status = 0
            str = '停用成功'
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success(str, 1)
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (rowData.pid == v.pid) {
                            v.state = status;
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                } else {
                    Toast.fail(result.msg, 3)
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (rowData.pid == v.pid) {
                            v.state = 0;
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                }
            },
            onError: function (error) {
                Toast.warn('修改失败');
            }
        });
    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            let SwitchExample = (props) => {
                const {getFieldProps} = props.form;
                return (
                    <div className="amList_cont">
                        <List className="amList">
                            <List.Item
                                extra={<Switch
                                    {...getFieldProps('Switch8', {
                                        initialValue: rowData.state == 0 ? false : true,
                                        valuePropName: 'checked',
                                    })}
                                    platform="ios"
                                    color="#4dd865"
                                    text-align="left"
                                    onClick={(checked) => {
                                        _this.changeStatus(checked, rowData)
                                    }}
                                />}
                            ></List.Item>
                        </List>
                        <Button type="primary" size="small" className="btn_del deleteBtn_common"
                                onClick={this.showAlert.bind(this, rowData)}></Button>
                    </div>
                );
            };
            SwitchExample = createForm()(SwitchExample);

            return (
                <div className="classInfo line_public my_flex">
                    <div className="am-list-content"
                         onClick={this.turnToClassTableDetil.bind(this, rowData)}>{rowData.planName}</div>
                    <div className="switchBtn">
                        <SwitchExample/>
                    </div>
                </div>
            )
        };
        return (
            <div id="ClassTimingList" style={{height: classBinding.state.clientHeight}}>
                <div className='tableDiv' style={{height: classBinding.state.clientHeight}}>
                    <div className='addBunton' onClick={this.creatNewTable}>
                        <img src={require("../img/addBtn.png")}/>
                    </div>
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
                        //onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: classBinding.state.clientHeight,
                        }}
                    />
                </div>
            </div>
        );
    }
}
