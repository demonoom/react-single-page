import React from 'react';
import {
    ListView,
    Accordion,
    Modal,
    Toast,
    Icon
} from 'antd-mobile';
import '../css/antPlate.less'

const prompt = Modal.prompt;

const alert = Modal.alert;

var tLibrary;

export default class antPlate extends React.Component {

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
    listCloudSubject(fileId, clearFlag) {
        this.setState({parentCloudFileId: fileId});
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
                    if (result.response[0]) {
                        _this.setState({parentId: result.response[0].parent.parentId})
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
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});

        if (_this.state.parentCloudFileId == -1) {
            _this.getUserRootCloudSubjects()
        } else {
            _this.listCloudSubject(_this.state.parentCloudFileId, false)
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
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
            var type = obj.suffix

            if (type == 'mp4') {
                var url = 'http://www.maaee.com/Excoord_PhoneService/cloudFile/cloudFileShow/' + obj.uuid + '/' + obj.id;
                window.open(url)
            } else {
                var url = "http://www.maaee.com/Excoord_PhoneService/cloudFile/cloudFileShow/" + obj.id + "/" + obj.createUid;
                window.open(url)
            }

        } else {
            _this.setState({defaultPageNo: 1}, () => {
                this.setState({parentId: obj.parentId}, () => {
                    _this.listCloudSubject(obj.id, true)
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
        const alertInstance = alert('删除', str, [
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
     * 上传
     */
    upLoadQue = () => {
        var _this = this;

        $("#upload").click();
        //取消加绑定change事件解决change事件无法控制
        $("#upload").off("change");
        var fileArr;
        $("#upload").change(function () {
            fileArr = this.files
            var formData = new FormData();
            for (var i = 0; i < this.files.length; i++) {
                formData.append("file" + 0, this.files[i]);
                formData.append("name" + 0, this.files[i].name);
            }

            $.ajax({
                type: "POST",
                url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                enctype: 'multipart/form-data',
                data: formData,
                // 告诉jQuery不要去处理发送的数据
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                xhr: function () {        //这是关键  获取原生的xhr对象  做以前做的所有事情
                    var xhr = jQuery.ajaxSettings.xhr();
                    xhr.upload.onload = function () {
                        cloudTable.setState({progressState: 'none'});
                    }
                    xhr.upload.onprogress = function (ev) {
                        if (ev.lengthComputable) {
                            var percent = 100 * ev.loaded / ev.total;
                            cloudTable.setState({uploadPercent: Math.round(percent), progressState: 'block'});
                        }
                    }
                    return xhr;
                },
                success: function (responseStr) {
                    var arr = responseStr.split(',');
                    arr.forEach(function (v, i) {
                        _this.createCloudFile(v, fileArr[i]);
                    });
                },
                error: function (responseStr) {

                }
            });

            return

            if (this.files[0]) {
                var formData = new FormData();
                formData.append("file" + 0, this.files[0]);
                formData.append("name" + 0, this.files[0].name);
                $.ajax({
                    type: "POST",
                    url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                    enctype: 'multipart/form-data',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    xhr: function () {        //这是关键  获取原生的xhr对象  做以前做的所有事情
                        var xhr = jQuery.ajaxSettings.xhr();
                        xhr.upload.onload = function () {
                            // console.log('上传完成隐藏进度条');
                            $('.progressText').text('上传完成')
                            // setTimeout(function(){
                            $('#progress')[0].style.display = 'none';
                            $('.progress-bar')[0].style.width = '0%';
                            $('.progressText').text('进度: 0%');
                            // },500);
                        };
                        xhr.upload.onprogress = function (ev) {
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        debugger
                        //返回在线图片地址
                        var type = res.substring(res.length - 3, res.length);

                    }
                });
            }
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
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
            "parentCloudFileId": this.state.parentCloudFileId,
            "name": fileObj.name,
            "path": fileUrl,
            "length": fileObj.size
        };
        console.log(param);

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
            this.listCloudSubject(this.state.parentId, true)
        }
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
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "jpg":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "mp3":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "pdf":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "ppt":
                    case "pptx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "doc":
                    case "docx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "xls":
                    case "xlsx":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    case "wps":
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                    default:
                        fileTypeLog = <img className="filePic" src={require('../imgs/subject.png')} alt=""/>;
                        break;
                }

                //文件
                headDiv = <div className="my_flex flex_align_center noomWidth"
                               onClick={_this.fileClicked.bind(this, rowData)}>
                    {fileTypeLog}
                    <div className="lineheight ant_list_subject2">
                        <div className="ant_list_title">{rowData.name}</div>
                        <div className="ant_list_time">
                            <span className="margin_right_8">{rowData.creator.userName}</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>;
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>删除</div>
                    </li>
                    <li className="flex_1" onClick={this.reNameAntFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_edit@3x.png')} alt=""/>
                        <div>重命名</div>
                    </li>
                </ul>;
            } else {
                //文件夹
                headDiv = <div className="my_flex flex_align_center noomWidth"
                               onClick={_this.fileClicked.bind(this, rowData)}>
                    <img className="filePic" src={require('../imgs/file.png')} alt=""/>
                    <div className="lineheight ant_list_subject2">
                        <div className="ant_list_title">{rowData.name}</div>
                        <div className="ant_list_time">
                            <span className="margin_right_8">{rowData.creator.userName}</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>;
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>删除</div>
                    </li>
                    <li className="flex_1" onClick={this.reNameAntFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_edit@3x.png')} alt=""/>
                        <div>重命名</div>
                    </li>
                </ul>;
            }
            return (
                <div className="noom-accordion">
                    <Accordion accordion className="my-accordion">
                        <Accordion.Panel header={headDiv} key={id}>
                            {headDivItem}
                        </Accordion.Panel>
                    </Accordion>
                </div>
            )
        };

        return (
            <div id="antPlate" className={this.state.phoneType == '0' ? 'Android_wrap' : ''}
                 style={{height: this.state.clientHeight}}>
                <div className="ant_title">
                    <span style={{display: parentId === -1 ? '' : 'none'}} className="ant_btn_list icon_back"
                    >我的资源</span>
                    <span style={{display: parentId === -1 ? 'none' : ''}} className="ant_btn_list icon_back"
                          onClick={this.returnParentAtMoveModal}><Icon type='left'/></span>
                    <div className='btns'>
                         <span className="ant_btn_list" onClick={this.creatNewFile}><img className="ant_btn_img"
                                                                                         src={require('../imgs/icon_ant_new.png')}
                                                                                         alt=""/><span>新建</span></span>
                        <span className="ant_btn_line"></span>
                        <span className="ant_btn_list" onClick={this.upLoadQue}><img className="ant_btn_img"
                                                                                     src={require('../imgs/icon_ant_uploading.png')}
                                                                                     alt=""/><span>上传</span></span>
                        <input style={{display: 'none'}} type="file" id="upload" multiple="multiple"/>
                    </div>

                </div>

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
                        height: this.state.clientHeight - 28,
                    }}
                />
            </div>
        );
    }
}
