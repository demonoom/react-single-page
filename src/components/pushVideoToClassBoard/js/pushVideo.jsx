import React from 'react';
import {
    ListView,
    Modal,
    Toast,
} from 'antd-mobile';
import { SimpleWebsocketConnection } from '../../../helpers/simple_websocket_connection';
var calm;
window.simpleMS = null;
const prompt = Modal.prompt;
const alert = Modal.alert;


export default class pushVideo extends React.Component {

    constructor(props) {
        super(props);
        calm = this;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoadingLeft: true,
            dataNone: "",
            videoArr: [],

        };
    }

    componentWillMount() {
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var schoolId = locationSearch.split("&")[0].split("=")[1];
        calm.setState({
            schoolId: schoolId
        })
        this.simpleListener();
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', calm.onWindowResize)
        calm.getPushScreenVideoByUserId();
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', calm.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            calm.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }


    /**
     * 消息监听
     */
    simpleListener() {
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: function (info) {
                console.log(info)
            }
        };
    }

    /**
     * 上传视频
     */
    addVideo = () => {
        console.log("dianjile")
        var data = {
            method: 'selectOnlyVideo',
        };
        Bridge.callHandler(data, function (res) {
            console.log(res, "res")
            //拿到视频地址,显示在页面等待上传
            var arr = res.split(',');
            console.log(arr, "pathArr")
            let newArr = [];
            let pathArr = [];
            var videoPath;
            var videoName;
            var videoExtra;
            arr.forEach((v, i) => {
                let item = v.split("?");
                pathArr.push(item[0])
                videoPath = item[0];
                videoName = item[1].split("=")[1];
                videoExtra = (item[1].split("=")[1]).split(".")[1];
                // newArr.push({
                //     videoPath: item[0],
                //     videoName: item[1].split("=")[1],
                //     videoExtra: (item[1].split("=")[1]).split(".")[1],
                //     pushValue: "推送"
                // })
                calm.savePushScreenVideo(videoPath, videoName)
            })
            console.log(newArr, "newArr")
            // calm.setState({
            //     videoArr: newArr
            // })
        }, function (error) {
            console.log(error);
        });
    }
    previewVideo = (src) => {
        //视频预览
        var data = {
            method: 'playVideo',
            url: src
        };
        Bridge.callHandler(data, null, function (error) {

        });
    }
    pushVideoToClassboard = (isPush, index, videoPath, screenVideoId) => {
        if (isPush == 0) {
            calm.updatePushStatus(screenVideoId, 1);
            calm.initData = [];
            calm.setState({
                dataSource: calm.state.dataSource.cloneWithRows(calm.initData),
            })
            calm.getPushScreenVideoByUserId();
            var obj = {
                "command": "playPushVideo",
                "data": {
                    "videoPath": videoPath,
                    "schoolId": calm.state.schoolId
                }
            }
            simpleMS.send(obj)

        }
        if (isPush == 1) {
            calm.updatePushStatus(screenVideoId, 0);
            calm.initData = [];
            calm.setState({
                dataSource: calm.state.dataSource.cloneWithRows(calm.initData),
            })
            calm.getPushScreenVideoByUserId();
            var obj = {
                "command": "stopPushVideo",
                "data": {
                    "videoPath": videoPath,
                    "schoolId": calm.state.schoolId
                }
            }
            simpleMS.send(obj)
        }
    }

    updatePushStatus = (videoScreenId, isPush) => {
        var param = {
            "method": 'updatePushStatus',
            "videoScreenId": videoScreenId,
            "isPush": isPush
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "calmre")
                if (result.success) {

                } else {
                    Toast.info(result.msg, 1)
                }
            },
            onError: function (error) {
            }
        });
    }
    showBtnBox = (index) => {
        if ($('.btnBox').eq(index).css("display") == "none") {
            $(".btnBox").css({
                display: 'none'
            })
            $('.btnBox').eq(index).css({
                display: 'block'
            })

        } else {
            $('.btnBox').eq(index).css({
                display: 'none'
            })
        }
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
        const alertInstance = alert('您确定要删除该视频吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deletePushScreenVideo(data) },
        ], phone);
    };

    /**
     * 删除视频
     */
    deletePushScreenVideo = (data) => {
        if(data.isPush == 1){
            Toast.info("不能删除已推送的视频",1);
            return;
        }
        var param = {
            "method": 'deletePushScreenVideo',
            "screenVideoIds": data.screenVideoId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.info("删除成功",1);
                    calm.initData= [];
                    calm.setState({
                        dataSource: calm.state.dataSource.cloneWithRows(calm.initData),
                    })
                    calm.getPushScreenVideoByUserId();
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 获取推送视频列表
     */
    getPushScreenVideoByUserId() {
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getPushScreenVideoByUserId',
            "userId": 23836,
            "pageNo": PageNo,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log("result111", result)
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0 && result.pager.rsCount === 0) {
                        calm.setState({ dataNone: false })
                    } else {
                        calm.setState({ dataNone: true })
                    }
                    var response = result.response;
                    var pager = result.pager;
                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    if (response.length > 0) {
                        if (pager.pageCount == 1 && pager.rsCount < 30) {
                            isLoading = false;
                        } else {
                            isLoading = true;
                        }
                    } else {
                        isLoading = false;
                    }
                    calm.initData = calm.initData.concat(response);
                    calm.setState({
                        dataSource: calm.state.dataSource.cloneWithRows(calm.initData),
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
     * 保存推送视频
     */
    savePushScreenVideo(path, name) {
        var param = {
            "method": 'savePushScreenVideo',
            "classPushScreenJson": {
                schoolId: 9,
                userId: 23836,
                videoPath: path,
                videoName: name,
                isPush: 0
            }
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.info("保存成功", 1);
                    calm.initData = [];
                    calm.setState({
                        dataSource: calm.state.dataSource.cloneWithRows(calm.initData),
                    })
                    calm.getPushScreenVideoByUserId();
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
        var currentPageNo = calm.state.defaultPageNo;
        if (!calm.state.isLoadingLeft && !calm.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        calm.setState({ isLoadingLeft: true, defaultPageNo: currentPageNo });
        calm.getPushScreenVideoByUserId()
        calm.setState({
            dataSource: calm.state.dataSource.cloneWithRows(calm.initData),
            isLoadingLeft: true,
        });
    };

    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div>
                    <div><span>{rowData.videoName}</span><span>{WebServiceUtil.formatYMD(rowData.createDate)}</span><span onClick={calm.showBtnBox.bind(this, rowID)}>上箭头</span></div>
                    <div className="btnBox" style={{ display: rowData.isPush == 1 ? "block" : "none" }}>
                        <span onClick={calm.previewVideo.bind(this, rowData.videoPath)}>预览</span>
                        <span onClick={calm.pushVideoToClassboard.bind(this, rowData.isPush, rowID, rowData.videoPath, rowData.screenVideoId)}>{rowData.isPush == 0 ? "推送" : "停止"}</span>
                        <span onClick={calm.showAlert.bind(this, rowData)}>删除</span>
                    </div>
                </div>
            )
        }
        return (
            <div id="pushVideo">
                <div className='emptyCont' style={{ display: calm.state.dataNone ? 'none' : '' }}>
                    暂无数据
                </div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{ paddingTop: 5, textAlign: 'center' }}>
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
                        height: this.state.clientHeight - 64 - 46,
                        display: calm.state.dataNone ? "" : "none"
                    }}
                />
                <button onClick={this.addVideo}>添加</button>
            </div>
        );
    }
}
