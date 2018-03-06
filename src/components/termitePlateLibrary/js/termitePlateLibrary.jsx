import React from 'react';
import {ListView, PullToRefresh, Accordion, List, Modal, Button, WingBlank, WhiteSpace, Toast} from 'antd-mobile';
import '../css/termitePlateLibrary.less'

const prompt = Modal.prompt;

export default class termitePlateLibrary extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var fileId = searchArray[1].split('=')[1];
        var fileName = searchArray[2].split('=')[1];
        document.title = fileName;   //设置title
        this.setState({parentCloudFileId: fileId});
        var loginUser = {
            "ident": ident,
        };
        localStorage.setItem("loginUserTLibrary", JSON.stringify(loginUser));
        if (fileId == -1) {
            //进入根目录
            this.getUserRootCloudSubjects()
        } else {
            //进入文件夹
            this.listCloudSubject(fileId)
        }
    }

    listCloudSubject(fileId, clearFlag) {
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'listCloudSubject',
            "cloudFileId": fileId,
            "pageNo": PageNo,
        };
        var requestParams = encodeURI("params=" + JSON.stringify(param));
        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            if (result.data.msg == '调用成功' || result.data.success == true) {
                var response = result.data.response;
                var pager = result.data.pager;
                for (let i = 0; i < response.length; i++) {
                    var topic = response[i];
                    // topic.checkBoxChecked = false;
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
            "method": 'getUserRootCloudSubjects',
            "userId": loginUser.ident,
            "pageNo": PageNo,
        };
        console.log(param);
        var requestParams = encodeURI("params=" + JSON.stringify(param));
        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            console.log(result);
            if (result.data.msg == '调用成功' || result.data.success == true) {
                var response = result.data.response;
                var pager = result.data.pager;
                for (let i = 0; i < response.length; i++) {
                    var topic = response[i];
                    // topic.checkBoxChecked = false;
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
        _this.getUserRootCloudSubjects();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    /**
     * 文件夹被点击
     */
    fileClicked(obj, event) {
        event.stopPropagation();
        var loginUser = JSON.parse(localStorage.getItem('loginUserTLibrary'));
        //新开这个jsx,传递文件夹id和文件夹tittle
        var url = "http://192.168.50.29:8091/#/termitePlateLibrary?ident=" + loginUser.ident + "&fileId=" + obj.id + "&fileTitle=" + obj.name;
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    /**
     * 题目被点击
     */
    queCilcked(obj, event) {
        event.stopPropagation();
        //进入题目详情,使用原来页面
        var subjectId = obj.id;
        var url = "http://jiaoxue.maaee.com:8091/#/questionDetil?courseId=" + subjectId
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    /**
     * 创建文件夹
     */
    creatFile(value) {
        var _this = this;
        //新建文件夹,刷新页面
        var param = {
            "method": 'mkdir',
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
            "parentCloudFileId": this.state.parentCloudFileId,
            "name": value
        };
        var requestParams = encodeURI("params=" + JSON.stringify(param));
        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            if (result.data.msg == '调用成功' || result.data.success == true) {
                // 刷新
                if (_this.state.parentCloudFileId == -1) {
                    _this.getUserRootCloudSubjects(true)
                } else {
                    _this.listCloudSubject(_this.state.parentCloudFileId, true)
                }
            }
        });
    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {
            // console.log(rowData);

            var headDiv;
            var headDivItem;
            var time = WebServiceUtil.formatYMD(rowData.createTime) + ' ' + WebServiceUtil.formatHM(rowData.createTime);
            var id = rowData.id;

            if (rowData.fileType == 2) {
                //题目
                headDiv = <div className="my_flex flex_align_center">
                    <img className="QuePic" src={require('../imgs/subject.png')} alt=""/>
                    <div onClick={_this.queCilcked.bind(this, rowData.subject)} className="lineheight">
                        <div className="ant_list_time" dangerouslySetInnerHTML={{__html: rowData.name}}>
                            {/*<span className="margin_right_8">{rowData.creator.userName}</span>*/}
                            {/*<span>{time}</span>*/}
                        </div>
                    </div>
                </div>;

                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1">
                        <img className="icon_small_del" src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>删除</div>
                    </li>
                </ul>;
            } else {
                //文件夹
                headDiv = <div className="my_flex flex_align_center" onClick={_this.fileClicked.bind(this, rowData)}>
                    <img className="filePic" src={require('../imgs/file.png')} alt=""/>
                    <div onClick={_this.fileClicked} className="lineheight">
                        <div className="ant_list_title">{rowData.name}</div>
                        <div className="ant_list_time">
                            <span className="margin_right_8">{rowData.creator.userName}</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1">
                        <img className="icon_small_del" src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>删除</div>
                    </li>
                    <li className="flex_1">
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
            <div id="termitePlateLibrary">
                <div className="ant_title">
                    <span className="ant_btn_list" onClick={() => prompt('请输入创建的文件夹名称', '', [
                        {text: 'Cancel'},
                        {text: 'Submit', onPress: value => this.creatFile(value)},
                    ], 'default', '新建文件夹')}><img className="ant_btn_img"
                                                 src={require('../imgs/icon_ant_new.png')}
                                                 alt=""/><span>新建</span></span>
                    <span className="ant_btn_line"></span>
                    <span className="ant_btn_list"><img className="ant_btn_img"
                                                        src={require('../imgs/icon_ant_uploading.png')}
                                                        alt=""/><span>上传</span></span>
                </div>

                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                            {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    //renderSeparator={separator}   //可以不设置的属性  行间距
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: document.body.clientHeight,
                    }}
                    // pullToRefresh={<PullToRefresh
                    //     onRefresh={this.onRefresh}
                    //     distanceToRefresh={80}
                    // />}
                />
            </div>
        );
    }
}
