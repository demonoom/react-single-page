import React from 'react';
import {
    ListView,
    Checkbox,
    Toast,
} from 'antd-mobile';
import '../css/pushSubjectsFromTLibrary.less'

const CheckboxItem = Checkbox.CheckboxItem;

var tLibrary;

export default class pushSubjectsFromTLibrary extends React.Component {

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
            parentFileId: '-1',    //parentFileId会push进parentFileIdArr
            parentFileIdArr: [],
            pushSubjectsArr: [],   //推题的数组
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
                // alert(error)
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
            // alert(error)
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
     * 推题
     */
    pushSubjects() {
        //向客户端发送id,交给客户端处理
        if (tLibrary.state.pushSubjectsArr.length == 0) {
            Toast.fail('请选择要推送的题目', 1);
            return
        }
        var ids = tLibrary.state.pushSubjectsArr.join(',');
        var data = {
            method: 'pushSubjects',
            ids: ids
        };
        Bridge.callHandler(data, null, function (error) {
            Toast.fail(error, 5);
        });
        tLibrary.state.pushSubjectsArr.splice(0);
        var arr = document.getElementsByClassName('am-checkbox');
        for (var i = 0; i < arr.length; i++) {
            arr[i].classList.remove("am-checkbox-checked");
        }
    }

    /**
     * CheckBox被选择
     * @param e
     * @param obj
     */
    pushSubjectsOnChange(e, obj) {
        if (e.target.checked) {
            //钩中
            this.state.pushSubjectsArr.push(obj.subject.id);
        } else {
            //取消钩中
            this.state.pushSubjectsArr.forEach(function (v, i) {
                if (v == obj.subject.id) {
                    tLibrary.state.pushSubjectsArr.splice(i, 1);
                }
            })
        }
    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            var time = WebServiceUtil.formatYMD(rowData.createTime) + ' ' + WebServiceUtil.formatHM(rowData.createTime);

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
                return (
                    <CheckboxItem key={rowData.id} onChange={() => this.pushSubjectsOnChange(event, rowData)}>
                        <div className="my_flex flex_align_center noom-accordion">
                            {img}
                            <div className="lineheight ant_list_subject">
                                <div className="ant_list_title ant_list_subject_no"
                                     dangerouslySetInnerHTML={{__html: rowData.name}}>
                                </div>
                            </div>
                        </div>
                    </CheckboxItem>

                )
            } else {
                //文件夹
                return (
                    <div className="my_flex flex_align_center noom-accordion" onClick={_this.fileClicked.bind(this, rowData)}>
                        <img className="filePic" src={require('../imgs/file.png')} alt=""/>
                        <div className="lineheight">
                            <div className="ant_list_title">{rowData.name}</div>
                            <div className="ant_list_time">
                                <span className="margin_right_8">{rowData.creator.userName}</span>
                                <span>{time}</span>
                            </div>
                        </div>
                    </div>
                )
            }
        };

        return (
            <div id="pushSubjectsFromTLibrary" className="uuuuuuu" style={{height: document.body.clientHeight}}>
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
                        // height: document.body.clientHeight - this.state.phoneHeight,
                        height: document.body.clientHeight,
                    }}
                />
                <div className="pushSubjects" onClick={this.pushSubjects}>
                    <img  src={require('../imgs/tuisong_blue.png')} alt=""/>
                </div>
            </div>
        );
    }
}
