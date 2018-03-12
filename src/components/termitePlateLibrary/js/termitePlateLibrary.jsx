import React from 'react';
import {
    ListView,
    PullToRefresh,
    Accordion,
    Modal,
    Toast,
    Popover
} from 'antd-mobile';
import '../css/termitePlateLibrary.less'

const prompt = Modal.prompt;

const alert = Modal.alert;

const Item = Popover.Item;

var tLibrary;

export default class termitePlateLibrary extends React.Component {

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
            parentFileId: '-1',    //parentFileId会push进parentFileIdArr
            parentFileIdArr: [],
        };
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var fileId = searchArray[1].split('=')[1];
        var phoneType = searchArray[2].split('=')[1];
        if (phoneType == '0') {
            //iOS
            this.setState({phoneHeight: 28 + 108});
        } else {
            //Android
            this.setState({phoneHeight: 28});
        }
        this.setState({parentCloudFileId: fileId});
        var loginUser = {
            "ident": ident,
        };
        localStorage.setItem("loginUserTLibrary", JSON.stringify(loginUser));
        this.getUserRootCloudSubjects();
    }

    /**
     * 文件夹内部请求接口
     * @param fileId
     * @param clearFlag
     */
    listCloudSubject(fileId, clearFlag) {
        this.setState({parentFileId: fileId});
        this.setState({parentCloudFileId: fileId});
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
        var data = {};
        data.method = 'goBackWeb';
        data.fileIndex = '-1';
        setTimeout(function () {
            Bridge.callHandler(data, null, function (error) {
                alert(error)
            });
        }, 350);

        this.setState({parentCloudFileId: '-1'});
        var loginUser = JSON.parse(localStorage.getItem('loginUserTLibrary'));
        var _this = this;
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'getUserRootCloudSubjects',
            "userId": loginUser.ident,
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
        if (this.state.parentFileId != 'NAN') {
            this.state.parentFileIdArr.push(this.state.parentFileId);
        }

        event.stopPropagation();
        this.state.defaultPageNo = 1;

        //进入文件夹,只会调用list接口,向客户端发送父文件夹id,记录parentFileId
        this.listCloudSubject(obj.id, true);

        var data = {};
        data.method = 'goBackWeb';
        data.fileIndex = '-2';
        Bridge.callHandler(data, function (mes) {
            //后退信号
            tLibrary.fileOnBack();
        }, function (error) {
            alert(error)
        });
    };

    /**
     * 文件夹返回函数
     */
    fileOnBack() {
        this.state.defaultPageNo = 1;
        var arrLength = this.state.parentFileIdArr.length;
        var _this = this;
        var fileId = this.state.parentFileIdArr[arrLength - 1];
        if (fileId == '-1') {
            _this.setState({parentFileId: 'NAN'});
            _this.getUserRootCloudSubjects(true);
        } else {
            _this.listCloudSubject(fileId, true);
            _this.state.parentFileIdArr.splice(arrLength - 1, 1)
        }
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
        this.state.defaultPageNo = 1;
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

    /**
     * 将上传交给客户端处理
     * @param buttonIndex
     */
    postMesToMob(buttonIndex) {

        var _this = this;
        var parentCloudFileId = tLibrary.state.parentCloudFileId;
        var data = {
            parentCloudFileId: parentCloudFileId,
            isPractive: 'true',
        };
        if (buttonIndex == 'singleChoiceInCloud') {
            data.method = 'singleChoiceInCloud';
        } else if (buttonIndex == 'shortAnswerInCloud') {
            data.method = 'shortAnswerInCloud';
        } else if (buttonIndex == 'trueOrFalseInCloud') {
            data.method = 'trueOrFalseInCloud';
        } else if (buttonIndex == 'multipleChoiceInCloud') {
            data.method = 'multipleChoiceInCloud';
        }
        Bridge.callHandler(data, function (mes) {
            // 刷新
            _this.state.defaultPageNo = 1;

            if (_this.state.parentCloudFileId == -1) {
                _this.getUserRootCloudSubjects(true)
            } else {
                _this.listCloudSubject(_this.state.parentCloudFileId, true)
                var data = {};
                data.method = 'goBackWeb';
                data.fileIndex = '-2';
                Bridge.callHandler(data, function (mes) {
                    //后退信号
                    tLibrary.fileOnBack();
                }, function (error) {
                    alert(error)
                });
            }

        }, function (error) {
            Toast.fail(error, 5);
        });
    }

    /**
     * 删除弹出框
     */
    showAlert = (data) => {
        var _this = this;
        const alertInstance = alert('删除', '您确定要删除该文件吗?', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.removeFile(data)},
        ]);
    };

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
        var requestParams = encodeURI("params=" + JSON.stringify(param));
        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            if (result.data.msg == '调用成功' || result.data.success == true) {
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
                Toast.fail('删除失败', 1);
            }
        });
    }

    /**
     * 文件夹重命名
     */
    renameFile(str, data) {
        var _this = this;
        var param = {
            "method": 'renameCloudFile',
            "operateUserId": JSON.parse(localStorage.getItem('loginUserTLibrary')).ident,
            "cloudFileId": data.id,
            "name": str
        };
        var requestParams = encodeURI("params=" + JSON.stringify(param));
        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            if (result.data.msg == '调用成功' || result.data.success == true) {
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
                //解决安卓键盘改变窗口高度问题,所以延迟300
                setTimeout(function () {
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                }, 300);

            } else {
                Toast.fail('重命名失败', 1);
            }
        });
    }

    /**
     * 上传被点击
     * @param opt
     */
    popoverOnSelect(opt) {
        tLibrary.setState({
            visible: false,
        });
        tLibrary.postMesToMob(opt.props.value);
    }

    //下拉刷新
    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({defaultPageNo: 1, refreshing: true});
        if (this.state.parentCloudFileId == -1) {
            this.getUserRootCloudSubjects(true);
        } else {
            this.listCloudSubject(this.state.parentCloudFileId, true);
        }

    };

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            var headDiv;
            var headDivItem;
            var time = WebServiceUtil.formatYMD(rowData.createTime) + ' ' + WebServiceUtil.formatHM(rowData.createTime);
            var id = rowData.id;

            if (rowData.fileType == 2) {
                //题目
                var img;
                if (rowData.subject.typeName == '单选题') {
                    img = <img className="QuePic" src={require('../imgs/singleChoice.png')} alt=""/>
                } else if (rowData.subject.typeName == '简答题') {
                    img = <img className="QuePic" src={require('../imgs/shortAnswer.png')} alt=""/>
                } else if (rowData.subject.typeName == '多选题') {
                    img = <img className="QuePic" src={require('../imgs/multipleChoice.png')} alt=""/>
                } else {
                    img = <img className="QuePic" src={require('../imgs/trueOrFalse.png')} alt=""/>
                }

                headDiv = <div className="my_flex flex_align_center">
                    {img}
                    <div onClick={_this.queCilcked.bind(this, rowData.subject)} className="lineheight ant_list_subject">
                        <div className="ant_list_title ant_list_subject_no"
                             dangerouslySetInnerHTML={{__html: rowData.name}}>
                        </div>
                    </div>
                </div>;

                headDivItem = <ul className="my_flex ul_list_del flex_align_center">
                    <li className="flex_1" onClick={this.showAlert.bind(this, rowData)}>
                        <img className="icon_small_del" src={require('../imgs/icon_delet@3x.png')} alt=""/>
                        <div>删除</div>
                    </li>
                </ul>;
            } else {
                //文件夹
                headDiv = <div className="my_flex flex_align_center" onClick={_this.fileClicked.bind(this, rowData)}>
                    <img className="filePic" src={require('../imgs/file.png')} alt=""/>
                    <div className="lineheight">
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
                    <li className="flex_1" onClick={() => prompt('请输入您修改的名称', '', [
                        {text: '取消'},
                        {text: '确定', onPress: value => this.renameFile(value, rowData)},
                    ], 'default', '')}>
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
            <div id="termitePlateLibrary" className={this.state.phoneHeight == '28' ? 'Android_wrap' : ''}
                 style={{height: document.body.clientHeight}}>
                <div className="ant_title">
                    <span className="ant_btn_list" onClick={() => prompt('请输入创建的文件夹名称', '', [
                        {text: '取消'},
                        {text: '确定', onPress: value => this.creatFile(value)},
                    ], 'default', '新建文件夹')}><img className="ant_btn_img"
                                                 src={require('../imgs/icon_ant_new.png')}
                                                 alt=""/><span>新建</span></span>
                    <span className="ant_btn_line"></span>
                    <Popover mask
                             placement="bottomLeft"
                             overlayClassName="fortest termite_popover"
                             overlayStyle={{color: 'currentColor'}}
                             visible={this.state.visible}
                             overlay={[
                                 (
                                     <Item key="4" value="singleChoiceInCloud" data-seed="logId">单选题</Item>),
                                 (<Item key="5" value="shortAnswerInCloud"
                                        style={{whiteSpace: 'nowrap'}}>简答题</Item>),
                                 (<Item key="6" value="trueOrFalseInCloud">
                                     <span style={{marginRight: 5}}>判断题</span>
                                 </Item>),
                                 (<Item key="7" value="multipleChoiceInCloud">
                                     <span style={{marginRight: 5}}>多选题</span>
                                 </Item>),
                             ]}
                             align={{
                                 overflow: {adjustY: 0, adjustX: 0},
                                 offset: [0, 0],
                             }}
                             onSelect={this.popoverOnSelect}
                    >
                        <span className="ant_btn_list">
                            <img className="ant_btn_img"
                                 src={require('../imgs/icon_ant_uploading.png')}
                                 alt=""/>
                            <span>上传</span>
                        </span>
                    </Popover>

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
                        height: document.body.clientHeight - this.state.phoneHeight,
                    }}
                    pullToRefresh={<PullToRefresh
                        onRefresh={this.onRefresh}
                        distanceToRefresh={80}
                    />}
                />
            </div>
        );
    }
}
