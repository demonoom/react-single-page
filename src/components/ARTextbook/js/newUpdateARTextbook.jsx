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
        document.title = '编辑教材';
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
        var arr = teacherV.state.initData.itemList;
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
                        status: teacherV.state.initData.status,
                        // index: teacherV.state.initData.itemList[index].index,
                        // videoNewObj: teacherV.state.initData.itemList[0].video.split(","),
                        // picNewObj: teacherV.state.initData.itemList[index].pic,
                        // itemList: teacherV.state.initData.itemList
                    }, () => {
                        /**
                         * 初始化点击
                         */
                        teacherV.tabsOnChange(tagArr[0])
                        teacherV.setState({clickTab: tagArr[0]})
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
    uploadFile(event) {
        event.stopPropagation()
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
            teacherV.tabsOnChange(teacherV.state.clickTab)
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传照片
     */
    uploadImage(id, event) {
        event.stopPropagation()
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]

            teacherV.state.initData.itemList.forEach(function (v, i) {
                if (v.id == id) {
                    v.pic = newArr.picPath
                }
            })
            teacherV.tabsOnChange(teacherV.state.clickTab)

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传视频
     */
    uploadVideo(src, id, event) {
        event.stopPropagation()
        var data = {
            method: 'selectVideo',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到视频地址,显示在页面等待上传
            var arr = res.split(',');

            let item = arr[0].split("?")[0];

            teacherV.state.initData.itemList.forEach(function (v, i) {
                if (v.id == id) {
                    v.video = v.video.replace(src, item);
                }
            })
            teacherV.tabsOnChange(teacherV.state.clickTab)

        }, function (error) {
            console.log(error);
        });
    }

    /**
     *播放视频
     */
    theVideoPlay(i) {
        // var videoDiv = $(".videoDiv")
        // videoDiv[i].play();

    }

    tabsOnClick(index, key) {
        teacherV.setState({clickTab: index})
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
                    <div className="am-input-label am-input-label-5">教材图片</div>
                    <div className="div68" onClick={teacherV.imgPreview.bind(this, v.pic)}>
                        <button className="uploadAttech i_uploadAttech">{
                            <img className="imgDiv" src={v.pic}/>
                        }
                            <div onClick={teacherV.uploadImage.bind(this, v.id)}>修改</div>
                        </button>
                    </div>
                </div>
                <div className="line_public"></div>
                <div className="am-list-item item_list20">
                    {
                        v.video.substr(v.video.length - 3, 3) !== "mp4" ?
                            <div className="am-input-label am-input-label-5">相关文件</div>
                            :
                            <div className="am-input-label am-input-label-5">相关视频</div>

                    }

                    <div className="div68">
                        {
                            v.video.split(',').map((vtem, index) => {
                                var item = vtem.split(".");
                                if (item[item.length - 1] == "pdf") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech pdfDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo.bind(this, vtem, v.id)}>修改</div>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "pptx" || item[item.length - 1] == "ppt") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech pptDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo.bind(this, vtem, v.id)}>修改</div>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "xls" || item[item.length - 1] == "xlsx") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech xlsDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo.bind(this, vtem, v.id)}>修改</div>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "docx" || item[item.length - 1] == "doc") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech docDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div onClick={teacherV.uploadVideo.bind(this, vtem, v.id)}>修改</div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="uploadAttech i_uploadAttech"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            <video onClick={teacherV.theVideoPlay.bind(this, i)} className="videoDiv"
                                                   src={vtem}></video>
                                            <div onClick={teacherV.uploadVideo.bind(this, vtem, v.id)}>修改</div>
                                        </div>
                                    )
                                }

                            })
                        }
                    </div>
                </div>
                <WhiteSpace size="lg"/>
            </div>

            tabItem.push(imgDiv)

        })
        teacherV.setState({tabItem})
    }

    /**
     * 附件预览
     * @param data
     */
    pdfPreview() {

        var content2 = teacherV.state.attachment.replace("60.205.111.227", "www.maaee.com");
        var content3 = content2.replace("60.205.86.217", "www.maaee.com");
        var data = {};
        data.method = 'openNewPage';
        data.url = "http://www.maaee.com/Excoord_For_Education/js/pdfjs/web/viewer.html?file=" + content3;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 图片预览
     */
    imgPreview(src) {
        var dataObj = {};
        dataObj.method = 'showImage';
        dataObj.url = src;
        dataObj.currentUrl = src;
        Bridge.callHandler(dataObj, null, function (error) {
            console.log(error);
        })
    }

    /**
     * 视频,文件预览
     */
    videoPreview(src, id, event) {
        event.stopPropagation()

        if (src.substr(src.length - 3, 3) != 'mp4') {

            var param = {
                "method": 'getOfficeHadleFileBySourcePath',
                "sourcePath": src
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        var src = result.response.pdfPath || result.response.htmlPath || result.response.path;

                        var pdfURL = src.replace("60.205.111.227", "www.maaee.com");
                        pdfURL = pdfURL.replace("60.205.86.217", "www.maaee.com");
                        if (pdfURL.indexOf("https") == -1 && pdfURL.indexOf("http") != -1) {
                            pdfURL = pdfURL.replace("http", "https");
                        }
                        var data = {};
                        data.method = 'openNewPage';
                        data.url = pdfURL;
                        Bridge.callHandler(data, null, function (error) {
                            window.location.href = url;
                        });

                    } else {
                        Toast.fail(result.msg, 5);
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        } else {
            //视频预览

            var data = {
                method: 'playVideo',
                url: src
            };
            Bridge.callHandler(data, null, function (error) {

            });
        }

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
                <div className="line_public"></div>
                {/*附件*/}
                <div className="am-list-item item_list20"
                >
                    <div className="am-input-label am-input-label-5">教材附件</div>
                    <div className="div68" onClick={teacherV.pdfPreview}>
                        <button className="uploadAttech i_uploadAttech upload_file">
                            <div onClick={teacherV.uploadFile}>修改</div>
                        </button>
                    </div>
                </div>

                <WhiteSpace size="lg"/>
                <Tabs
                    tabs={this.state.tagArr}
                    renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3}/>}
                    swipeable={false}
                    animated={false}
                    useOnPan={false}
                    onChange={this.tabsOnChange}
                    onTabClick={this.tabsOnClick}
                >
                    <div>
                        {this.state.tabItem}
                    </div>
                </Tabs>

                <div className='submitBtn'>
                    <Button type="warning" onClick={this.updateARBook}>提交</Button>
                </div>

            </div>
        );
    }
}
