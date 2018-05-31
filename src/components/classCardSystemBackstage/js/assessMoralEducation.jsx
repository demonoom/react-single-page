import React from 'react';
import {
    Toast,
    InputItem,
    List,
    Radio,
    ListView,
    Modal,
    PullToRefresh,
    Checkbox,
    Flex,
    WhiteSpace,
    WingBlank,
    Button,
} from 'antd-mobile';
import '../css/assessMoralEducation.less'
import { ucs2 } from 'punycode';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var assessME;

export default class assessMoralEducation extends React.Component {

    constructor(props) {
        super(props);
        assessME = this;
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
            calmHeight: document.body.clientHeight - 150
        };
    }



    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '德育教室信息列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var clazzId = locationSearch.split("&")[0].split("=")[1];
        assessME.setState({
            "classId": clazzId
        })
        this.getMoralEducationInfoList(clazzId)
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', assessME.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', assessME.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            moralassessMEEd.setState({
                clientHeight: document.body.clientHeight,
                calmHeight: document.body.clientHeight - 150
            });
        }, 100)
    }

    /**
     * 查看对应教室ID的德育信息
     */
    getMoralEducationInfoList(classId) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getMoralEducationInfoList',
            "clazzId": classId,
            "pageNo": PageNo,
        };
        console.log("param", param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log("assasa",result);
                if (result.msg == '调用成功' && result.success == true) {
                    assessME.state.selectData = result.response
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
                        refreshing: false,
                        "cName":result.response[0].clazz.name
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
        _this.getMoralEducationInfoList(_this.state.classId);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({ defaultPageNo: 1, refreshing: true, isLoadingLeft: true });
        this.getMoralEducationInfoList(this.state.classId);
    }

   
    /**
     * toUpdateMoralEducatio跳转修改页面
     */
    toUpdateMoralEducation(item) {
        var url = WebServiceUtil.mobileServiceURL + "updateMoralEducation?id=" + item.id +"&name="+encodeURI(item.clazz.name);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });

    }
    /**
     * 根据ID删除德育信息
     */
    delMoralEducation(id) {
            var _this = this;
            var param = {
                "method": 'deleteMoralEducation',
                "id": id,
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
                            if (id == v.id) {
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
     * searchClassroomName搜索班级的名称
     */
    toaddMoralEducation() {
        var url = WebServiceUtil.mobileServiceURL + "addMoralEducation?classId="+assessME.state.classId;
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            return (<div>
                 
                {
                    <div className="classInfo">
                        <div className="textOver">
                            <span className="healthScore">{rowData.health}</span>
                            <span className="politenessScore">{rowData.politeness}</span>
                            <span className="createTime">{WebServiceUtil.formatYMD(rowData.createTime)}</span>
                        </div>

                        <span className='calmCardUnbind' onClick={this.toUpdateMoralEducation.bind(this, rowData)}>修改</span>
                        <span className='' onClick={this.delMoralEducation.bind(this, rowData.id)}>删除</span>
                    </div>
                }
            </div>

            )
        };
        return (
            <div id="classroomManage" style={{ height: assessME.state.clientHeight }}>
                <div>{assessME.state.cName}</div>
                <div className='tableDiv' style={{ height: assessME.state.clientHeight }}>
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
                            height: assessME.state.clientHeight,
                        }}
                        pullToRefresh={<PullToRefresh
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80}
                        />}
                    />
                    <div className='addCourseButton'>
                        <WhiteSpace size="lg" />
                        <WingBlank>
                            <Button type="warning" onClick={this.binding}>提交</Button>
                        </WingBlank>
                    </div>
                    {/* <div className='addBunton' onClick={this.toaddMoralEducation}>
                        <img src={require("../imgs/addBtn.png")} />
                    </div> */}
                     <div className='addBunton' onClick={this.toaddMoralEducation}>
                        <img src={require("../imgs/addBtn.png")} />
                    </div>
                </div>

            </div>
        );
    }
}
