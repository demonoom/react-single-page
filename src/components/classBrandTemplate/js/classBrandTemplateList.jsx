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
import '../css/classBrandTemplateList.less';


var AttenT;
const prompt = Modal.prompt;
const alert = Modal.alert;

export default class classBrandTemplateList extends React.Component {

    constructor(props) {
        super(props);
        AttenT = this;
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
        document.title = '皮肤列表管理';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        this.getBraceletBoxSkinList();
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', AttenT.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', AttenT.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            AttenT.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }

    /**
     * 查看班牌的皮肤列表
     */
    getBraceletBoxSkinList() {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var param = {
            "method": 'getBraceletBoxSkinList',
            "pageNo": -1,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "new")
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
     * 去添加页面
     **/
    turnAddClassBrandTemplate(rowData) {
        var url = WebServiceUtil.mobileServiceURL + "addClassBrandTemplate?uid=" + AttenT.state.uid;
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 跳转编辑页面
     * @param name
     */
    updateAttendanceTime(data, event) {

        var url = WebServiceUtil.mobileServiceURL + "updateClassBrandTemplate?uid=" + AttenT.state.uid + "&id=" + data.id;
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });


    }

    /**
     *　删除一个班牌皮肤
     * @param id   班牌皮肤ID
     * @throws Exception
     */
    deleteBraceletBoxSkin(data) {
        var _this = this;
        var param = {
            "method": 'deleteBraceletBoxSkin',
            "id": data.id,
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
                        if (data.id == v.id) {
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
        const alertInstance = alert('您确定要删除该皮肤吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => AttenT.deleteBraceletBoxSkin(data) },
        ], phone);
    };


    /**
     * 改变启用停用状态
     */
    updateBraceletBoxSkinStatus(checked, rowData) {
        var _this = this;
        var param = {
            "method": 'updateBraceletBoxSkinStatus',
            "id": rowData.id,
        };
        var status,
            str;
        if (checked) {
            param.status = 2
            status = 2
            str = '启用成功'
        } else {
            param.status = 1
            status = 1
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
                        if (rowData.id == v.id) {
                            v.valid = status;
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
                        if (rowData.id == v.id) {
                            v.status = 3;
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

        const row = (rowData, sectionID, rowID) => {
            let SwitchExample = (props) => {
                const { getFieldProps } = props.form;
                return (
                    <div className="amList_cont" >
                        <List className="amList">
                            <List.Item
                                extra={<Switch
                                    {...getFieldProps('Switch8', {
                                        initialValue: rowData.valid == 1 ? false : true,
                                        valuePropName: 'checked',
                                    })}
                                    platform="ios"
                                    color="#4dd865"
                                    text-align="left"
                                    onClick={(checked) => {
                                        AttenT.updateBraceletBoxSkinStatus(checked, rowData)
                                    }}
                                />}
                            ><span className="open_text">默认皮肤：</span></List.Item>
                        </List>
                        <Button className="modifyBtn_common" type="primary" size="small" onClick={this.updateAttendanceTime.bind(this, rowData)}></Button>
                        <Button type="primary" size="small" className="btn_del deleteBtn_common" onClick={this.showAlert.bind(this, rowData)}></Button>
                    </div>
                );
            };
            SwitchExample = createForm()(SwitchExample);

            return (
                <div className="classInfo line_public">
                    <div className="cont my_flex">

                        <div className="titleText">
                            <div className="title textOver">
                                皮肤名称：{rowData.skinName}
                            </div>
                            <div className="title textOver">
                                皮肤类名：{rowData.skinAttr}
                            </div>
                        </div>
                        <img src={rowData.image} />
                    </div>
                    <SwitchExample />
                </div>
            )
        };
        return (
            <div id="classBrandTemplateList" style={{ height: AttenT.state.clientHeight }}>
                <div className='tableDiv' style={{ height: AttenT.state.clientHeight }}>
                    <div className='addBunton' onClick={this.turnAddClassBrandTemplate}>
                        <img src={require("../imgs/addBtn.png")} />
                    </div>
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
                        //onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: AttenT.state.clientHeight,
                        }}
                    />
                </div>
            </div>
        );
    }
}
