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
    Flex
} from 'antd-mobile';
import '../css/classDutyList.less'
import {ucs2} from 'punycode';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var clazzDutyListBinding;

export default class clazzDutyList extends React.Component {

    constructor(props) {
        super(props);
        clazzDutyListBinding = this;
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

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班级值日表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({"uid": uid});
        var uidKey = {
            "uidKey": uid
        }
        localStorage.setItem("uIdKey", JSON.stringify(uidKey));
        var weekOfTody = new Date().getDay();
        weekOfTody = (weekOfTody == 0 ? 7 : weekOfTody);
        this.getClassBrandStudentDutyList(uid, '', weekOfTody, this.state.defaultPageNo);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', clazzDutyListBinding.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', clazzDutyListBinding.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            clazzDutyListBinding.setState({clientHeight: document.body.clientHeight});
        }, 100)
    }

    /**
     * 查看所有班级的值日信息
     */
    getClassBrandStudentDutyList(userId, clazzId, week, pageNo) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getClassBrandStudentDutyList',
            "userId": userId,
            "clazzId": clazzId,
            "week": week,
            "pageNo": pageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    clazzDutyListBinding.state.selectData = result.response
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
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
        var weekOfTody = new Date().getDay();
        weekOfTody = (weekOfTody == 0 ? 7 : weekOfTody);
        this.getClassBrandStudentDutyList(this.state.uid, '', weekOfTody, currentPageNo);
        // _this.getClassBrandStudentDutyList(_this.state.uid);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({defaultPageNo: 1, refreshing: true, isLoadingLeft: true});
        // this.getClassBrandStudentDutyList(this.state.uid);
        var weekOfTody = new Date().getDay();
        weekOfTody = (weekOfTody == 0 ? 7 : weekOfTody);
        this.getClassBrandStudentDutyList(this.state.uid, '', weekOfTody, this.state.defaultPageNo);
    }

    /**
     * 跳转到班级值日详情页
     */
    turnToClazzDetail(clazzObj) {
        var clazzId = clazzObj.id;
        var clazzName = "";
        if (WebServiceUtil.isEmpty(clazzObj.grade) === false) {
            clazzName += clazzObj.grade.name;
        }
        clazzName += clazzObj.name;
        var studentDutyListUrl = encodeURI(WebServiceUtil.mobileServiceURL + "studentDutyList?clazzId=" + clazzId + "&clazzName=" + clazzName + "&access_user=" + this.state.uid);
        var data = {
            method: 'openNewPage',
            url: studentDutyListUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = studentDutyListUrl;
        });
    }

    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            var users = rowData.users;
            var clazzDutyUserList = [];
            if (WebServiceUtil.isEmpty(users) == false) {
                users.forEach(function (user) {
                    var userName = user.userName;
                    var userTag = <span className="text_hidden">{userName}</span>;
                    clazzDutyUserList.push(userTag);
                });
            }
            return (<div>
                {
                    <div className="classInfo">
                        <div className="am-list-item am-list-item-middle" onClick={_this.turnToClazzDetail.bind(_this,rowData.clazz)}>
                            <div className="am-list-line">
                                <div className="am-list-content">{(rowData.clazz.grade==undefined?'':rowData.clazz.grade.name)+""+rowData.clazz.name}</div>
                                <span className="choiceData am-list-extra" style={{ float: 'right', color: '#888' }}>查看所有</span><div className="am-list-arrow am-list-arrow-horizontal"></div>
                            </div>
                        </div>
                        <div className="today_duty">今日值日</div>
                        <div className="today_dutylist">{clazzDutyUserList.length==0?<div className="no_data">暂无今日值日表</div>:clazzDutyUserList}</div>
                    </div>
                }
            </div>

            )
        };
        return (
            <div id="classDutyList" style={{height: clazzDutyListBinding.state.clientHeight}}>
                <div className='tableDiv' style={{height: clazzDutyListBinding.state.clientHeight}}>
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
                            height: clazzDutyListBinding.state.clientHeight,
                        }}
                        /*pullToRefresh={<PullToRefresh
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80}
                        />}*/
                    />
                </div>
            </div>
        );
    }
}
