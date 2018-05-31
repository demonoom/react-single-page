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
import '../css/moralEducation.less'
import { ucs2 } from 'punycode';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var moralEd;

export default class moralEducation extends React.Component {

    constructor(props) {
        super(props);
        moralEd = this;
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
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        var uidKey = {
            "uidKey": uid
        }
        localStorage.setItem("uIdKey", JSON.stringify(uidKey));
        // this.viewClassRoomPage(uid);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', moralEd.onWindowResize)
        this.searchClassroomName(uid);
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', moralEd.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            moralEd.setState({
                clientHeight: document.body.clientHeight,
                calmHeight: document.body.clientHeight - 150  });
        }, 100)
    }

    /**
     * 查看教室信息
     */
    // viewClassRoomPage(uid) {
    //     var _this = this;
    //     _this.initData.splice(0);
    //     _this.state.dataSource = [];
    //     _this.state.dataSource = new ListView.DataSource({
    //         rowHasChanged: (row1, row2) => row1 !== row2,
    //     });
    //     const dataBlob = {};
    //     var PageNo = this.state.defaultPageNo;
    //     var param = {
    //         "method": 'viewClassRoomPage',
    //         "uid": uid,
    //         "pn": PageNo,
    //     };
    //     WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
    //         onResponse: function (result) {
    //             console.log(result);
    //             if (result.msg == '调用成功' && result.success == true) {
    //                 moralEd.state.selectData = result.response
    //                 var arr = result.response;
    //                 var pager = result.pager;
    //                 for (let i = 0; i < arr.length; i++) {
    //                     var topic = arr[i];
    //                     dataBlob[`${i}`] = topic;
    //                 }
    //                 var isLoading = false;
    //                 if (arr.length > 0) {
    //                     if (pager.pageCount == 1 && pager.rsCount < 30) {
    //                         isLoading = false;
    //                     } else {
    //                         isLoading = true;
    //                     }
    //                 } else {
    //                     isLoading = false;
    //                 }
    //                 _this.initData = _this.initData.concat(arr);
    //                 _this.setState({
    //                     dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
    //                     isLoadingLeft: isLoading,
    //                     refreshing: false
    //                 })
    //             } else {
    //                 Toast.fail(result.msg, 1);
    //             }
    //         },
    //         onError: function (error) {
    //             Toast.info(error);
    //         }
    //     });
    // }

    /**
     * 开启添加教室管理的界面
     */
    addClassroomM = () => {

    };
    /**
     * searchClassroomName搜索班级的名称
     */
    searchClassroomName(uid) {
        var _this = this;
        var param = {
            "method": 'searchClazz',
            "aid": uid,
            "keyWord": "",
        };
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' && result.success == true) {
                    moralEd.setState({
                        searchData:result.response
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
        if (moralEd.state.gradeNameValue == '' || moralEd.state.classroomValue == '') {
            Toast.fail('请填写教室名称和班级名称', )
            return
        }
        if (moralEd.state.gradeNameChangeValue == undefined) {
            Toast.fail('请选择班级', )
            return
        }
        var param = {
            "method": 'addClassRoom',
            "cr": {
                "creatorId": moralEd.state.uid,
                "name": moralEd.state.classroomValue,
                "classId": moralEd.state.classId
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
     * 输入框改变的回调
     */
    inputOnChange(e) {
        this.setState({ classroomValue: e });
    }
    inputChange(e) {
        this.setState({ gradeNameValue: e })
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
     * 跳转获取ClassId页面
     * @param {*} item
     */

    toAssessMoralE(id){
        var url = WebServiceUtil.mobileServiceURL + "assessMoralEducation?id="+id;
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
        // const row = (rowData, sectionID, rowID) => {
        //     console.log(rowData);
        //     return (<div>
        //         {
        //             <div className="classInfo">
        //                <span>{rowData.name}</span>
        //                 <span className='calmCardUnbind' onClick={this.toAssessMoralE.bind(this, rowData)}
        //                 >详情</span>
        //             </div>
        //         }
        //     </div>

        //     )
        // };
        return (
            <div id="moralEducation" style={{ height: moralEd.state.clientHeight }}>
                <div className='tableDiv' style={{ height: moralEd.state.clientHeight }}>
                    {/*这是列表数据,包括添加按钮*/}
                    {
                        moralEd.state.searchData.map((v,i) => {
                            return  <div className="am-list-item am-list-item-middle" onClick={this.toAssessMoralE.bind(this,v.id)}>
                            <div className="am-list-line">
                                <div className="am-list-content">{v.name}</div>
                            <span className="choiceData am-list-extra" style={{ float: 'right', color: '#888' }}></span><div className="am-list-arrow am-list-arrow-horizontal"></div>
                            </div>
                            </div>
                        })
                    }
                    {/* <ListView
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
                            height: moralEd.state.clientHeight,
                        }}
                        pullToRefresh={<PullToRefresh
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80}
                        />}
                    /> */}

                </div>

            </div>
        );
    }
}