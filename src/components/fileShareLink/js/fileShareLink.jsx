import React from 'react';
import {
    ListView,
    Accordion,
} from 'antd-mobile';
import '../css/fileShareLink.less'

var fileShare;

export default class fileShareLink extends React.Component {

    constructor(props) {
        super(props);
        fileShare = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
        };
    }

    componentDidMount() {
        //判断访问系统是否为ios
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1) {
            this.setState({iphoneType: true})
        } else {
            this.setState({iphoneType: false})
        }
        document.title = '蚁盘文件分享';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var shareId = searchArray[0].split('=')[1];
        var userId = searchArray[1].split('=')[1];
        this.setState({shareId, userId});
        var type = 'none';
        if (WebServiceUtil.isEmpty(searchArray[2]) == false) {
            type = searchArray[2].split('=')[1];
        }
        var obj = {
            userId: userId
        };
        localStorage.setItem("fileShareUserId", JSON.stringify(obj)); //将分享人的相关信息存储在每一页中进行渲染
        if (type == 'listFiles') {
            this.listFiles(shareId, userId);
            this.setState({listFlag: true});
        } else {
            this.getCloudFileShareById(shareId);
            this.setState({listFlag: false});
            var fileShareId = {
                shareId: shareId
            };
            localStorage.setItem("fileShareId", JSON.stringify(fileShareId)); //将分享人的相关信息存储在每一页中进行渲染
        }

        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', fileShare.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', fileShare.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            fileShare.setState({clientHeight: document.body.clientHeight});
        }, 100)
    }

    /**
     * 获取文件夹内部
     * @param shareId
     * @param userId
     */
    listFiles(shareId, userId) {
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'listFiles',
            "operateUserId": userId,
            "cloudFileId": shareId,
            "queryConditionJson": '',
            "pageNo": PageNo
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
     * 获取分享根文件的信息
     * @param id
     */
    getCloudFileShareById(id) {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getCloudFileShareById',
            "shareId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var response = result.response;
                    var obj = {
                        title: response.title,
                        createTime: response.createTime,
                        avatar: response.user.avatar
                    };
                    localStorage.setItem("fileShareUserMsg", JSON.stringify(obj)); //将分享人的相关信息存储在每一页中进行渲染

                    for (let i = 0; i < response.attachments.length; i++) {
                        var topic = response.attachments[i];
                        dataBlob[`${i}`] = topic;
                    }

                    _this.initData = _this.initData.concat(response.attachments);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: false,
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
     * 保存到蚁盘
     */
    saveFile(data) {
        //拿到文件/文件夹ID,交给客户端进行保存处理
        var shareId = JSON.parse(localStorage.getItem('fileShareId')).shareId + '';
        if (fileShare.state.listFlag) {
            //listFiles
            var fileId = data.id + '';
        } else {
            var fileId = data.cloudFileId + '';
        }

        var data = {
            method: 'saveFile',
            id: fileId,
            shareId: shareId
        };
        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }

    /**
     * 下载
     */
    downLoadFile(data) {
        //拿到文件JSON,交给客户端进行保存处理

        if (fileShare.state.listFlag) {
            //listFiles
            var file = data;
        } else {
            var file = data.cloudFile;
        }

        var data = {
            method: 'downLoadFile',
            cloudFile: JSON.stringify(file)
        };
        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }

    /**
     * 文件夹被点击
     */
    fileClicked(data, event) {
        event.stopPropagation();

        if (fileShare.state.listFlag) {
            //listFiles
            var fileId = data.id;
        } else {
            var fileId = data.cloudFileId;
        }

        var userId = JSON.parse(localStorage.getItem('fileShareUserId')).userId;

        //新开页

        var url = WebServiceUtil.mobileServiceURL + "fileShareLink?shareId=" + fileId + "&userId=" + userId + "&filesType=listFiles";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 文件被点击
     */
    queCilcked(data, event) {
        event.stopPropagation();
        if (fileShare.state.listFlag) {
            //listFiles
            var file = data;
        } else {
            var file = data.cloudFile;
        }

        if (file.suffix == 'png' || file.suffix == 'jpg') {
            //对图片类型文件的特殊处理
            var dataObj = {};
            dataObj.method = 'showImage';
            dataObj.url = file.path;
            dataObj.currentUrl = file.path;
            Bridge.callHandler(dataObj, null, function (error) {
                console.log(error);
            })
            return
        }

        var userId = JSON.parse(localStorage.getItem('fileShareUserId')).userId;
        if (WebServiceUtil.isEmpty(file.uuid) == false) {
            var url = 'http://www.maaee.com/Excoord_PhoneService/cloudFile/cloudFileShow/' + file.uuid + '/' + userId;
        } else {
            // var url = file.path
            var url = 'http://www.maaee.com/Excoord_PhoneService/cloudFile/cloudFileShow/' + file.id + '/' + userId;
        }

        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {

        if (!fileShare.state.listFlag) {
            return
        }

        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
        _this.listFiles(fileShare.state.shareId, fileShare.state.userId);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    render() {

        var iphoneDisplay;
        if (this.state.iphoneType) {
            iphoneDisplay = 'none';
        } else {
            iphoneDisplay = 'inline-block';
        }

        var _this = this;

        var fileShareUserMsg = JSON.parse(localStorage.getItem('fileShareUserMsg'));
        var avatarDiv = <div></div>;

        if (WebServiceUtil.isEmpty(fileShareUserMsg) == false) {
            avatarDiv = <div className="userMsg my_flex">
                <img className="userImg" src={fileShareUserMsg.avatar}/>
                <div className="userDiv flex_1">
                    <div className="ant_list_title ant_list_title_top">{fileShareUserMsg.title}</div>
                    <div
                        className="ant_list_time">{WebServiceUtil.formatYMD(fileShareUserMsg.createTime) + ' ' + WebServiceUtil.formatHM(fileShareUserMsg.createTime)}</div>
                </div>
            </div>;
            if (this.state.listFlag) {
                avatarDiv = <div></div>;
            }
        }

        const row = (rowData, sectionID, rowID) => {
            var headDiv;
            var headDivItem;

            if (fileShare.state.listFlag) {
                //listFiles
                var time = WebServiceUtil.formatYMD(rowData.createTime) + ' ' + WebServiceUtil.formatHM(rowData.createTime);
                var id = rowData.id;
                var name = rowData.name;
                var fileType = rowData.fileType;
                var file = rowData;
            } else {
                var time = WebServiceUtil.formatYMD(rowData.cloudFile.createTime) + ' ' + WebServiceUtil.formatHM(rowData.cloudFile.createTime);
                var id = rowData.cloudFileId;
                var name = rowData.cloudFile.name;
                var fileType = rowData.cloudFile.fileType;
                var file = rowData.cloudFile;
            }

            if (fileType == 0) {
                //文件
                var img;
                if (file.suffix == 'apk') {
                    img = <img className="filePic" src={require("../imgs/apk.png")} alt=""/>
                } else if (file.suffix == 'ppt' || file.suffix == 'pptx') {
                    img = <img className="filePic" src={require("../imgs/ppt.png")} alt=""/>
                } else if (file.suffix == 'doc') {
                    img = <img className="filePic" src={require("../imgs/doc.png")} alt=""/>
                } else if (file.suffix == 'pdf') {
                    img = <img className="filePic" src={require("../imgs/pdf.png")} alt=""/>
                } else if (file.suffix == 'txt') {
                    img = <img className="filePic" src={require("../imgs/wps.png")} alt=""/>
                } else if (file.suffix == 'zip') {
                    img = <img className="filePic" src={require("../imgs/其他.png")} alt=""/>
                } else if (file.suffix == 'xls' || file.suffix == 'xlsx') {
                    img = <img className="filePic" src={require("../imgs/xls.png")} alt=""/>
                } else if (file.suffix == 'mp3') {
                    img = <img className="filePic" src={require("../imgs/mp3.png")} alt=""/>
                } else if (file.suffix == 'mp4') {
                    img = <img className="filePic" src={require("../imgs/mp4.png")} alt=""/>
                } else if (file.suffix == 'png') {
                    img = <img className="filePic" src={require("../imgs/png.png")} alt=""/>
                } else if (file.suffix == 'jpg') {
                    img = <img className="filePic" src={require("../imgs/jpg.png")} alt=""/>
                } else {
                    img = <img className="filePic" src={require("../imgs/其他.png")} alt=""/>
                }

                headDiv =
                    <div className="my_flex flex_align_center noomWidth"
                         onClick={_this.queCilcked.bind(this, rowData)}>
                        {img}
                        <div className="lineheight ant_list_subject2">
                            <div className="ant_list_title">{name}</div>
                            <div className="ant_list_time">{time}</div>
                        </div>
                    </div>;

                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.saveFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_sharecopy.png')} alt=""/>
                        <div>保存到蚁盘</div>
                    </li>
                    <li style={{display: iphoneDisplay}} className="flex_1"
                        onClick={this.downLoadFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_xiazai@3x.png')} alt=""/>
                        <div>下载</div>
                    </li>
                </ul>;
            } else {
                //文件夹
                headDiv = <div className="my_flex flex_align_center noomWidth"
                               onClick={_this.fileClicked.bind(this, rowData)}>
                    <img className="filePic" src={require('../../termitePlateLibrary/imgs/file.png')} alt=""/>
                    <div className="lineheight ant_list_subject2">
                        <div className="ant_list_title">{name}</div>
                        <div className="ant_list_time">
                            <span>{time}</span>
                        </div>
                    </div>
                </div>;
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.saveFile.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_sharecopy.png')} alt=""/>
                        <div>保存到蚁盘</div>
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
            <div id="fileShareLink" style={{height: document.body.clientHeight}}>
                {avatarDiv}
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
                        height: this.state.clientHeight,
                    }}
                />
            </div>
        );
    }
}
