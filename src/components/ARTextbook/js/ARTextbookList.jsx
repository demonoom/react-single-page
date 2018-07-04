import React from 'react';
import {
    ListView,
    Modal,
    Toast,
    Switch,
    List,
    Button
} from 'antd-mobile';
import { createForm } from 'rc-form';


// import '../../css/newCurriculumSche/getClassTableList.less'

var classBinding;
const prompt = Modal.prompt;
const alert = Modal.alert;

export default class ARTextbookList extends React.Component {

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
            defaultPageNo: 1
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = 'AR教材列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        console.log(uid);
        this.viewARBookPage(uid,true);
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
     *获取AR教材列表
     */
    viewARBookPage = (uid,flag) => {
        var _this = this;
        if (flag) {
            _this.initData.splice(0);
            _this.state.dataSource = [];
            _this.state.dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            });
        }
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'viewARBookPage',
            "adminId": uid,
            "pn": -1
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result,"result");
                if (result.msg == '调用成功' || result.success == true) {
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
        _this.viewARBookPage(_this.state.uid, false);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({ defaultPageNo: 1, refreshing: true, isLoadingLeft: true });
        this.viewARBookPage(this.state.uid, true);
    }

   

    /**
     * 跳转新增页面
     */
    toAddARTextbook() {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "addARTextbook?uid=" + classBinding.state.uid);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 跳转修改页面
     * toUpdateARTextbook
     */
    toUpdateARTextbook(data) {
        if(data.status == 1){
            Toast.info("已发布，不能修改");
            return;
        }
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "UpdateARTextbook?bId=" + data.id+"&uid="+classBinding.state.uid);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    /** 
     *　删除AR教材
     * @param bId   AR教材id
     * @param condition 课表状态 0 = 删除, -1 =　未发布, 1 = 已发布
     * @throws Exception
     */
    changeARBookStatus(data) {
       
        var _this = this;
        var param = {
            "method": 'changeARBookStatus',
            "condition": 0,
            "bId": data.id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result,"delete")
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
        if(data.status == 1){
            Toast.info("已发布，不能删除");
            return;
        }
        event.stopPropagation();
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定要删除该教材吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.changeARBookStatus(data) },
        ], phone);
    };


    /**
     * 点击发布
     */
    publish(data){
        console.log(data,"publishData");
        var _this = this;
        var param = {
            "method": 'changeARBookStatus',
            "condition":1,
            "bId": data.id,
        };
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result)
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success("发布成功", 1)
                    Toast.success('修改成功')
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (data.id == v.id) {
                            v.status = 1;
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                } else {
                    Toast.fail(result.msg, 3)
                }
            },
            onError: function (error) {
                Toast.info('修改失败');
            }
        });
    }

    /**
     * 发布弹出框
     */
    showPublishAlert = (data, event) => {
        console.log(data,"calmmmm")
        if(data.status == 1){
            Toast.info("已发布");
            return;
        }
        event.stopPropagation();
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('发布后将不能修改和删除，确定发布？', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.publish(data) },
        ], phone);
    };

   

    render() {
        console.log("执行render")
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData,"rowData")
            let SwitchExample = (props) => {
                const { getFieldProps } = props.form;
                return (
                    <div className="amList_cont">
                        <Button className="modifyBtn_common" type="primary" size="small" onClick={this.toUpdateARTextbook.bind(this, rowData)}></Button>
                        <Button type="primary" size="small" className="btn_del deleteBtn_common" onClick={this.showAlert.bind(this, rowData)}></Button>
                        <Button size="small" onClick={_this.showPublishAlert.bind(this, rowData)}>{rowData.status == -1 ? "未发布":"已发布"}</Button>
                    </div>
                );
            };
            SwitchExample = createForm()(SwitchExample);
            
            return (
                <div className="classInfo line_public">
                    <div>
                        <div className="am-list-item am-list-item-middle">
                            <div className="am-list-line">
                                <div className="am-list-content">{rowData.name}</div>
                                <div className="am-list-arrow am-list-arrow-horizontal"></div>
                            </div>
                        </div>
                        <div className="tableListDate textOver">
                            <span className="classroom"><span className="classroom_span">创建时间：</span>{WebServiceUtil.formatYMD(rowData.createTime)}</span>
                        </div>
                    </div>
                    <SwitchExample />
                </div>
            )
        };
        return (
            <div id="getClassTableList" style={{ height: classBinding.state.clientHeight }}>
                <div className='tableDiv' style={{ height: classBinding.state.clientHeight }}>
                    <div className='addBunton' onClick={this.toAddARTextbook}>
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
                        onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
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
