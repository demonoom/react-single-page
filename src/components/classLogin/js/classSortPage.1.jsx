import React from "react";
import { Tabs,Modal, WhiteSpace,ListView,Toast,
    Icon } from 'antd-mobile';
import "../css/classSortPage.less"
import '../../../helpers/webServiceUtil'
const tabs = [
    { title: '课堂' },
    { title: '课件' },
];


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
            fileName: ''
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
        this.setState({phoneType});     //phoneType = 0 安卓,  phoneType = -1 ios,
        document.title = fileName;   //设置title
        this.setState({parentCloudFileId: fileId});
        var loginUser = {
            "ident": ident,
        };
        localStorage.setItem("loginUserTLibrary", JSON.stringify(loginUser));
        this.getUserById(ident);
        this.getUserRootCloudSubjects()
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
            tLibrary.setState({clientHeight: document.body.clientHeight});
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
        this.setState({parentCloudFileId: fileId, fileName});
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
                        _this.setState({dataNone: false})
                    } else {
                        _this.setState({dataNone: true})
                    }
                    if (result.response[0]) {
                        _this.setState({
                            parentId: result.response[0].parent.parentId,
                            parentName: result.response[0].parent.name
                        })
                    }
                    if (!fileName) {
                        _this.setState({fileName: result.response[0].parent.name})
                    } else {
                        _this.setState({fileName})
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
     * 点"我的题目"时调用的接口
     */
    getUserRootCloudSubjects(clearFlag) {
        this.setState({parentCloudFileId: -1});
        var loginUser = JSON.parse(localStorage.getItem('loginUserTLibrary'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;

        var param = {
            "method": 'getUserRootCloudFiles',
            "userId": loginUser.ident,
            "pageNo": PageNo,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0 && result.pager.rsCount === 0) {
                        _this.setState({dataNone: false})
                    } else {
                        _this.setState({dataNone: true})
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
        _this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});

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
     * 文件夹被点击
     */
    fileClicked(obj, event) {
        var _this = this
        event.stopPropagation();
        if (obj.fileType === 0) {
            var data = {
                method: 'watchFiles',
                data: obj
            }
            window.parent.postMessage(data, '*');
        } else {
            _this.setState({defaultPageNo: 1}, () => {
                this.setState({parentId: obj.parentId}, () => {
                    _this.listCloudSubject(obj.id, true, obj.name)
                })
            })
        }
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
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.removeFile(data)},
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
    };

    /**
     * 向指定文件夹上传文件
     */
    createCloudFile = (fileUrl, fileObj) => {
        var _this = this;
        this.state.defaultPageNo = 1;

        var param = {
            "method": 'createCloudFile',
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
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
            {text: '取消'},
            {text: '确定', onPress: value => tLibrary.creatFile(value)},
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
            {text: '取消'},
            {text: '确定', onPress: value => tLibrary.renameFile(value, rowData)},
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
     * 返回
     */
    returnParentAtMoveModal = () => {
        if (this.state.parentId === -1) {
            return
        } else if (this.state.parentId === 0) {
            this.getUserRootCloudSubjects(true)
            this.setState({parentId: -1})
        } else {
            this.listCloudSubject(this.state.parentId, true, false)
        }
    }

    closeIframe = () => {
        $(".iframeDiv").hide();
        $(".mask").hide()
        document.getElementsByClassName("calm")[0].innerHTML = "";
        document.getElementsByClassName("iframeTitle")[0].innerHTML = "";
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
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_png.png')} alt=""/>;
                        break;
                    case "jpg":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_jpg.png')} alt=""/>;
                        break;
                    case "mp3":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_mp3.png')} alt=""/>;
                        break;
                    case "mp4":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_mp4.png')} alt=""/>;
                        break;
                    case "apk":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_apk.png')} alt=""/>;
                        break;
                    case "pdf":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_pdf.png')} alt=""/>;
                        break;
                    case "ppt":
                    case "pptx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_ppt.png')} alt=""/>;
                        break;
                    case "doc":
                    case "docx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_doc.png')} alt=""/>;
                        break;
                    case "xls":
                    case "xlsx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_xls.png')} alt=""/>;
                        break;
                    case "wps":
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_wps.png')} alt=""/>;
                        break;
                    default:
                        fileTypeLog = <img className="filePic" src={require('../imgs/icon_else.png')} alt=""/>;
                        break;
                }
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.reNameAntFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_edit01.png')} alt=""/>
                    </li>
                    <li className="flex_1" onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delete01.png')} alt=""/>
                    </li>

                </ul>;
                //文件
                headDiv = <div className="am-accordion-item my_flex flex_align_center">
                    <div className="noomWidth my_flex flex_align_center"
                         onClick={_this.fileClicked.bind(this, rowData)}>
                        <span className="ant_list_title">{fileTypeLog}{rowData.name}</span>
                        <span className="ant_list_time">
                            <span>{time}</span>
                        </span>
                    </div>
                    <div className='option'>{headDivItem}</div>
                </div>

            } else {
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.reNameAntFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_edit01.png')} alt=""/>
                    </li>
                    <li className="flex_1" onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delete01.png')} alt=""/>
                    </li>
                </ul>;
                //文件夹
                headDiv = <div className="am-accordion-item my_flex flex_align_center">
                    <div className="my_flex flex_align_center noomWidth"
                         onClick={_this.fileClicked.bind(this, rowData)}>
                        <span className="ant_list_title"><img className="filePic" src={require('../imgs/file.png')}
                                                              alt=""/>{rowData.name}</span>
                        <span className="ant_list_time">
                            <span>{time}</span>
                        </span>
                    </div>
                    <div className='option'> {headDivItem}</div>
                </div>;
            }
            return (
                <div className="noom-accordion my_flex flex_align_center">
                    {headDiv}
                </div>
            )
        };
        return (
            <div>
                <div>
                    <WhiteSpace />
                    <Tabs tabs={tabs} initialPage={1} animated={false} useOnPan={false}>
                        <div style={{ height: '100%', backgroundColor: '#fff' }}>
                            <div>
                                <div>正在直播</div>
                            </div>
                            <div>
                                <div>课堂回顾</div>
                            </div>
                        </div>
                        <div style={{ height: '100%', backgroundColor: '#fff' }}>
                            <div id="classSortPage" className={this.state.phoneType == '0' ? 'Android_wrap' : ''}
                                style={{ height: this.state.clientHeight }}>
                                <div className="ant_title">
                                    {/* <span style={{ display: parentId == -1 ? '' : 'none' }} className="ant_btn_list icon_back"
                                    >我的课件</span> */}
                                    <span style={{ display: parentId == -1 ? 'none' : '' }} className="ant_btn_list icon_back icon_arrow"
                                        onClick={this.returnParentAtMoveModal}><Icon type='left' /></span>
                                    <span style={{ display: parentId == -1 ? 'none' : '' }} className="ant_btn_list icon_back ant_text"
                                    >{this.state.fileName}</span>
                                    <div className='btns'>
                                        <span className="ant_btn_list add_file" onClick={this.creatNewFile}>新建文件夹</span>
                                        <input style={{ display: 'none' }} type="file" id="upload" multiple="multiple" />
                                        <span className="ant_btn_list upload_file" onClick={this.upLoadQue}>上传文件</span>
                                    </div>
                                </div>
                                <div className='progress' style={{ display: this.state.progressState }}>
                                    <img src={require('../imgs/icon_loading.gif')} /><br />
                                    正在上传 <span>{this.state.uploadPercent}%</span>
                                </div>
                                <div className='emptyCont' style={{ display: _this.state.dataNone ? 'none' : '' }}>
                                    <img src={require('../imgs/icon_empty.png')} alt="" /><br />
                                    暂无数据
                                </div>
                                <div className='tableTitle my_flex'>
                                    <div className='noomWidth'>
                                        <span>名称</span>
                                        <span>创建时间</span>
                                    </div>
                                    <span className='option'>操作</span>
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
                                        display: _this.state.dataNone ? "" : "none"
                                    }}
                                />
                                <div className="mask"></div>
                                <div className="iframeDiv" style={{ display: "none" }}>
                                    <span id="closeIframe" className="closeIframe" onClick={this.closeIframe}>关闭</span>
                                    <div className="text_hidden">
                                        <h3 className="iframeTitle"></h3>
                                    </div>

                                    <div className="iframeBox calm"></div>
                                </div>
                            </div>
                        </div>

                    </Tabs>
                    <WhiteSpace />
                </div>

            </div>
        )
    }
}