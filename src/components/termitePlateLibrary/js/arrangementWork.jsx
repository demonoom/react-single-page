import React from 'react';
import {
    ListView,
    Checkbox,
    Toast,
} from 'antd-mobile';
import '../css/arrangementWork.less';

const CheckboxItem = Checkbox.CheckboxItem;

var tLibrary;

export default class arrangementWork extends React.Component {

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
            arrangementWorkArr: [],   //推题的数组
        };
    }

    componentDidMount() {
        document.title = '选择题目';   //设置title
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var fileId = searchArray[1].split('=')[1];
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

    /**
     * 文件夹内部请求接口
     * @param fileId
     * @param clearFlag
     */
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
        event.stopPropagation();
        var loginUser = JSON.parse(localStorage.getItem('loginUserTLibrary'));
        //新开这个jsx,传递文件夹id和文件夹tittle
        var url = "http://192.168.50.29:8091/#/arrangementWork?ident=" + loginUser.ident + "&fileId=" + obj.id;
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    /**
     * 布置作业,交给客户端
     */
    arrangementWork() {
        //向客户端发送id,交给客户端处理
        if (tLibrary.state.arrangementWorkArr.length == 0) {
            Toast.fail('请选择要布置的题目', 1);
            return
        }

        var data = {
            method: 'arrangementWork',
            subjects: JSON.stringify(tLibrary.state.arrangementWorkArr)
        };
        Bridge.callHandler(data, null, function (error) {
            Toast.fail(error, 5);
        });
        //由于客户端在此处直接关闭页面,所以不用再处理移除数据逻辑
    }

    /**
     * CheckBox被选择
     * @param e
     * @param obj
     */
    pushSubjectsOnChange(e, obj) {
        if (e.target.checked) {
            //钩中
            this.state.arrangementWorkArr.push(obj.subject);
        } else {
            //取消钩中
            this.state.arrangementWorkArr.forEach(function (v, i) {
                if (v.id == obj.subject.id) {
                    tLibrary.state.arrangementWorkArr.splice(i, 1);
                }
            })
        }
    }

    /**
     * 题目被点击
     */
    queClicked(obj, event) {
        event.stopPropagation();

        //进入题目详情,使用原来页面
        var subjectId = obj.id;
        var url = "http://jiaoxue.maaee.com:8091/#/questionDetil?courseId=" + subjectId;
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            if (rowData.fileType == 2) {
                //题目
                return (
                    <CheckboxItem key={rowData.id} onChange={() => this.pushSubjectsOnChange(event, rowData)}>
                        <div className="ant_list_subject_no" dangerouslySetInnerHTML={{__html: rowData.name}}>
                        </div>
                        <div onClick={this.queClicked.bind(this, rowData.subject)} className="flex_70"><span
                            className="S">{rowData.subject.typeName}</span>
                        </div>
                    </CheckboxItem>
                )
            } else {
                //文件夹
                return (
                    <div className="am-list-item am-checkbox-item am-list-item-middle"
                         onClick={_this.fileClicked.bind(this, rowData)}>
                        <div className="am-list-thumb"><img src={require('../imgs/file.png')} alt=""/></div>
                        <div className="am-list-line">
                            <div className="am-list-content">{rowData.name}</div>
                        </div>
                    </div>
                )
            }
        };

        return (
            <div id="arrangementWork" style={{height: document.body.clientHeight}}>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 55, textAlign: 'center'}}>
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
                        height: document.body.clientHeight,
                    }}
                />
                <div className="pushSubjects_cont">
                    <div className="pushSubjects" onClick={this.arrangementWork}>确定</div>
                </div>
            </div>
        );
    }
}
