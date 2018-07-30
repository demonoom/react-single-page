import React from 'react';
import {
    Toast,
    WhiteSpace,
    Button,
    InputItem,
    Icon,
    Tag
} from 'antd-mobile';
import "../css/addARTextbook.less"

var teacherV;

export default class addARTextbook extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            ARTextbookArr: [],  //AR材料结构
            ARTextbookDataArr: [],  //AR材料数据
            search_bg: false,
            clientHeight: document.body.clientHeight,
            fileNewArr: [],  //存储附件
            picNewArr: [],  //存储照片
            videoNewArr: [], //存储视频
            // searchData: [],
            arrIdDiv: [],
            arrTextDiv: []
        };
    }

    componentWillMount() {
        document.title = '添加AR教材';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        window.addEventListener('resize', this.onWindwoResize);
    }

    componentDidMount() {
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
     * 新增AR教材
     */
    addARBook = () => {
        if (teacherV.state.ARTextbookValue == undefined) {
            Toast.info("请输入AR教材名称")
            return
        }
        if (teacherV.state.fileNewArr.length == 0) {
            Toast.info("请上传附件")
            return
        }

        if (teacherV.state.ARTextbookDataArr.length == 0) {
            Toast.info("AR教材的图片和视频不能为空")
            return
        }
        if (teacherV.state.pageNoValue == undefined) {
            Toast.info("请输入页码")
            return
        }

        if (teacherV.state.picNewArr.length == 0) {
            Toast.info("请上传照片")
            return
        }

        if (teacherV.state.videoNewArr.length == 0) {
            Toast.info("请上传视频")
            return
        }
        /**
         * 获取文件路径
         */
        var filePath = teacherV.state.fileNewArr.map((v, i) => {
            return v.filePath
        })
        var param = {
            "method": 'addARBook',
            "bookData": {
                "creatorId": teacherV.state.uid,
                "name": teacherV.state.ARTextbookValue,
                "attachment": filePath[0]
            }
        }

        var classArray = [];
        this.state.ARTextbookDataArr.forEach(function (v, i) {
            classArray.push({
                "page": v.pageNoValue,
                "index": i,
                "pic": v.picPath + '?size=300x300',
                "video": v.videoPath.join(",")
            })
        })
        param.bookData.itemList = classArray;

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
    inputOnChange = (index, value) => {
        console.log(index, "calmIndex")
        this.setState({
            pageNoValue: value
        })
        this.state.ARTextbookDataArr[index].pageNoValue = value;
        this.buildARTextbook();
    }



    /**
     *播放视频
     */
    deleteItem(ind, useIndex) {
        // var videoDiv = $(".videoDiv")
        // videoDiv[i].play();

        teacherV.state.ARTextbookDataArr[useIndex].videoObj.forEach((v, i) => {
            if (ind == i) {
                console.log(v, "v")
                console.log(i, "i")
                console.log(ind, "ind")
                teacherV.state.ARTextbookDataArr[useIndex].videoObj.splice(i, 1)
                teacherV.buildARTextbook();

            }



        })

    }

    /**
     * 图片预览
     */
    imgPreview(data) {
        var dataObj = {};
        dataObj.method = 'showImage';
        dataObj.url = data.picPath;
        dataObj.currentUrl = data.picPath;
        Bridge.callHandler(dataObj, null, function (error) {
            console.log(error);
        })
    }

    /**
     * 附件预览
     * @param data
     */
    pdfPreview(data) {
        var content2 = data.filePath.replace("60.205.111.227", "www.maaee.com");
        var content3 = content2.replace("60.205.86.217", "www.maaee.com");
        var data = {};
        data.method = 'openNewPage';
        data.url = "http://www.maaee.com/Excoord_For_Education/js/pdfjs/web/viewer.html?file=" + content3;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 视频,文件预览
     */
    videoPreview(src, event) {
        event.stopPropagation()
        console.log(src);

        if (src.substr(src.length - 3, 3) != 'mp4') {

            /*var param = {
                "method": 'getOfficeHadleFileBySourcePath',
                "sourcePath": src
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    console.log(result);
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
            });*/

            var content2 = src.replace("60.205.111.227", "www.maaee.com");
            var content3 = content2.replace("60.205.86.217", "www.maaee.com");
            var data = {};
            data.method = 'openNewPage';
            data.url = "http://www.maaee.com/Excoord_For_Education/js/pdfjs/web/viewer.html?file=" + content3;
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
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


    /**
     * 标签点击确定的回调
     */
    submitTagArr(useIndex) {
        // console.log(useIndex, "calmuseIndex")
        console.log(useIndex,"useIndex")
        // console.log(teacherV.state.arrTextDiv,"arrTextDiv")
        teacherV.state.ARTextbookDataArr[useIndex].tagText = teacherV.state.arrTextDiv;
        teacherV.buildARTextbook();
        // console.log(teacherV.state.ARTextbookDataArr[useIndex].tagText, "calmTag")
        // teacherV.state.ARTextbookDataArr[useIndex].tagName = teacherV.state.arrIdDiv;
        // console.log(teacherV.state.ARTextbookDataArr[useIndex].tagName,"useIndexTagName")
        // console.log(teacherV.state.ARTextbookDataArr[useIndex].tagText,"useztextName")
        // teacherV.buildARTextbook();
        // teacherV.state.ARTextbookDataArr[useIndex].tagName = []
        // teacherV.state.ARTextbookDataArr[useIndex].tagText = []
        // teacherV.state.searchValue = "";
        // teacherV.state.searchData = [];
        // teacherV.state.arrIdDiv = [];
        // teacherV.state.arrTextDiv = [];
        $(".calmTagDiv").hide();

    }

    /**
     * 搜索框
     */
    searchInputChange = (index, value) => {
        // this.setState({
        //     searchValue: value
        // })
        console.log(index, "hehehe1");
        console.log(value, "hehehe2");
        // this.state.ARTextbookDataArr[index].searchValue = value;
        this.state.ARTextbookDataArr[index].searchValue = value;
        this.buildARTextbook();
    }
    /**
     * 添加标签
     */
    addTag(tagIndex) {

        // teacherV.state.ARTextbookDataArr[tagIndex].tagName = [];
        // teacherV.state.ARTextbookDataArr[tagIndex].tagText = [];
        // teacherV.state.searchValue = "";
        // console.log(teacherV.state.searchValue)
        // teacherV.state.ARTextbookDataArr[tagIndex].searchData = [];
        // teacherV.state.searchData = [];
        // teacherV.buildARTextbook();
        // teacherV.state.arrIdDiv = [];
        // teacherV.state.arrTextDiv = [];
        // console.log(tagIndex,"tagIndex")
        $(".calmTagDiv").show();

    }
    /**
     * 根据数据构建,完成数据的动态绑定
     */
    buildARTextbook = () => {
        var _this = this;
        var ARTextbookArr = [];
        this.state.ARTextbookDataArr.forEach(function (v, i) {
            console.log(v, "calmVVV")
            var useIndex = i;
            ARTextbookArr.push(<div>
                <div className="cont_communal add_title font_gray">第{i + 1}组</div>
                <div className="flex_addElement calm">
                    <InputItem
                        className="add_element"
                        placeholder="请输入页码"
                        value={v.pageNoValue}
                        onChange={_this.inputOnChange.bind(this, i)}
                    >
                        <div>页码</div>
                    </InputItem>
                </div>
                {/*<span>{teacherV.state.ARTextbookDataArr[i].picName}</span>*/}
                <div className="line_public"></div>
                <div className="sameBack my_flex">
                    <span className="textTitle">教材图片</span>
                    {teacherV.state.ARTextbookDataArr[i].picPath.length == 0 ? ""
                        :
                        <img onClick={teacherV.imgPreview.bind(this, teacherV.state.ARTextbookDataArr[i])}
                            className="imgTag" src={teacherV.state.ARTextbookDataArr[i].picPath} />
                    }
                    <button className="uploadBtn" onClick={teacherV.uploadImage.bind(this, i)}>教材图片</button>
                </div>

                <div className="line_public"></div>
                <div className="sameBack my_flex">
                    <div className="textTitle">相关文件
                        <p style={{ margin: 0, height: 5 }}></p>
                        <span className="uploadSupport">(支持视频、office文件)</span>
                    </div>
                    <div className="videoCont my_flex">
                        {
                            teacherV.state.ARTextbookDataArr[i].videoObj.map((v, i) => {
                                console.log(i, "ii");
                                if (v.videoExtra == "pdf") {
                                    return (
                                        <div className="pdfBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            <span onClick={teacherV.deleteItem.bind(this, i, useIndex)} >删除</span>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else if (v.videoExtra == "docx" || v.videoExtra == "doc") {
                                    return (
                                        <div className="docBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            <span onClick={teacherV.deleteItem.bind(this, i, useIndex)} >删除</span>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else if (v.videoExtra == "xls" || v.videoExtra == "xlsx") {
                                    return (
                                        <div className="xlsBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            <span onClick={teacherV.deleteItem.bind(this, i, useIndex)} >删除</span>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else if (v.videoExtra == "pptx" || v.videoExtra == "ppt") {
                                    return (
                                        <div className="pptBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <span onClick={teacherV.deleteItem.bind(this, i, useIndex)} >删除</span>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            {/* <span >播放</span> */}
                                            <video className="videoDiv"
                                                src={v.videoPath}></video>
                                            <span onClick={teacherV.deleteItem.bind(this, i, useIndex)} >删除</span>
                                            {/* <span>{v.videoName}</span> */}
                                        </div>
                                    )
                                }

                            })
                        }
                        <button className="uploadBtn" onClick={teacherV.uploadVideo.bind(this, i)}>相关视频</button>
                    </div>
                </div>
                <div onClick={teacherV.addTag.bind(this, useIndex)}>添加标签</div>
                <div className="calmTagDiv" style={{
                    display: "none",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: "0px",
                    zIndex: 1000,
                    background: "red"
                }}>
                    <InputItem
                        placeholder="请输入关键字"
                        onChange={teacherV.searchInputChange.bind(this, i)}
                        value={v.searchValue}
                    >
                    </InputItem>
                    <div onClick={teacherV.searchARBookTag.bind(this, useIndex)}>搜索</div>
                    {
                        teacherV.state.ARTextbookDataArr[useIndex].searchData.map((v, i) => {
                            return (
                                v
                            )
                            console.log(useIndex, "calmuseIndex")
                            // console.log(v, `${"calmVResult"+i}`)
                            // return (
                            //     <Tag data-seed={v.id} onChange={teacherV.tagChange.bind(this, v)}>{v.content}</Tag>
                            // )
                        })
                    }
                    <div onClick={teacherV.submitTagArr.bind(this, useIndex)}>确定</div>
                </div>
                {
                    teacherV.state.ARTextbookDataArr[useIndex].tagText.map((v, i) => {
                        console.log(v, "calmv")
                        return (
                            <div>
                                <span>{useIndex}</span>
                                {/* <span>{v}</span> */}
                            </div>
                        )
                    })
                }
            </div>)
            _this.setState({ ARTextbookArr })
        })
    };

    /**
     * 新增AR教材图片和视频的表单
     * 新增只是增加数据,然后到构建的方法中根据数据构建
     */
    addARTextbookTable = () => {
        /**
         * pageNoValue页码值
         * picPath图片路径
         * picName图片名称
         * videoName视频路径
         * videoName视频名称
         */
        this.state.ARTextbookDataArr.push({
            pageNoValue: '',
            picPath: [],
            picName: [],
            videoPath: [],
            videoObj: [],
            videoName: [],
            tagName: [],
            tagText: [],
            searchData: [],
            searchValue: ""

        });
        this.buildARTextbook();
    };

    /**
     *上传附件
     *
     * @memberof addARTextbook
     */
    uploadFile() {
        var data = {
            method: 'selectAttech',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到附件地址,显示在页面等待上传
            var arr = res.split(',');
            let newArr = [];
            arr.forEach((v, i) => {
                console.log(v);
                let item = v.split("?");
                newArr.push({
                    filePath: item[0],
                    fileName: item[1].split("=")[1],
                    fileExtra: (item[1].split("=")[1]).split(".")[1],
                })
            })
            teacherV.setState({ fileNewArr: newArr });
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传照片
     */
    uploadImage(index) {
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            var arr = res.split(',');
            let newArr = [];
            arr.forEach((v, i) => {
                let item = v.split("?");
                newArr.push({
                    picPath: item[0],
                    picName: item[1].split("=")[1]
                })
                teacherV.state.ARTextbookDataArr[index].picPath = newArr[i].picPath
                teacherV.state.ARTextbookDataArr[index].picName = newArr[i].picName;
            })
            teacherV.setState({ picNewArr: newArr });
            teacherV.buildARTextbook();
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传视频
     */
    uploadVideo(index) {
        var data = {
            method: 'selectVideo',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到视频地址,显示在页面等待上传
            var arr = res.split(',');
            let newArr = [];
            arr.forEach((v, i) => {
                let item = v.split("?");
                newArr.push({
                    videoPath: item[0],
                    videoName: item[1].split("=")[1],
                    videoExtra: (item[1].split("=")[1]).split(".")[1]
                })
                teacherV.state.ARTextbookDataArr[index].videoObj.push(newArr[i]);
                teacherV.state.ARTextbookDataArr[index].videoPath.push(newArr[i].videoPath);
                teacherV.state.ARTextbookDataArr[index].videoName.push(newArr[i].videoName);
            })
            var calmArr = teacherV.state.videoNewArr.concat(newArr);
            teacherV.setState({ videoNewArr: calmArr });
            teacherV.buildARTextbook();
        }, function (error) {
            console.log(error);
        });
    }


    /**
   * 搜索关键字结果
   */
    searchARBookTag(useIndex) {
        console.log(teacherV.state.ARTextbookDataArr[useIndex].searchValue, "calmSearchValue ")
        console.log(useIndex, "useIndex1")
        var param = {
            "method": 'searchARBookTag',
            "adminId": 23836,
            "keyword": teacherV.state.ARTextbookDataArr[useIndex].searchValue,
            "pn": -1
        };
        console.log(param, "calmSeacrhParam");
        console.log(useIndex, "useIndex2")

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(useIndex, "useIndex3")

                console.log(result, "calm")
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(useIndex, "useIndex4")
                    var arr = []
                    result.response.forEach((v,i)=>{
                        var searDiv = (
                            <Tag data-seed={v.id} onChange={teacherV.tagChange.bind(this, v)}>{v.content}</Tag>
                        )
                        arr.push(searDiv)
                    })
                    teacherV.state.ARTextbookDataArr[useIndex].searchData = arr;
                    // teacherV.state.ARTextbookDataArr[useIndex].searchData.push(result.response)
                    console.log(teacherV.state.ARTextbookDataArr[useIndex].searchData, "calmSeacrh");

                    // teacherV.setState({
                    //     searchData: result.response
                    // })
                    teacherV.buildARTextbook();

                    // teacherV.state.ARTextbookDataArr[useIndex].tagName = []
                    // teacherV.state.ARTextbookDataArr[useIndex].tagText.push(result.response.content)

                    // teacherV.setState({
                    //     // searchValue:"",
                    //     // searchData:[],
                    //     // arrIdDiv:[],
                    //     // arrTextDiv:[]
                    // }, () => {
                    //     // teacherV.buildARTextbook();
                    // })
                    // teacherV.state.ARTextbookValue = "";
                    // teacherV.state.searchData = [];
                    // teacherV.state.arrIdDiv = [];
                    // teacherV.state.arrTextDiv = [];
                }
            },
            onError: function (error) {
                Toast.fail('删除失败');
            }
        });
    }

    /**
     * 标签改变的回调
     * @param {*} id 
     * @param {*} selected 
     */
    tagChange(v, selected) {
        console.log(v,"vfg")
        var arrID = [];
        var arrText = [];
        if (selected) {
            arrID.push(v.id)
            arrText.push(v.content)
            teacherV.setState({
                arrIdDiv: teacherV.state.arrIdDiv.concat(arrID),
                arrTextDiv: teacherV.state.arrTextDiv.concat(arrText),
            }, () => {
                // console.log(teacherV.state.arrIdDiv, "arrDiv")
                console.log(teacherV.state.arrTextDiv, "arrDiv")
            })
        }
        if (!selected) {
            var index = teacherV.state.arrIdDiv.indexOf(v.id);
            if (index > -1) {
                teacherV.state.arrIdDiv.splice(index, 1);
            }
            var tIndex = teacherV.state.arrTextDiv.indexOf(v.content);
            if (tIndex > -1) {
                teacherV.state.arrTextDiv.splice(tIndex, 1);
            }
        }

    }
    render() {
        console.log("renderlw")
        return (
            <div id="addARTextbook" style={{ height: this.state.clientHeight }}>
                <div className="cont">
                    <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                    <div className="addCurriculum_cont">
                        <div className="noticeMsg_common">该页面所有项为必填项</div>
                        <InputItem
                            placeholder="请输入教材名称"
                            ref={el => this.labelFocusInst = el}
                            onChange={v => teacherV.setState({
                                ARTextbookValue: v
                            })}

                        >
                            <div onClick={() => this.labelFocusInst.focus()}>AR教材</div>
                        </InputItem>
                        <div className="line_public"></div>
                        <div className="my_flex sameBack">
                            <span className="textTitle">教材附件</span>
                            {
                                teacherV.state.fileNewArr.map((v, i) => {
                                    return (
                                        <div className="fileBack" onClick={teacherV.pdfPreview.bind(this, v)}>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                })
                            }
                            <button className="uploadBtn" onClick={teacherV.uploadFile}>教材附件</button>

                        </div>

                        <div className='CourseTableArea'>
                            {
                                this.state.ARTextbookArr.map((v) => {
                                    return <div>{v}</div>
                                })
                            }
                            <WhiteSpace size="lg" />
                            <div onClick={this.addARTextbookTable} className='addARTextbookTable sameBack'>
                                <div className="addBtn">
                                    <Icon type="plus" />
                                    <span>添加组</span></div>
                            </div>

                        </div>

                    </div>
                </div>

                <div className='submitBtn'>
                    <Button type="warning" onClick={this.addARBook}>提交</Button>
                </div>
            </div>
        );
    }
}
