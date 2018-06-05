import React from 'react';
import {
    Toast,
    WhiteSpace,
    InputItem,
    List,
    Radio,
    ListView,
    Modal,
    PullToRefresh,
    Checkbox,
    Button,
    Flex,
} from 'antd-mobile';
import '../css/classroomManage.less'
import { ucs2 } from 'punycode';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var classBinding;

export default class classroomManage extends React.Component {

    constructor(props) {
        super(props);
        classBinding = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            chooseResultDiv: 'none',
            searchData: [],
            selectData: [],
            teachBuildData: [
            ]
        };
    }

    onDataChange = (value, id) => {
        classBinding.setState({
            gradeNameValue: value,
            gradeNameChangeValue: value,
            "classId": id
        });
    };
    teachBuildDataChange = (value, id) => {
        classBinding.setState({
            teachBuildValue: value,
            "buildingId": id
        })
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '绑定教室信息';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        var uidKey = {
            "uidKey": uid
        }
        localStorage.setItem("uIdKey", JSON.stringify(uidKey));
        this.viewClassRoomPage(uid);
        this.viewSchoolBuildingPage(uid);
    }


    /**
     * 查看教室信息
     */
    viewClassRoomPage(uid) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'viewClassRoomPage',
            "uid": uid,
            "pn": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    classBinding.state.selectData = result.response
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
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }

    /**
     * 开启添加教室管理的界面
     */
    addClassroomM = () => {
        $('.tableDiv').hide("fast");
    };

    /**
     * searchClassroomName搜索班级的名称
     */
    searchClassroomName() {
        var _this = this;
        var param = {
            "method": 'searchClazz',
            "aid": classBinding.state.uid,
            "keyWord": classBinding.state.gradeNameValue,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    if (result.response.length === 0) {
                        Toast.info('没有查找到该班级');
                    }
                    classBinding.setState({
                        searchData: result.response,
                        chooseResultDiv: "block",
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }
    /**
     * 点击提交时，确认绑定教室和班级
     */
    binding = () => {
        var _this = this;
        if (classBinding.state.gradeNameValue == '' || classBinding.state.classroomValue == '') {
            Toast.fail('请填写教室名称和班级名称', )
            return
        }
        if (classBinding.state.gradeNameChangeValue == undefined) {
            Toast.fail('请选择班级', )
            return
        }
        var param;
        if(classBinding.state.buildingId == undefined){
            param = {
                "method": 'addClassRoom',
                "cr": {
                    "creatorId": classBinding.state.uid,
                    "name": classBinding.state.classroomValue,
                    "classId": classBinding.state.classId,
                }
            };
        }else {
            param = {
                "method": 'addClassRoom',
                "cr": {
                    "creatorId": classBinding.state.uid,
                    "name": classBinding.state.classroomValue,
                    "classId": classBinding.state.classId,
                    "buildingId":classBinding.state.buildingId
                }
            };
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    $('.tableDiv').show("fast");
                    _this.state.gradeNameValue = '';
                    _this.state.classroomValue = '';
                    _this.setState({ chooseResultDiv: 'none' });
                    _this.viewClassRoomPage(_this.state.uid);
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });

    }

    /**
     * 关闭添加的界面
     */
    cancelAddModel = () => {
        $('.tableDiv').show("fast");
        this.state.gradeNameValue = '';
        this.state.classroomValue = '';
        this.setState({ chooseResultDiv: 'none' });
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
        this.setState({ isLoadingLeft: true, defaultPageNo: currentPageNo });
        _this.viewClassRoomPage(_this.state.uid);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({ defaultPageNo: 1, refreshing: true, isLoadingLeft: true });
        this.viewClassRoomPage(this.state.uid);
    }

    /**
     * 根据ID修改教室
     * @param {*} id 
     */
    toUpdatePage(id) {
        var url = WebServiceUtil.mobileServiceURL + "updateClassroom" + "?classId=" + id.id + "&uid="+classBinding.state.uid;
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 根据ID删除教室
     * @param {*} classRoomId 
     */
    delClassroom(classRoomId) {
        var _this = this;
        var param = {
            "method": 'deleteClassRoom',
            "id": classRoomId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('删除成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (classRoomId == v.id) {
                            _this.initData.splice(i, 1);
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.info('删除失败');
            }
        });
    }
    /**
    * 删除弹出框
    */
    showAlert = (sId) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('删除', '您确定要删除吗?', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.delClassroom(sId) },
        ], phone);
    };
    /**
     * 增加教学楼
     */
    toAddTeachBuild = () => {
        classBinding.setState({
            "teachBuildValue": "",
            "buildingId": ""
        })
        var url = WebServiceUtil.mobileServiceURL + "addTeachBuild?uid="+classBinding.state.uid;
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    /**
        * 查看教学楼列表
        */
    viewSchoolBuildingPage = (uid) => {
        var param = {
            "method": 'viewSchoolBuildingPage',
            "uid": uid,
            "pn": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    classBinding.setState({
                        "teachBuildData":result.response,
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            return (<div>
                {
                    <div className="classInfo">
                        <div className="textOver">
                            <span className="classroom">{rowData.name}</span>
                        </div>
                        <div className="">
                            <span>{rowData.building.name}</span>
                        </div>
                        <div className="textOver">
                            {
                                rowData.defaultBindedClazz ? <span className="grade">{rowData.defaultBindedClazz.name}</span> : <span className="grade"></span>
                            }
                        </div>
                        <div className="div_creatTime">
                            <span className="creatTime">
                                {
                                    WebServiceUtil.formatYMD(rowData.createTime)
                                }
                            </span>
                            <Button className="modifyBtn_common" type="primary" size="small" onClick={this.toUpdatePage.bind(this, rowData)}></Button>
                            <Button type="primary" size="small" className="btn_del deleteBtn_common"
                                onClick={this.showAlert.bind(this, rowData.id)}
                            ></Button>
                        </div>
                    </div>
                }
            </div>

            )
        };

        return (
            <div id="classroomManage" style={{ height: classBinding.state.clientHeight }}>
                <div className='tableDiv' style={{ height: classBinding.state.clientHeight }}>
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
                            height: classBinding.state.clientHeight,
                        }}
                        pullToRefresh={<PullToRefresh
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80}
                        />}
                    />
                    <div className='addBunton' onClick={this.addClassroomM}>
                        <img src={require("../imgs/addBtn.png")} />
                    </div>
                </div>
                <div className='addModel' style={{ height: classBinding.state.clientHeight }}>
                    <div className="mainCont">
                        <WhiteSpace size="lg" />
                        <List>
                            <div className='classroomName'>
                                <InputItem
                                    placeholder="请输入教室名称"
                                    data-seed="logId"
                                    onChange={v => {
                                        classBinding.setState({
                                            "classroomValue": v
                                        })
                                    }}
                                    value={this.state.classroomValue}
                                >教室名称<i className='redStar'>*</i></InputItem>
                            </div>
                            <WhiteSpace size="lg" />
                            <div className='gradeName'>
                                <InputItem
                                    placeholder="请输入班级名称"
                                    data-seed="logId"
                                    onChange={v => {
                                        classBinding.setState({
                                            "gradeNameValue": v,
                                            "classId": ""
                                        })
                                    }}
                                    value={this.state.gradeNameValue}
                                >班级名称<i className='redStar'>*</i></InputItem>
                                <div id='stIcon' className='stIcon' onClick={this.searchClassroomName}>
                                    <img src={require('../imgs/icon_search.png')} />
                                </div>
                            </div>
                            <div className='chooseResult'
                                style={{ display: this.state.chooseResultDiv}}>
                                <List>
                                    {classBinding.state.searchData.map(i => (
                                        <RadioItem key={i.id} checked={classBinding.state.gradeNameValue === i.name} onChange={() => this.onDataChange(i.name, i.id)}>
                                            {i.name}
                                        </RadioItem>
                                    ))}
                                </List>
                            </div>
                            <WhiteSpace size="lg" />
                            <div className='teachBuild'>
                                <InputItem
                                    placeholder="请选择对应教学楼"
                                    data-seed="logId"
                                    disabled="false"
                                    onChange={v => {
                                        classBinding.setState({
                                            "teachBuildValue": v
                                        })
                                    }}
                                    value={this.state.teachBuildValue}
                                >教学楼名称<i className='redStar'>*</i></InputItem>
                            </div>
                            <div className='chooseResult'
                                style={{ display: "block", height: 220 }}>
                                <div className="cont">
                                    <span>教学楼名称列表</span>
                                    <button onClick={this.toAddTeachBuild}>新增</button>
                                </div>
                                <List>
                                    {classBinding.state.teachBuildData.map(i => (
                                        <RadioItem key={i.id} checked={classBinding.state.teachBuildValue === i.name} onChange={() => this.teachBuildDataChange(i.name, i.id)}>
                                            {i.name}
                                        </RadioItem>
                                    ))}
                                </List>
                            </div>
                        </List>
                    </div>
                    <div className="bottomBox">
                        <span onClick={this.cancelAddModel} className="close">关 闭</span>
                        <span className="bind" onClick={this.binding}>提 交</span>
                    </div>

                </div>
            </div>
        );
    }
}
