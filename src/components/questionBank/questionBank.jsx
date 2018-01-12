import React from 'react';
import {
    Tabs,
    ListView,
    Checkbox,
    ActionSheet,
    WingBlank,
    Button,
    Drawer,
    List,
    Toast,
    PullToRefresh,
} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import fetch from 'dva/fetch'
import './questionBank.css'

/*请求地址*/
const mobileUrl = 'http://www.maaee.com/Excoord_For_Education/webservice';

const CheckboxItem = Checkbox.CheckboxItem;

/*tab表头*/
const tabs = [
    {title: '我上传的'},
    {title: '其他老师上传的'}
];

/*假数据*/
// const data = [
//     {
//         img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
//         title: 'Meet hotel',
//         des: '不是所有的兼职汪都需要风吹日晒',
//     },
//     {
//         img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
//         title: 'McDonald\'s invites you',
//         des: '不是所有的兼职汪都需要风吹日晒',
//     },
//     {
//         img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
//         title: 'Eat the week',
//         des: '不是所有的兼职汪都需要风吹日晒',
//     },
// ];
// const NUM_ROWS = 20;
// let pageIndex = 0;
//
// //遍历数据
// function genData(pIndex = 0) {
//     const dataBlob = {};
//     for (let i = 0; i < NUM_ROWS; i++) {
//         const ii = (pIndex * NUM_ROWS) + i;
//         dataBlob[`${ii}`] = `row - ${ii}`;
//     }
//     return dataBlob;
// }
var knowledge;

export default class questionBank extends React.Component {

