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
    PullToRefresh,
    Checkbox, Flex
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
            selectData: []
        };
    }
   
    onDataChange = (value) => {
        classBinding.setState({
            gradeNameValue:value
        });
        
    };

    
   

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '绑定教室信息';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("=")[1];
        this.setState({ "uid": uid })
        this.viewClassRoomPage(uid);
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
            classBinding.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }

    /**
     * 查看绑定的设备
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
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }



    /**
     * 开启添加教室管理的界面
     */
    addRing = () => {
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
            "keyWord": $('.gradeName .am-input-control input').val(),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result.response);

                if (result.msg == '调用成功' && result.success == true) {

                    classBinding.setState({
                        searchData: result.response,
                        chooseResultDiv: "block",
                        classId: result.response[0].id
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
            }
        });
    }
    /**
     * 点击提交时，确认绑定教室和班级
     */
    binding = () => {

        var _this = this;
        if (_this.state.gradeNameValue == '' || _this.state.classroomValue == '') {
            Toast.fail('请填写教室名称和班级名称', )
            return
        }
        var param = {
            "method": 'addClassRoom',
            "cr": {
                "creatorId": classBinding.state.uid,
                "name": classBinding.state.classroomValue,
                "classId": classBinding.state.classId
            }

        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    $('.tableDiv').show("fast");
                    _this.state.gradeNameValue = '';
                    _this.state.classroomValue = '';
                    _this.setState({ chooseResultDiv: 'none' });
                    _this.viewClassRoomPage(_this.state.uid);
                    $('.bindGrade span').removeClass("am-checkbox-checked");
                    $('.gradeName').css({
                        display: 'none'
                    })
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
        this.setState({chooseResultDiv: 'none'});
    };

    /**
     * 获取绑定班级的状态，是否显示
     */
    getbindGradeState(e) {
        if (e.target.checked) {
            $('.gradeName').css({
                display: 'block'
            })
        } else {
            $('.gradeName').css({
                display: 'none'
            })
        }
    }
    /**
     * 输入框改变的回调
     */
    inputOnChange(e) {
        this.setState({ classroomValue: e });
    }
    inputChange(e) {
        this.setState({ gradeNameValue: e })
    }
    /**
     * 点击搜索结果的回调
     */
    // searchResultOnChange = (i) => {
    //     this.setState({
    //         gradeNameValue: $(".chooseResult .am-list-line .am-list-content").text()
    //     })
    // };

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

    render() {
       
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            return (<div>
                {
                    <div className="classInfo">
                        <div className="textOver">
                        <span className="classroom">{rowData.name}</span>
                        {
                            rowData.defaultBindedClazz ? <span className="grade">{rowData.defaultBindedClazz.name}</span> : <span className="grade"></span>
                        }
                        </div>
                        <span className='calmCardUnbind'
                        >修改</span>
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
                    <div className='addBunton' onClick={this.addRing}>
                        <img src={require("../imgs/addBtn.png")} />
                    </div>
                </div>
                <div className='addModel' style={{ height: classBinding.state.clientHeight }}>
                    <List>

                        <div className='classroomName'>
                            <InputItem
                                placeholder="请输入教室名称"
                                data-seed="logId"
                                onChange={this.inputOnChange.bind(this)}
                                value={this.state.classroomValue}
                            >教室名称<i className='redStar'>*</i></InputItem>
                        </div>
                        <div className="bindGrade">
                            <AgreeItem data-seed="logId" onChange={e => this.getbindGradeState(e)}>
                                绑定班级
                            </AgreeItem>
                        </div>
                        <div className='gradeName' style={{ display: "none" }}>
                            <InputItem
                                placeholder="请输入班级名称"
                                data-seed="logId"
                                onChange={this.inputChange.bind(this)}
                                value={this.state.gradeNameValue}
                            >班级名称<i className='redStar'>*</i></InputItem>
                            <div id='stIcon' className='stIcon' onClick={this.searchClassroomName}>
                                <img  src={require('../imgs/down.png')}/>
                            </div>


                        </div>
                        <div className='chooseResult'
                            style={{ display: this.state.chooseResultDiv }}>
                            <List>
                                {classBinding.state.searchData.map(i => (
                                    <RadioItem key={i.id} checked={ classBinding.state.gradeNameValue === i.name}  onChange={() => this.onDataChange(i.name)}>
                                        {i.name}
                                    </RadioItem>
                                ))}
                            </List>



                        </div>
                    </List>
                    <div className="bottomBox">
                        <span onClick={this.cancelAddModel} className="close">关闭</span>
                        <span className="bind" onClick={this.binding}>提交</span>
                    </div>

                </div>
            </div>
        );
    }
}
