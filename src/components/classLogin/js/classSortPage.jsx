import React from "react";
import {
    Tabs, Modal, WhiteSpace, ListView, Toast, TabBar,
    Icon
} from 'antd-mobile';
import "../css/classSortPage.less"
import '../../../helpers/webServiceUtil'

const prompt = Modal.prompt;
const alert = Modal.alert;
var tLibrary;
export default class classSortPage extends React.Component {
    constructor(props) {
        super(props);
        tLibrary = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clicked: 'none',
            clientHeight: document.body.clientHeight,
            isLoadingLeft: true,
            parentId: -1,
            progressState: 'none',
            dataNone: "",
            fileName: '',
            selectedTab: 'blueTab',
            courseData: [],
            reviewData: [],
            users: {},
            currentUnion: true,
            review: true,
            fileList: true
        };
    }
    componentDidMount() {
        Bridge.setShareAble("false");
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var fileId = searchArray[1].split('=')[1];
        var fileName = searchArray[2].split('=')[1];
        var phoneType = searchArray[3].split('=')[1];
        var version = searchArray[4].split('=')[1];
        this.setState({ phoneType });     //phoneType = 0 安卓,  phoneType = -1 ios,
        document.title = fileName;   //设置title
        this.setState({ parentCloudFileId: fileId, ident, version });

        var loginUser = {
            "ident": ident,
        };
        localStorage.setItem("loginUserTLibrary", JSON.stringify(loginUser));

        this.getUserById(ident)

        //正在直播的课程
        this.getCurrentUnionClassList(ident);
        this.viewCourseReviewPage(ident)
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', tLibrary.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', tLibrary.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            tLibrary.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }

    /**
     * 文件夹内部请求接口
     * @param fileId
     * @param clearFlag
     */
    getUserById(ident) {
        var _this = this;
        var param = {
            "method": 'getUserById',
            "ident": ident,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({
                        users: result.response
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 文件夹内部请求接口
     * @param fileId
     * @param clearFlag
     */
    listCloudSubject(fileId, clearFlag, fileName) {
        this.setState({ parentCloudFileId: fileId, fileName });
        var loginUser = JSON.parse(localStorage.getItem('loginUserTLibrary'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'listFiles',
            "operateUserId": loginUser.ident,
            "cloudFileId": fileId,
            "queryConditionJson": "",
            "pageNo": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0) {
                        _this.setState({ dataNone: false })
                    } else {
                        _this.setState({ dataNone: true })
                    }
                    if (result.response[0]) {
                        _this.setState({
                            parentId: result.response[0].parent.parentId,
                            parentName: result.response[0].parent.name
                        })
                    }
                    if (!fileName) {
                        _this.setState({ fileName: result.response[0].parent.name })
                    } else {
                        _this.setState({ fileName })
                    }
                    var response = result.response;
                    var pager = result.pager;
                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    if (clearFlag) {    //拉动刷新  获取数据之后再清除原有数据
                        _this.initData.splice(0);
                        _this.state.dataSource = [];
                        _this.state.dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });
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

                    _this.initData = _this.initData.concat(response);
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
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoadingLeft && !_this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        _this.setState({ isLoadingLeft: true, defaultPageNo: currentPageNo });

        if (_this.state.parentCloudFileId == -1) {
            _this.getUserRootCloudSubjects()
        } else {
            _this.listCloudSubject(_this.state.parentCloudFileId, false)
        }

        _this.setState({
            dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
            isLoadingLeft: true,
        });
    };



    /**
     * 删除弹出框
     */
    showAlert = (data) => {
        if (tLibrary.state.phoneType == '-1') {
            var phone = 'ios'
        } else {
            var phone = 'android'
        }
        if (data.fileType == '1') {
            //文件夹
            var str = '您确定要删除该文件夹吗?';
        } else {
            var str = '您确定要删除该题目吗?';
        }
        var _this = this;
        const alertInstance = alert(str, '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.removeFile(data) },
        ], phone);
    };

    /**
     * 创建文件夹
     */
    creatFile(value) {
        if (value.length == 0) {
            Toast.fail('文件夹名称不能为空', 3);
            return
        }
        var _this = this;
        this.state.defaultPageNo = 1;
        //新建文件夹,刷新页面
        var param = {
            "method": 'mkdir',
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
            "parentCloudFileId": this.state.parentCloudFileId,
            "name": value
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    // 刷新
                    if (_this.state.parentCloudFileId == -1) {
                        _this.getUserRootCloudSubjects(true)
                    } else {
                        _this.listCloudSubject(_this.state.parentCloudFileId, true)
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 上传文件  ---客户端
     */
    upLoadQue = () => {
        var data = {
            method: 'upLoadFile'
        }
        Bridge.callHandler(data, (res) => {
            var arr = res.split("},")
            arr.forEach((v, i) => {
                if (i == arr.length - 1) {
                    var item = JSON.parse(v);
                    var obj = {
                        name: item.filename,
                        size: parseInt(item.size)
                    }
                    this.createCloudFile(item.path, obj);
                } else {
                    var item = v + "}";
                    item = JSON.parse(item)
                    obj = {
                        name: item.filename,
                        size: parseInt(item.size)
                    }
                    this.createCloudFile(item.path, obj)
                }
            })
        })
    };

    /**
     * 向指定文件夹上传文件
     */
    createCloudFile = (fileUrl, fileObj) => {
        var _this = this;
        this.state.defaultPageNo = 1;
        var param = {
            "method": 'createCloudFile',
            "operateUserId": this.state.ident,
            "parentCloudFileId": this.state.parentCloudFileId,
            "name": fileObj.name,
            "path": fileUrl,
            "length": fileObj.size
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    // 刷新
                    if (_this.state.parentCloudFileId == -1) {
                        _this.getUserRootCloudSubjects(true)
                    } else {
                        _this.listCloudSubject(_this.state.parentCloudFileId, true)
                    }
                    Toast.success('上传成功', 2)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 删除文件,文件夹
     */
    removeFile(obj) {
        var _this = this;
        var param = {
            "method": 'deleteCloudFiles',
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
            "cloudFileIds": obj.id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    //刷新页面,弹出
                    Toast.success('删除成功', 1);
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
                    Toast.fail('删除失败', 2);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 新建文件夹
     * phoneType = 0 安卓,  phoneType = -1 ios,
     */
    creatNewFile() {
        if (tLibrary.state.phoneType == '-1') {
            var phone = 'ios'
        } else {
            var phone = 'android'
        }
        prompt('请输入文件夹名称', '', [
            { text: '取消' },
            { text: '确定', onPress: value => tLibrary.creatFile(value) },
        ], 'default', '新建文件夹', [], phone)
        if (tLibrary.state.phoneType == '-1') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    /**
     * 文件夹重命名
     * phoneType = 0 安卓,  phoneType = -1 ios,
     * @param rowData
     */
    reNameAntFile(rowData) {
        if (tLibrary.state.phoneType == '-1') {
            var phone = 'ios'
        } else {
            var phone = 'android'
        }
        prompt('请输入您修改的名称', '', [
            { text: '取消' },
            { text: '确定', onPress: value => tLibrary.renameFile(value, rowData) },
        ], 'default', '', [], phone)
        if (tLibrary.state.phoneType == '-1') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    /**
     * 文件夹重命名
     */
    renameFile(str, data) {
        if (str.length == 0) {
            Toast.fail('文件夹名称不能为空', 3);
            return
        }
        var _this = this;
        var param = {
            "method": 'renameCloudFile',
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
            "cloudFileId": data.id,
            "name": str
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    // 刷新
                    Toast.success('重命名成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (data.id == v.id) {
                            v.name = str;
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                    //解决安卓键盘改变窗口高度问题,所以延迟100
                    // setTimeout(function () {
                    //     _this.setState({
                    //         dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    //     });
                    // }, 100);
                } else {
                    Toast.fail('重命名失败', 2);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    /**
     * 正在直播的课程
     */
    getCurrentUnionClassList = (ident) => {
        var param = { "method": "getCurrentUnionClassList", "userId": ident }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length == 0) {
                        this.setState({
                            currentUnion: false
                        })
                    }
                    this.setState({
                        courseData: result.response
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    //点击加入课堂
    joinClass = (v, pwd) => {
        // userId,userName,vid,
        var url = WebServiceUtil.mobileServiceURL + 'joinClass?ident=' + this.state.ident + "&userName=" + this.state.users.userName + "&vid=" + v + "&pwd=" + pwd;
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    //点击继续上课
    continueClass = (v, pwd) => {
        /**
         * 直接跳客户端
         */
        console.log("客户端")
        // var url = WebServiceUtil.mobileServiceURL + 'joinClass?ident=' + this.state.ident + "&userName=" + this.state.users.userName + "&vid=" + v+"&pwd="+pwd;
        // var data = {
        //     method: 'openNewPage',
        //     url: url,
        // };
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
    }

    /**
     * 获取回顾列表
     */
    toReview = (v) => {
        var url = "https://jiaoxue.maaee.com:9093/#/cloundSchoolDetail?vId=" + v.courseId + "&userId=" + this.state.ident + "&type=3&name=" + v.name + "&judgeFlag=''"
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 获取课堂回顾列表
     */
    viewCourseReviewPage = (ident) => {
        var param = {
            "method": "viewCourseReviewPage",
            "adminId": ident,
            "cType": 3,
            "begin": "2000-01-01",
            "end": "2050-01-01",
            "tId": -1,
            "pageNo": 1
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length == 0) {
                        this.setState({
                            review: false
                        })
                    }
                    this.setState({
                        reviewData: result.response
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 查看更多回顾
     */
    seeMoreReview = () => {
        var url = WebServiceUtil.mobileServiceURL + 'moreReview?ident=' + this.state.ident
        var data = {
            method: 'openNewPage',
            url: url,
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 点击课件
     */
    clickClassFile = () => {
        this.setState({
            selectedTab: 'greenTab',
        });
        this.getUserRootCloudSubjects()
    }

    /**
     * 获取课件列表
     */
    getUserRootCloudSubjects(clearFlag) {
        this.setState({ parentCloudFileId: -1 });
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getUserRootCloudFiles',
            "userId": this.state.ident,
            "pageNo": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0 && result.pager.rsCount === 0) {
                        _this.setState({ fileList: false })
                    } else {
                        _this.setState({ fileList: true })
                    }
                    var response = result.response;
                    var pager = result.pager;
                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    if (clearFlag) {    //拉动刷新  获取数据之后再清除原有数据
                        _this.initData.splice(0);
                        _this.state.dataSource = [];
                        _this.state.dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });
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
                    _this.initData = _this.initData.concat(response);
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
     * 文件夹被点击
     */
    fileClicked(obj, event) {
        if (obj.fileType === 0) {
            var data = {
                method: 'watchFiles',
                data: obj.path
            }
            Bridge.callHandler(data, null, function (error) {
            });
        } else {
            var url = WebServiceUtil.mobileServiceURL + 'fileDetail?parentId=' + obj.id + '&parentName=' + obj.name + "&ident=" + this.state.ident;
            var data = {
                method: 'openNewPage',
                url: url,
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        }
    };


    /**
     * 退出登录
     */
    toExit = () => {
        var url = WebServiceUtil.mobileServiceURL + 'classLogin';
        window.location.href = url;
    }


    clearCache = () => {
        var data = {
            method: 'clearCache',
        };
        Bridge.callHandler(data, null, function (error) {
        });
    }
    render() {
        var _this = this;
        var parentId = this.state.parentId
        const row = (rowData, sectionID, rowID) => {
            var headDiv;
            var headDivItem;
            var time = WebServiceUtil.formatYMD(rowData.createTime) + ' ' + WebServiceUtil.formatHM(rowData.createTime);
            var id = rowData.id;
            if (rowData.fileType == 0) {
                var fileType = rowData.suffix;
                var fileTypeLog;
                switch (fileType) {
                    case "png":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_png.png')} alt="" />;
                        break;
                    case "jpg":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_jpg.png')} alt="" />;
                        break;
                    case "mp3":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_mp3.png')} alt="" />;
                        break;
                    case "mp4":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_mp4.png')} alt="" />;
                        break;
                    case "apk":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_apk.png')} alt="" />;
                        break;
                    case "pdf":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_pdf.png')} alt="" />;
                        break;
                    case "ppt":
                    case "pptx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_ppt.png')} alt="" />;
                        break;
                    case "doc":
                    case "docx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_doc.png')} alt="" />;
                        break;
                    case "xls":
                    case "xlsx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_xls.png')} alt="" />;
                        break;
                    case "wps":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_wps.png')} alt="" />;
                        break;
                    default:
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_else.png')} alt="" />;
                        break;
                }
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li onClick={this.reNameAntFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_edit01.png')} alt="" />
                    </li>
                    <li onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delete01.png')} alt="" />
                    </li>

                </ul>;
                //文件
                headDiv = <div className="am-accordion-item my_flex flex_align_center">
                    <div className="noomWidth my_flex"
                        onClick={_this.fileClicked.bind(this, rowData)}>
                        {fileTypeLog}
                        <div>
                            <div className="ant_list_title">{rowData.name}</div>
                            <span className="ant_list_time">
                                <span>{time}</span>
                            </span>
                        </div>
                    </div>
                    <div className='option'>{headDivItem}</div>
                </div>

            } else {
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li onClick={this.reNameAntFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_edit01.png')} alt="" />
                    </li>
                    <li onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delete01.png')} alt="" />
                    </li>
                </ul>;
                //文件夹
                headDiv = <div className="am-accordion-item my_flex flex_align_center">
                    <div className="my_flex noomWidth"
                        onClick={_this.fileClicked.bind(this, rowData)}>
                        <img className="filePic" src={require('../imgs/file.png')} alt="" />
                        <div>
                            <div className="ant_list_title">{rowData.name}</div>
                            <span className="ant_list_time">
                                <span>{time}</span>
                            </span>
                        </div>
                    </div>
                    <div className='option'> {headDivItem}</div>
                </div>;
            }
            return (
                <div className="noom-accordion line_public my_flex flex_align_center">
                    {headDiv}
                </div>
            )
        };
        return (
            <div  id="classSortPage">
                <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#3672ED"
                        barTintColor="white"
                        tabBarPosition="bottom"
                        hidden={this.state.hidden}
                        prerenderingSiblingsNumber={0}
                    >
                        <TabBar.Item
                            title="课程"
                            key="Life"
                            icon={<div style={{
                                width: '20px',
                                height: '20px',
                                background: 'url(http://60.205.111.227/upload2/common/img/Live-icon_class.png) center center /  20px 18px no-repeat'
                            }}
                            />
                            }
                            selectedIcon={<div style={{
                                width: '20px',
                                height: '20px',
                                background: 'url(http://60.205.111.227/upload2/common/img/Live-icon_classActive.png) center center /  20px 18px no-repeat'
                            }}
                            />
                            }
                            className={this.state.selectedTab === 'blueTab' ? 'blueTab' : ''}
                            selected={this.state.selectedTab === 'blueTab'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'blueTab',
                                });
                            }}
                            data-seed="logId"
                        >
                            {
                                !this.state.review && !this.state.currentUnion ?
                                    <div>空页面</div>
                                    :
                                    <div className='classList'>
                                        <div>
                                            <h5 style={{ display: this.state.currentUnion ? "block" : "none" }}>正在直播</h5>
                                            <div className='liveClass'>
                                                {
                                                    this.state.courseData.map((v, i) => {
                                                        if (v.openTeacher.colUid == this.state.ident) {
                                                            return (
                                                                <div className='item'>
                                                                    <div className='courseName text_hidden'>{v.title}</div>
                                                                    <div className='classBtn' onClick={this.continueClass.bind(this, v.vid, v.password)}>继续上课</div>
                                                                    <div className='time'>开课时间：{WebServiceUtil.formatAllTime(v.startTime)}</div>
                                                                    <div className="leftCont my_flex">
                                                                        <div>
                                                                            <img src={v.openTeacher.avatar} alt="" />
                                                                            <div className='teacherName text_hidden'>
                                                                                {v.openTeacher.userName}
                                                                            </div>
                                                                        </div>
                                                                        {v.unionTeachers.map((v, i) => {
                                                                            return (
                                                                                <div>
                                                                                    <img src={v.avatar} alt="" />
                                                                                    <div className='teacherName text_hidden'>
                                                                                        {v.userName}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )
                                                        } else {
                                                            return (
                                                                <div className='item'>
                                                                    <div className='courseName text_hidden'>{v.title}</div>
                                                                    <div className='classBtn' onClick={this.joinClass.bind(this, v.vid, v.password)}>加入课堂</div>
                                                                    <div className='time'>开课时间：{WebServiceUtil.formatAllTime(v.startTime)}</div>
                                                                    <div className='leftCont my_flex'>
                                                                        <div>
                                                                            <img src={v.openTeacher.avatar} alt="" />
                                                                            <div className='teacherName text_hidden'>
                                                                                {v.openTeacher.userName}
                                                                            </div>
                                                                        </div>
                                                                        {v.unionTeachers.map((v, i) => {
                                                                            return (
                                                                                <div>
                                                                                    <img src={v.avatar} alt="" />
                                                                                    <div className='teacherName text_hidden'>
                                                                                        {v.userName}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>

                                                                </div>
                                                            )
                                                        }

                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <h5 style={{ display: this.state.review ? "block" : "none" }}>历史回顾  <span className='more' onClick={this.seeMoreReview}>更多 ></span></h5>
                                            <div>
                                                {
                                                    this.state.reviewData.map((v, i) => {
                                                        if (i >= 6) {
                                                            return
                                                        } else {
                                                            return (
                                                                <div className='item'>
                                                                    <div className='courseName text_hidden'>
                                                                        {
                                                                            v.name
                                                                        }
                                                                    </div>
                                                                    <div className='classBtn' onClick={this.toReview.bind(this, v)}>查看回顾</div>
                                                                    <div className='time'>开课时间：
                                                                {
                                                                            v.openTime
                                                                        }
                                                                    </div>
                                                                    <div className='leftCont my_flex'>
                                                                        <div>
                                                                            <img src={v.teacher.avatar} alt="" />
                                                                            <div className='teacherName text_hidden'>
                                                                                {
                                                                                    v.teacher.userName
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }

                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                            }
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'url(http://60.205.111.227/upload2/common/img/Live-icon_file.png) center center /  20px 19px no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'url(http://60.205.111.227/upload2/common/img/Live-icon_fileActive.png) center center /  20px 19px no-repeat'
                                }}
                                />
                            }
                            title="课件"
                            key="Friend"
                            selected={this.state.selectedTab === 'greenTab'}
                            onPress={this.clickClassFile}
                        >
                            <div id="classSortPage" className={this.state.phoneType == '0' ? 'Android_wrap' : ''}
                                style={{ height: this.state.clientHeight - 50 }}>
                                <div className="ant_title line_public">
                                    <div className='btns'>
                                        <span className="ant_btn_list add_file" onClick={this.creatNewFile}>新建文件夹</span>
                                        <input style={{ display: 'none' }} type="file" id="upload" multiple="multiple" />
                                        <span className="ant_btn_list upload_file" onClick={this.upLoadQue}>上传文件</span>
                                    </div>
                                </div>
                                {
                                    !this.state.fileList ?
                                        <div>
                                            空页面</div>
                                        : <ListView
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
                                                height: this.state.clientHeight - 107,
                                            }}
                                        />
                                }

                            </div>

                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(http://60.205.111.227/upload2/common/img/Live-icon_person.png) center center /  20px 20px no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'url(http://60.205.111.227/upload2/common/img/Live-icon_personActive.png) center center /  20px 20px no-repeat'
                                }}
                                />
                            }
                            title="我的"
                            key="my"
                            selected={this.state.selectedTab === 'yellowTab'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'yellowTab',
                                });
                            }}
                        >
                            <div>
                                <div className="personal-center">
                                    <div className="user-photo">
                                        <img src={this.state.users.avatar} alt="" />
                                    </div>
                                    <div className="user-name">{this.state.users.userName}</div>
                                </div>
                                <div className="personal-cont">
                                    <div className="personal-item line_public" onClick={this.clearCache}>清除缓存</div>
                                    <div className="personal-item">
                                        <span>版本号</span>
                                        <span className="light-gray">{this.state.version}</span>
                                    </div>
                                    <div className="log-out" onClick={this.toExit}>退出登录</div>
                                </div>
                            </div>
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>
        )
    }
}