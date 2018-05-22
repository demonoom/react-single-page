import React from 'react';
import {List, Icon, Toast, Picker, ListView} from 'antd-mobile';
import '../css/notify.less'

const Item = List.Item;
const Brief = Item.Brief;
var classBinding;

export default class notifyBack extends React.Component {

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
            // data: [],
            Icon: <Icon type='cross-circle-o'/>,
            pickerData: [],  //选择项容器
            asyncValue: [],
            defaultPageNo: 1,
            classId: '',
        };
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split('=')[1];
        this.setState({ident});
    }

    componentDidMount() {
        document.title = "通知列表";
        this.getClazzesByUserId();
    }

    //通过uid获取班级信息
    getClazzesByUserId() {
        var _this = this;
        //获取班级选择项
        var param = {
            "method": 'getClazzesByUserId',
            "userId": _this.state.ident,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = [];
                        result.response.forEach(function (v, i) {
                            arr.push({
                                value: v.id, label: v.name
                            })
                        })
                        _this.setState({pickerData: arr});
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    //通过班级id获取通知列表
    getClassBrandNoticeListByClassId(classId) {
        var _this = this;
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "cid": classId,
            "pageNo": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' || result.success) {
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
                Toast.info('获取列表失败', error);
            }
        });
    }

    //新打开添加课程页
    toAddNotify() {
        var url = WebServiceUtil.mobileServiceURL + "addNotify";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    //新打开通知详情页
    toNotifyDetail(notifyId) {
        var url = WebServiceUtil.mobileServiceURL + "notifyDetail";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url + '?nodeId=' + notifyId;
        });
    }

    //删除通知信息
    deleteNotify(notifyId) {
        var _this = this;
        //获取班级选择项
        var param = {
            "method": 'deleteClassBrandNotice',
            "classBrandNoticeId": notifyId,
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
                        if (notifyId == v.id) {
                            _this.initData.splice(i, 1);
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                }
            },
            onError: function (error) {
                // message.error(error);
                Toast.info('删除失败');
            }
        });
    }


    //选择器改变事件
    onPickerChange = (val) => {
        const d = [...this.state.pickerData];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
        });
    };

    //选择器确定事件
    viewCourseTableItemPage = (val) => {
        console.log(val[0]);
        const d = [...this.state.pickerData];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
            classId: val[0]
        });
        if (val[0]) {
            this.getClassBrandNoticeListByClassId(val[0]);
        }
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
        _this.getClassBrandNoticeListByClassId(_this.state.classId);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };


    render() {
        var _this = this;
        const row = (item, sectionID, rowID) => {
            return (
                <div className="listCont">
                    <Item onClick={this.toNotifyDetail.bind(this, item.id)} extra={item.createTime} align="top"
                          multipleLine>
                        {item.noticeTitle} <Brief>{item.noticeContent}</Brief>
                    </Item>
                    <Icon onClick={this.deleteNotify.bind(this, item.id)} type='cross-circle'
                          className="deleteNoifty"></Icon>
                    <img src={require("../imgs/pic.png")} alt="头像" className="headPic"/>
                </div>
            )
        };
        return (
            <div id="notify" style={{height: document.body.clientHeight}}>
                <List className="my-list">
                    <Picker data={this.state.pickerData}
                            cols={1}
                            className="forss"
                            value={this.state.asyncValue}
                            onPickerChange={this.onPickerChange}
                            onOk={v => this.viewCourseTableItemPage(v)}>
                        <Item arrow="horizontal">选择班级</Item>
                    </Picker>
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
                    />}
                    />

                </List>
                <div className="addBunton" onClick={this.toAddNotify}>
                    <img src={require("../../ringBindInformation/imgs/addBtn.png")}/>
                </div>
            </div>
        );
    }
}