    constructor(props) {
        super(props);
        knowledge = this;
        /*我上传的数据*/
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        /*其他老师上传的数据*/
        const dataSourceOther = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];
        this.initDataOther = [];

        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            dataSourceOther: dataSourceOther.cloneWithRows(this.initDataOther),
            isLoading: true,   //为true显示'加载'  false显示'没有跟多课程'
            defaultPageNo: 1,
            defaultPageNoOther: 1,
            clicked: 'none',
            checkBoxCheckedArr: [],    //勾选中的题目id
            delCheckBoxCheckedArr: [],    //需要删除的勾选中的题目id
            open: false,
            tabOnClick: 0,
            refreshing: false,   //下拉刷新状态
        };
    }

    componentWillMount() {
        //地址:    http://localhost:8091/#/questionBank?ident=54208&pointId=4339&title=nihao
        //   http://jiaoxue.maaee.com:8091

        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var pointId = searchArray[1].split('=')[1];
        var title = searchArray[2].split('=')[1];
        document.title = title;   //设置title
        var loginUser = {
            "ident": ident,
            "pointId": pointId,
            "title": title,
        };

        // var loginUser = {
        //     "ident": 54208,
        //     "pointId": 4339,
        //     "tittle":'你好'
        // };
        localStorage.setItem("loginUser", JSON.stringify(loginUser));
    }

    componentDidMount() {
        this.getSubjectDataByKnowledge(false);
        this.getSubjectDataByKnowledgeOther(false);
        this.getTeachScheduleByIdent();

        // setTimeout(() => {
        //     this.rData = genData();
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //         isLoading: false,
        //     });
        // }, 600);
    }

    parseJSON(response) {
        return response.json();
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    /**
     * 根据资源库的知识点id获取知识点下的题目
     */
    getSubjectDataByKnowledge(pullFalg) {
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getUserSubjectsByKnowledgePoint',
            "ident": loginUser.ident,
            "pointId": loginUser.pointId,
            "pageNo": PageNo,
            "isOwmer": "Y"
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var response = result.data.response;
                for (let i = 0; i < response.length; i++) {
                    var topic = response[i];
                    topic.checkBoxChecked = false;
                    dataBlob[`${i}`] = topic;
                }
                if (pullFalg) {    //拉动刷新  获取数据之后再清除原有数据
                    _this.initData.splice(0);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                }
                _this.initData = _this.initData.concat(response);
                _this.setState({
                    dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                    isLoading: false,
                    refreshing: false
                })
            });
    }

    /**
     * 根据资源库的知识点id获取知识点下的题目(其他老师上传的)
     */
    getSubjectDataByKnowledgeOther(pullFalg) {
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNoOther;
        var param = {
            "method": 'getUserSubjectsByKnowledgePoint',
            "ident": loginUser.ident,
            "pointId": loginUser.pointId,
            "pageNo": PageNo,
            "isOwmer": "N"
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var response = result.data.response;
                for (let i = 0; i < response.length; i++) {
                    var topic = response[i];
                    topic.checkBoxChecked = false;
                    dataBlob[`${i}`] = topic;
                }
                if (pullFalg) {    //拉动刷新  获取数据之后再清除原有数据
                    _this.initDataOther.splice(0);
                    _this.state.dataSourceOther = [];
                    _this.state.dataSourceOther = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                }
                _this.initDataOther = _this.initDataOther.concat(response);
                _this.setState({
                    dataSourceOther: _this.state.dataSourceOther.cloneWithRows(_this.initDataOther),
                    isLoading: false,
                    refreshing: false
                })
            });
    }

    /**
     * 获取备课计划
     */
    getTeachScheduleByIdent() {
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        var arr = [];
        var param = {
            "method": 'getTeachScheduleByIdent',
            "ident": loginUser.ident,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var response = result.data.response;
                if (typeof (response) != 'undefined' && response.length != 0) {
                    response.forEach(function (v) {
                        arr.push(v);
                    });
                    _this.setState({scheduleNameArr: arr});
                }
            });
    }

    /**
     * 做固定tab的
     * @param props
     * @returns {XML}
     */
    renderTabBar(props) {
        return (<Sticky>
            {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoading: true, defaultPageNo: currentPageNo});
        // setTimeout(() => {
        //     this.rData = { ...this.rData, ...genData(++pageIndex) };
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //         isLoading: false,
        //     });
        // }, 1000);
        // _this.initData = _this.initData.concat();
        _this.getSubjectDataByKnowledge(false);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoading: false,
        });
    };

    /**
     *  ListView数据全部渲染完毕的回调  (右侧)
     */
    otherOnEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNoOther;
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        //这个if没有成立过
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoading: true, defaultPageNoOther: currentPageNo});
        _this.getSubjectDataByKnowledgeOther(false);
        this.setState({
            dataSourceOther: this.state.dataSourceOther.cloneWithRows(this.initDataOther),
            isLoading: false,
        });
    };

    /**
     *  点击查看详情页
     */
    rowOnClick(res) {
        var subjectId = res.id;
        var subjectType = res.subjectType;
        // window.open("/#/questionDetil?courseId=" + subjectId + "&subjectType=" + subjectType);
        var url = "http://jiaoxue.maaee.com:8091/#/questionDetil?courseId=" + subjectId + "&subjectType=" + subjectType;
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    //动作面板被点击
    showActionSheet = () => {
        var _this = this;
        if (this.state.tabOnClick == 0) {
            var BUTTONS = ['全选', '取消全选', '使用', '删除', '添加题目'];
        } else {
            var BUTTONS = ['全选', '取消全选', '使用'];
        }
        // const BUTTONS = ['全选', '取消全选', '使用'];
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                maskClosable: true,
            },
            (buttonIndex) => {
                this.setState({clicked: BUTTONS[buttonIndex]});
                //0>>全选  1>>取消  2>>使用  3>>删除
                if (buttonIndex == 0) {
                    var ids = [];
                    if (this.state.tabOnClick == 0) {
                        var arr = document.getElementsByClassName('noomCkeckBox');
                        if (typeof (_this.initData) != 'undefined' && _this.initData.length != 0) {
                            _this.initData.forEach(function (v, i) {
                                ids.push(v.id);
                            });
                            this.setState({checkBoxCheckedArr: ids, delCheckBoxCheckedArr: ids});
                        }
                    } else {
                        var arr = document.getElementsByClassName('noomCkeckBoxOther');
                        if (typeof (_this.initDataOther) != 'undefined' && _this.initDataOther.length != 0) {
                            _this.initDataOther.forEach(function (v, i) {
                                ids.push(v.id);
                            });
                            this.setState({checkBoxCheckedArr: ids});
                        }
                    }
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].children[0].children[0].children[0].classList.add("am-checkbox-checked");
                    }
                } else if (buttonIndex == 1) {
                    //1.将所有勾选状态去掉  2.滞空checkBoxCheckedArr
                    var arr = document.getElementsByClassName('am-checkbox');
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].classList.remove("am-checkbox-checked");
                    }
                    this.state.checkBoxCheckedArr.splice(0);
                    this.state.delCheckBoxCheckedArr.splice(0);
                } else if (buttonIndex == 2) {
                    if (this.state.checkBoxCheckedArr.length == 0) {
                        Toast.fail('还未选择课程', 1);
                        return
                    }
                    this.onOpenChange()
                } else if (buttonIndex == 3) {
                    if (this.state.delCheckBoxCheckedArr.length == 0) {
                        Toast.fail('还未选择课程', 1);
                        return
                    }
                    this.delClass()
                } else if (buttonIndex == 4) {
                    this.addQuestion()
                }
            });
    };

    /**
     * 增加新题
     */
    addQuestion = () => {
        const BUTTONS = ['单选题', '简答题', '判断题', '多选题'];
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                maskClosable: true,
            },
            (buttonIndex) => {
                this.setState({clicked: BUTTONS[buttonIndex]});
                //0>>单选题  1>>简答题  2>>判断题  3>>多选题
                this.postMesToMob(buttonIndex);
            });
    };

    /**
     * 发送消息给客户端
     * @param buttonIndex
     */
    postMesToMob(buttonIndex) {
        if (buttonIndex == -1) {
            //遮罩层被点击,不执行通信
            return
        }
        var _this = this;
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        //0>>单选题  1>>简答题  2>>判断题  3>>多选题
        var data = {
            pointId: loginUser.pointId,
            title: loginUser.title,
        };
        if (buttonIndex == 0) {
            data.method = 'singleChoice';
        } else if (buttonIndex == 1) {
            data.method = 'shortAnswer';
        } else if (buttonIndex == 2) {
            data.method = 'trueOrFalse';
        } else if (buttonIndex == 3) {
            data.method = 'multipleChoice';
        }
        Bridge.callHandler(data, function (mes) {
            if (mes == 'refresh') {
                //刷新页面
                Toast.success('题目添加成功', 1);
                _this.initData.splice(0);
                _this.state.dataSource = [];
                _this.state.dataSource = new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2,
                });
                _this.setState({defaultPageNo: 1});
                _this.getSubjectDataByKnowledge(false);
            }
        }, function (error) {
            Toast.fail(error, 1);
        });
    };

    /**
     * 删除课程
     */
    delClass() {
        var _this = this;
        var arr = this.state.delCheckBoxCheckedArr;
        var subjectsIds = arr.join(',');
        var param = {
            "method": 'delMySubjects',
            "subjects": subjectsIds,
            "userId": '54208',
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var ret = result.data;
                if (ret.msg == '调用成功' && ret.success == true) {
                    Toast.success('题目删除成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    arr.forEach(function (item) {
                        _this.initData.forEach(function (v, i) {
                            if (item == v.id) {
                                _this.initData.splice(i, 1);
                            }
                        });
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                    _this.state.delCheckBoxCheckedArr.splice(0);
                } else {
                    Toast.fail('题目删除失败', 1);
                }

            });
    }

    /**
     *  复选框被点击
     */
    checkBoxOnChange(e, id, rowID) {
        if (this.state.tabOnClick == 0) {
            //为删除准备的数组
            var array = this.state.delCheckBoxCheckedArr;
            if (e.target.checked) {
                //勾中
                array.push(id);
            } else {
                //取消勾选
                array.forEach(function (v, i) {
                    if (v == id) {
                        array.splice(i, 1)
                    }
                })
            }
            this.setState({delCheckBoxCheckedArr: array});
        }
        var arr = this.state.checkBoxCheckedArr;
        if (e.target.checked) {
            //勾中
            arr.push(id);
        } else {
            //取消勾选
            arr.forEach(function (v, i) {
                if (v == id) {
                    arr.splice(i, 1)
                }
            })
        }
        this.setState({checkBoxCheckedArr: arr});
    };

    // 抽屉开/关
    onOpenChange = (...args) => {
        this.setState({open: !this.state.open});
        if (args[1]) {
            //抽屉关闭   1.页面的选中状态取消   2.滞空checkBoxCheckedArr
            var arr = document.getElementsByClassName('am-checkbox');
            for (var i = 0; i < arr.length; i++) {
                arr[i].classList.remove("am-checkbox-checked");
            }
            this.state.checkBoxCheckedArr.splice(0);
            this.state.delCheckBoxCheckedArr.splice(0);
        }
    };

    //抽屉被点击(保存到备课计划)
    scheduleOnClick(data) {
        this.copySubjects(data);
    }

    //使用题目到备课计划
    copySubjects(data) {
        var arr = this.state.checkBoxCheckedArr;
        var subjectsIds = arr.join(',');
        var _this = this;
        var param = {
            "method": 'copySubjects',
            "subjectsIds": subjectsIds,
            "teachScheduleId": data,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var ret = result.data;
                if (ret.msg == '调用成功' && ret.success == true) {
                    Toast.success('题目使用成功', 1);
                } else {
                    Toast.fail('题目使用失败', 1);
                }

            });
    }

    //tab切换
    tabOnChange(TabData, index) {
        knowledge.setState({tabOnClick: index});
    }

    //左侧下拉刷新
    onRefresh = () => {
        this.setState({defaultPageNo: 1, refreshing: true});
        this.getSubjectDataByKnowledge(true);
    };

    //右侧下拉刷新
    onRefreshOther = () => {
        this.setState({defaultPageNoOther: 1, refreshing: true});
        this.getSubjectDataByKnowledgeOther(true);
    };

    render() {
        var scheduleNameArr = [];
        if (typeof(this.state.scheduleNameArr) != 'undefined') {
            scheduleNameArr = this.state.scheduleNameArr;
        }

        //抽屉内容
        const sidebar = (<List>
            {scheduleNameArr.map((i) => {
                return (<List.Item key={i.split('#')[0]}
                                   thumb={require('./icon_check_homework.png')}
                                   onClick={() => this.scheduleOnClick(i.split('#')[0])}
                                   className="icon_homework_check"
                >{i.split('#')[1]}</List.Item>);
            })}
        </List>);

        //上下行间距
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 1,
                    borderTop: '1px solid #ECECED',
                }}
            />
        );
        //左边每一道题的div
        const row = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID} className="exercises_line">
                    <CheckboxItem
                        key={rowData.id}
                        onChange={() => this.checkBoxOnChange(event, rowData.id, rowID)}
                        className="noomCkeckBox"
                    >
                        <div style={{display: '-webkit-box', display: 'flex'}}
                             onClick={this.rowOnClick.bind(this, rowData)}>
                            <div style={{lineHeight: 1}} className="flex_1 my_flex">
                                <div dangerouslySetInnerHTML={{__html: rowData.content}}
                                     className="flex_1 exercises_cont"></div>
                                <div className="flex_70"><span className={rowData.subjectType}>{rowData.typeName}</span>
                                </div>
                            </div>
                        </div>
                    </CheckboxItem>
                </div>
            );
        };

        //右边每一道题的div(暂时废弃)
        const rowRight = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID} className="exercises_line">
                    <CheckboxItem
                        key={rowData.id}
                        onChange={() => this.checkBoxOnChange(event, rowData.id, rowID)}
                        className="noomCkeckBoxOther"
                    >
                        <div style={{display: '-webkit-box', display: 'flex'}}
                             onClick={this.rowOnClick.bind(this, rowData)}>
                            <div style={{lineHeight: 1}} className="flex_1 my_flex">
                                <div dangerouslySetInnerHTML={{__html: rowData.content}}
                                     className="flex_1 exercises_cont"></div>
                                <div className="flex_70"><span className={rowData.subjectType}>{rowData.typeName}</span>
                                </div>
                            </div>
                        </div>
                    </CheckboxItem>
                </div>
            );
        };

        return (
            <div>
                <Drawer
                    className="my-drawer my_drawer"
                    style={{minHeight: document.documentElement.clientHeight}}
                    enableDragHandle
                    sidebar={sidebar}
                    open={this.state.open}
                    onOpenChange={this.onOpenChange}
                    position="right"
                >
                    <StickyContainer>
                        <Tabs tabs={tabs}
                              renderTabBar={this.renderTabBar}   //替换TabBar
                              initialPage={0}    //初始化Tab, index or key
                              swipeable={false}   //是否可以滑动内容切换
                              animated={false}     //是否开启切换动画
                              useOnPan={false}    //使用跟手滚动   禁用跟手滚动 但是开启动画与滑动切换 达到与原生的体验
                              onChange={this.tabOnChange}
                        >
                            {/*<PullToRefresh*/}
                            {/*ref={el => this.ptr = el}*/}
                            {/*style={{*/}
                            {/*height: document.documentElement.clientHeight,*/}
                            {/*overflow: 'auto',*/}
                            {/*}}*/}
                            {/*distanceToRefresh={80}*/}
                            {/*direction={'down'}*/}
                            {/*refreshing={this.state.refreshing}*/}
                            {/*onRefresh={() => {*/}
                            {/*this.setState({refreshing: true});*/}
                            {/*this.onRefresh();*/}
                            {/*}}*/}
                            {/*>*/}
                            {/*我上传的 ListView*/}
                            <ListView
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                                renderFooter={() => (<div style={{padding: 10, textAlign: 'center'}}>
                                    {this.state.isLoading ? '正在加载' : '没有更多课了'}
                                </div>)}
                                renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                                renderSeparator={separator}   //可以不设置的属性  行间距
                                className="am-list"
                                pageSize={5}    //每次事件循环（每帧）渲染的行数
                                //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                                onScroll={() => {
                                    console.log('scroll');
                                }}   //在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用scrollEventThrottle属性来控制。
                                scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                                onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                                onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                                initialListSize={10}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                                scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                                style={{
                                    height: document.body.clientHeight,
                                }}
                                pullToRefresh={<PullToRefresh
                                    onRefresh={this.onRefresh}
                                    distanceToRefresh={80}
                                />}
                            />
                            {/*</PullToRefresh>*/}

                            {/*其他老师上传的 ListView*/}
                            {/*<PullToRefresh*/}
                            {/*ref={el => this.ptr = el}*/}
                            {/*style={{*/}
                            {/*height: document.documentElement.clientHeight,*/}
                            {/*overflow: 'auto',*/}
                            {/*}}*/}
                            {/*distanceToRefresh={80}*/}
                            {/*direction={'down'}*/}
                            {/*refreshing={this.state.refreshing}*/}
                            {/*onRefresh={() => {*/}
                            {/*this.setState({refreshing: true});*/}
                            {/*this.onRefreshOther();*/}
                            {/*}}*/}
                            {/*>*/}
                            <ListView
                                dataSource={this.state.dataSourceOther}    //数据类型是 ListViewDataSource
                                renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                                    {this.state.isLoading ? '正在加载' : '没有更多课了'}
                                </div>)}
                                renderRow={rowRight}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                                renderSeparator={separator}   //可以不设置的属性  行间距
                                className="am-list"
                                pageSize={5}    //每次事件循环（每帧）渲染的行数
                                onScroll={() => {
                                    console.log('scroll');
                                }}   //在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用scrollEventThrottle属性来控制。
                                scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                                onEndReached={this.otherOnEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                                onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                                initialListSize={10}
                                scrollEventThrottle={20}
                                style={{
                                    height: document.body.clientHeight,
                                }}
                                pullToRefresh={<PullToRefresh
                                    onRefresh={this.onRefreshOther}
                                    distanceToRefresh={80}
                                />}
                            />
                            {/*</PullToRefresh>*/}

                        </Tabs>
                    </StickyContainer>
                    {/*悬浮按钮*/}
                    <WingBlank className="btn_homework_cont"
                               style={{
                                   width: 40,
                                   position: 'fixed',
                                   bottom: 20,
                                   right: 5,

                               }}
                    >
                        <Button onClick={this.showActionSheet} className="btn_homework btn_no_b">
                            <img src={require('./homework_icon.png')}/>
                        </Button>
                    </WingBlank>
                </Drawer>
            </div>
        );
    }
}
