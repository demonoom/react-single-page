import React from 'react';
import {
    ListView,
    Accordion,
    Modal,
    Toast,
    ActionSheet
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
        document.title = '蚁盘文件分享';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var shareId = searchArray[0].split('=')[1];
        this.getCloudFileShareById(shareId);

        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', fileShare.onWindowResize)

        //this.listFiles();

        // var loginUser = {
        //     "shareId": shareId,
        // };
        // localStorage.setItem("loginUserTLibrary", JSON.stringify(loginUser));
        // if (fileId == -1) {
        //     //进入根目录
        //     this.getUserRootCloudSubjects()
        // } else {
        //     //进入文件夹
        //     this.listCloudSubject(fileId)
        // }

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

    listFiles() {
        var param = {
            "method": 'listFiles',
            "operateUserId": '23836',
            "cloudFileId": 1046,
            "queryConditionJson": '',
            "pageNo": 1
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(result);
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

                    //var pager = result.pager;
                    for (let i = 0; i < response.attachments.length; i++) {
                        var topic = response.attachments[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    if (response.length > 0) {
                        // if (pager.pageCount == 1 && pager.rsCount < 30) {
                        //     isLoading = false;
                        // } else {
                        isLoading = true;
                        // }
                    } else {
                        isLoading = false;
                    }
                    _this.initData = _this.initData.concat(response.attachments);
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
     * 保存到蚁盘
     */
    saveFile(data) {
        console.log(data);
    }

    /**
     * 下载
     */
    downLoadFile(data) {
        console.log(data);
    }

    /**
     * 文件夹被点击
     */
    fileClicked(data) {
        console.log(data);
    }

    /**
     * 文件被点击
     */
    queCilcked(data) {
        console.log(data);
    }

    render() {

        var _this = this;

        var fileShareUserMsg = JSON.parse(localStorage.getItem('fileShareUserMsg'));

        const row = (rowData, sectionID, rowID) => {

            console.log(rowData.cloudFile);

            var headDiv;
            var headDivItem;
            var time = WebServiceUtil.formatYMD(rowData.cloudFile.createTime) + ' ' + WebServiceUtil.formatHM(rowData.cloudFile.createTime);
            var id = rowData.cloudFileId;

            if (rowData.cloudFile.fileType == 0) {
                //文件
                var img = <img src='../imgs/singleChoice.png'/>;
                // if (rowData.subject.typeName == '单选题') {
                //     imgs = <imgs className="QuePic" src={require('../imgs/singleChoice.png')} alt=""/>
                // } else if (rowData.subject.typeName == '简答题') {
                //     imgs = <imgs className="QuePic" src={require('../imgs/shortAnswer.png')} alt=""/>
                // } else if (rowData.subject.typeName == '多选题') {
                //     imgs = <imgs className="QuePic" src={require('../imgs/multipleChoice.png')} alt=""/>
                // } else {
                //     imgs = <imgs className="QuePic" src={require('../imgs/trueOrFalse.png')} alt=""/>
                // }

                headDiv = <div onClick={_this.queCilcked.bind(this, rowData)}>
                    {img}
                    <div>
                        <div>
                            <span>{rowData.cloudFile.name}</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>;

                headDivItem = <ul>
                    <li onClick={this.saveFile.bind(this, rowData)}>
                        <img src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>保存到蚁盘</div>
                    </li>
                    <li onClick={this.downLoadFile.bind(this, rowData)}>
                        <img src={require('../imgs/icon_edit@3x.png')} alt=""/>
                        <div>下载</div>
                    </li>
                </ul>;
            } else {
                //文件夹
                headDiv = <div onClick={_this.fileClicked.bind(this, rowData)}>
                    <img src={require('../../termitePlateLibrary/imgs/file.png')} alt=""/>
                    <div>
                        <div>
                            <span>{rowData.cloudFile.name}</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>;
                headDivItem = <ul>
                    <li onClick={this.saveFile.bind(this, rowData)}>
                        <img src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>保存到蚁盘</div>
                    </li>
                </ul>;
            }

            return (
                <div>
                    <Accordion accordion>
                        <Accordion.Panel header={headDiv} key={id}>
                            {headDivItem}
                        </Accordion.Panel>
                    </Accordion>
                </div>
            )
        };

        return (
            <div id="fileShareLink" style={{height: document.body.clientHeight}}>
                <div className="userMsg">
                    <img className="userImg" src={fileShareUserMsg.avatar}/>
                    <div className="userDiv">
                        <div>{fileShareUserMsg.title}</div>
                        <div>{WebServiceUtil.formatYMD(fileShareUserMsg.createTime) + ' ' + WebServiceUtil.formatHM(fileShareUserMsg.createTime)}</div>
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
                        height: this.state.clientHeight - 50,
                    }}
                />
            </div>
        );
    }
}
