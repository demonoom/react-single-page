import React from 'react';
import {
    Toast,
    Button,
    InputItem,
    Tabs, WhiteSpace
} from 'antd-mobile';
import "../css/UpdateARTextbook.less"

var teacherV;

export default class newUpdateARTextbook extends React.Component {

    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            search_bg: false,
            clientHeight: document.body.clientHeight,
            picNewObj: {},  //存储照片
            videoNewObj: [], //存储视频
            initData: {},
            itemList: [],
            ARTextbookValue: '',  //教材名称
            attachment: '',  //附件地址
        };
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var bId = locationSearch.split("&")[0].split("=")[1];
        var uId = locationSearch.split("&")[1].split("=")[1];
        var ArName = locationSearch.split("&")[2].split("=")[1];
        this.setState({"bId": bId, "uId": uId, "ArName": ArName});
        this.viewARBook(bId);
        window.addEventListener('resize', this.onWindwoResize);
    }

    componentDidMount() {
        document.title = '教材第';
        Bridge.setShareAble("false");
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindwoResize);
    }

    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            teacherV.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }

    /**
     * 更新AR教材
     */
    updateARBook = () => {
        var arr = teacherV.state.itemList;
        for (var k in arr) {
            if (k == teacherV.state.getIndex) {
                arr[k].index = k;
                arr[k].page = teacherV.state.pageNoValue;
                arr[k].pic = teacherV.state.picNewObj + '?size=300x300';
                arr[k].video = teacherV.state.videoNewObj.join(",")
            }
        }
        var param = {
            "method": 'updateARBook',
            "bookData": {
                "creatorId": teacherV.state.uId,
                "id": teacherV.state.bId,
                "name": teacherV.state.ARTextbookValue,
                "attachment": teacherV.state.attachment,
                "status": teacherV.state.status,
                "itemList": arr
            }
        }
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 页码数据框动态绑定内容的方法
     * @param index
     * @param value
     */
    inputOnChange = (value) => {
        this.setState({
            pageNoValue: value
        })
    }

    /**
     * 查看单独的AR教材
     */
    viewARBook(bId) {
        var param = {
            "method": 'viewARBook',
            "bId": bId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    teacherV.state.initData = result.response;

                    var tagArr = []
                    result.response.itemList.forEach(function (v, i) {
                        // {title: '1st Tab'}
                        tagArr.push({
                            title: '第' + v.page + '页',
                            index: v.page,
                        })
                    });

                    //去重
                    teacherV.makeArr(tagArr);

                    teacherV.setState({
                        ARTextbookValue: teacherV.state.initData.name,
                        tagArr,
                        attachment: teacherV.state.initData.attachment,
                        // status: teacherV.state.initData.status,
                        // index: teacherV.state.initData.itemList[index].index,
                        // videoNewObj: teacherV.state.initData.itemList[0].video.split(","),
                        // picNewObj: teacherV.state.initData.itemList[index].pic,
                        // itemList: teacherV.state.initData.itemList
                    }, () => {
                        /**
                         * 初始化点击
                         */
                        teacherV.tabsOnChange(tagArr[0])
                    })
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

    }

    /**
     * 去重
     * @param arr
     * @returns {*}
     */
    makeArr(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i].index == arr[j].index) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr
    }

    /**
     *上传附件
     *
     * @memberof addARTextbook
     */
    uploadFile() {
        var data = {
            method: 'selectPictures',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到附件地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.filePath = item[0],
                newArr.fileName = item[1].split("=")[1],
                newArr.fileExtra = (item[1].split("=")[1]).split(".")[1],
                teacherV.setState({attachment: newArr.filePath});
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传照片
     */
    uploadImage() {
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1],
                teacherV.setState({picNewObj: newArr.picPath});
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传视频
     */
    uploadVideo() {
        var data = {
            method: 'selectVideo',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到视频地址,显示在页面等待上传
            var arr = res.split(',');
            let newArr = [];
            let pathArr = [];
            arr.forEach((v, i) => {
                let item = v.split("?");
                pathArr.push(item[0])
                newArr.push({
                    videoPath: item[0],
                    videoName: item[1].split("=")[1],
                    videoExtra: (item[1].split("=")[1]).split(".")[1]
                })
                teacherV.setState({videoExtra: (item[1].split("=")[1]).split(".")[1]})
            })
            teacherV.state.videoNewObj = []
            var calmVideo = teacherV.state.videoNewObj.concat(pathArr);
            teacherV.setState({videoNewObj: calmVideo});
        }, function (error) {
            console.log(error);
        });
    }

    /**
     *播放视频
     */
    theVideoPlay(i) {
        var videoDiv = $(".videoDiv")
        videoDiv[i].play();

    }

    tabsOnChange(index, key) {

        var arr = []
        teacherV.state.initData.itemList.forEach(function (v, i) {
            if (index.index == v.page) {
                arr.push(v)
            }
        })

        var tabItem = []

        arr.forEach(function (v, i) {

            var imgDiv = <div>
                <div className="am-list-item item_list20">
                    <div className="am-input-label am-input-label-5">图片</div>
                    <div className="div68">
                        <button className="uploadAttech i_uploadAttech" onClick={teacherV.uploadImage}>{
                            <img className="imgDiv" src={v.pic}/>
                        }
                            <div>修改</div>
                        </button>
                    </div>
                </div>

                <div className="am-list-item item_list20">
                    {
                        v.video.substr(v.video.length - 3, 3) !== "mp4" ?
                            <div className="am-input-label am-input-label-5">文件</div>
                            :
                            <div className="am-input-label am-input-label-5">视频</div>

                    }

                    <div className="div68">
                        {
                            v.video.split(',').map((v, i) => {
                                var item = v.split(".");
                                if (item[item.length - 1] == "pdf") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech pdfDiv">
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo}>修改</div>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "pptx" || item[item.length - 1] == "ppt") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech pptDiv">
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo}>修改</div>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "xls" || item[item.length - 1] == "xlsx") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech xlsDiv">
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo}>修改</div>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "docx" || item[item.length - 1] == "doc") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech docDiv">
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo}>修改</div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="uploadAttech i_uploadAttech">
                                            <video onClick={teacherV.theVideoPlay.bind(this, i)} className="videoDiv"
                                                   src={v}></video>
                                            <div onClick={teacherV.uploadVideo}>修改</div>
                                        </div>
                                    )
                                }

                            })
                        }
                    </div>
                </div>

            </div>

            tabItem.push(imgDiv)

        })
        teacherV.setState({tabItem})
    }

    render() {

        var _this = this;

        return (
            <div id="UpdateARTextbook" style={{height: this.state.clientHeight}}>
                {/*教材名*/}
                <InputItem
                    placeholder="请输入教材名称"
                    ref={el => this.labelFocusInst = el}
                    onChange={v => teacherV.setState({
                        ARTextbookValue: v
                    })}
                    value={_this.state.ARTextbookValue}
                >
                    <div onClick={() => this.labelFocusInst.focus()}>AR教材</div>
                </InputItem>

                {/*附件*/}
                <div className="am-list-item item_list20"
                >
                    <div className="am-input-label am-input-label-5">附件</div>
                    <div className="div68">
                        <button className="uploadAttech i_uploadAttech upload_file" onClick={teacherV.uploadFile}>
                            <div>修改</div>
                        </button>
                    </div>
                </div>

                <WhiteSpace/>
                <Tabs
                    tabs={this.state.tagArr}
                    renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3}/>}
                    swipeable={false}
                    animated={false}
                    useOnPan={false}
                    onChange={this.tabsOnChange}
                >
                    <div>
                        {this.state.tabItem}
                    </div>
                </Tabs>
                <WhiteSpace/>

                <div className='submitBtn'>
                    <Button type="warning" onClick={this.updateARBook}>提交</Button>
                </div>

            </div>
        );
    }
}
