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
        };
    }

    componentDidMount() {
        // this.checkboxState();
        Bridge.setShareAble("false");
        document.title = '绑定教室信息';
        var loginUser = JSON.parse(localStorage.getItem('loginUserRingBind'));
        this.setState({loginUser});
        this.viewWatchPage(loginUser);
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
     * 关闭添加课程信息页面的界面
     */
    cancelAddModel = () => {
        $('.tableDiv').show("fast");
        this.state.macId = '';
        this.state.gradeNameValue = '';
        this.state.classroomValue = '';
        this.setState({chooseResultDiv: 'none'});
    };

  
    /**
     * 绑定
     */
    binding = () => {
        var _this = this;
        if (this.state.searchCheckValue == '' || this.state.classroomValue == '') {
            Toast.fail('未选择班级名称',)
            return
        }
        var param = {
            "method": 'bindWatch',
            "uid": this.state.searchCheckValue,
            "mac": classBinding.state.macId,
            "opId": this.state.loginUser.ident,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('绑定成功', 1);
                    $('.tableDiv').show("fast");
                    _this.state.macId = '';
                    _this.state.gradeNameValue = '';
                    _this.state.classroomValue = '';
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

   getbindGradeState(e){
       if(e.target.checked){
           $('.gradeName').css({
               display:'block'
           })
       }else {
           $('.gradeName').css({
               display:'none'
           })
       }
   }
    /**
     * 输入框改变的回调
     */
    inputOnChange(e) {
        this.setState({classroomValue:e});
    }
    inputChange(e){
        this.setState({gradeNameValue:e})
    }
    /**
     * 点击搜索结果的回调
     */
    searchResultOnChange = (i) => {
        this.setState({
            searchCheckValue: i.value,
            gradeNameValue: i.label,
            classroomValue:i.label
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
                <div className="classInfo">
                    {/* <img onClick={_this.showAlert.bind(this, rowData)} src={require("../imgs/addBtn.png")} /> */}
                    <span className="classroom">3号楼</span>
                    <span className="grade">三年级二班</span>
                    <span className='calmCardUnbind'
                            >修改</span>
                </div>
            )
        };
        return (
            <div id="classroomManage" style={{height: classBinding.state.clientHeight}}>
                <div className='tableDiv' style={{height: classBinding.state.clientHeight}}>
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
                            height: classBinding.state.clientHeight,
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
                <div className='addModel' style={{height: classBinding.state.clientHeight}}>
                    <List>
                        <div className='classroomName'>
                            <InputItem
                                placeholder="请输入教室名称"
                                data-seed="logId"
                                onChange={this.inputOnChange.bind(this)}
                                value={this.state.classroomValue}
                            >教室名称</InputItem>
                        </div>
                        <div className="bindGrade">
                            <AgreeItem data-seed="logId" onChange={e => this.getbindGradeState(e)}>
                                绑定班级
                            </AgreeItem>
                        </div>
                        <div className='gradeName' style={{display:"none"}}>
                            <InputItem
                                placeholder="请输入班级名称"
                                data-seed="logId"
                                onChange={this.inputChange.bind(this)}
                                value={this.state.gradeNameValue}
                            >班级名称</InputItem>
                            <img id='stIcon' className='stIcon' src={require('../imgs/search.png')}
                                 onClick={this.searchClassroomName}/>
                            
                        </div>
                        <div className='chooseResult'
                             style={{display: this.state.chooseResultDiv}}>
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
                        <span className="bind" onClick={this.binding}>提交</span>
                    </div>

                </div>
            </div>
        );
    }
}
