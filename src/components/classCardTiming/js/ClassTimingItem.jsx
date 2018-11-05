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


import '../css/ClassTimingItem.less'

var classBinding;
const prompt = Modal.prompt;
const alert = Modal.alert;

export default class ClassTimingItem extends React.Component {

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
        this.setState({"uid": uid});
        this.viewCourseTablePage(uid);
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
     * 查看教室的所有课表
     */
    viewCourseTablePage(uid) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var param = {
            "method": 'viewCourseTablePage',
            "rid": uid,
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
        var currentAttendanceListUrl = encodeURI(WebServiceUtil.mobileServiceURL + "newCurriculumSchedule?clazzroomId=" + this.state.uid + "&classTableId=" + rowData.id + "&classTableName=" + rowData.name);

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
     *　更新教室某个课表状态
     * @param ctId   课表id
     * @param condition 课表状态 0 = 删除, 1 =　启用, 3 = 停用
     * @throws Exception
     */
    delTable(data) {
        var _this = this;
        var param = {
            "method": 'changeCourseTableStatus',
            "condition": 0,
            "ctId": data.id,
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
        var _this = this;
        const alertInstance = alert('您确定要删除该任务吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delTable(data)},
        ], phone);
    };

    /**
     * 创建新课表
     **/
    creatNewT(value) {
        var _this = this;
        var param = {
            "method": 'addCourseTable',
            "courseTable": {
                "name": value,
                "roomId": this.state.uid,
                "creatorId": 23836
            },
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('新建成功', 1)
                    _this.viewCourseTablePage(_this.state.uid)
                } else {
                    Toast.fail(result.msg, 2)
                }
            },
            onError: function (error) {
                Toast.warn('保存失败');
            }
        });
    }

    changeStatus(checked, rowData) {
        var _this = this;
        var param = {
            "method": 'changeCourseTableStatus',
            "ctId": rowData.id,
        };
        var status,
            str;
        if (checked) {
            param.condition = 1
            status = 1
            str = '启用成功'
        } else {
            param.condition = 3
            status = 3
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
                            v.status = status;
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
        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            return (
                <div className="classInfo line_public">
                    <div onClick={this.turnToClassTableDetil.bind(this, rowData)}
                         className="am-list-content">周一 周二 周三
                    </div>
                    <div onClick={this.turnToClassTableDetil.bind(this, rowData)}
                         className="am-list-content">开启时间9:30 关闭时间18:40</div>
                    <Button type="primary" size="small" className="btn_del deleteBtn_common"
                            onClick={this.showAlert.bind(this, rowData)}></Button>
                </div>
            )
        };
        return (
            <div id="ClassTimingItem" style={{height: classBinding.state.clientHeight}}>
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
