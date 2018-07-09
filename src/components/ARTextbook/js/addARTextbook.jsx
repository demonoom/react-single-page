import React from 'react';
import {
    Toast,
    WhiteSpace,
    Button,
    InputItem,
    Icon
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
                "pic": v.picPath,
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
        this.setState({
            pageNoValue: value
        })
        this.state.ARTextbookDataArr[index].pageNoValue = value;
        this.buildARTextbook();
    }

    /**
     *播放视频 
     */
    theVideoPlay(i) {
        var videoDiv = $(".videoDiv")
        videoDiv[i].play();
    }
    /**
     * 根据数据构建,完成数据的动态绑定
     */
    buildARTextbook = () => {
        var _this = this;
        var ARTextbookArr = [];
        this.state.ARTextbookDataArr.forEach(function (v, i) {
            ARTextbookArr.push(<div>
                <div className="cont_communal add_title font_gray">第{i + 1}组</div>
                <div className="flex_addElement calm">
                    <InputItem
                        className="add_element"
                        placeholder="请输入页码"
                        value={v.pageNoValue}
                        onChange={_this.inputOnChange.bind(this, i)}
                    ><div>页码</div></InputItem>
                </div>
                {/*<span>{teacherV.state.ARTextbookDataArr[i].picName}</span>*/}
                <WhiteSpace size="lg" />
                <div className="sameBack my_flex">
                    <span className="textTitle">上传图片</span>
                    {teacherV.state.ARTextbookDataArr[i].picPath.length == 0 ? ""
                        :
                        <img className="imgTag" src={teacherV.state.ARTextbookDataArr[i].picPath} />
                    }
                    <button className="uploadBtn" onClick={teacherV.uploadImage.bind(this, i)}>上传图片</button>
                </div>

                <WhiteSpace size="lg" />
                <div className="sameBack my_flex">
                    <div className="textTitle">上传文件<p style={{margin:0,height:5}}></p><span className="uploadSupport">(支持视频、pdf文件)</span></div>
                    <div className="videoCont my_flex">
                        {
                            teacherV.state.ARTextbookDataArr[i].videoObj.map((v, i) => {
                                if (v.videoExtra == "pdf") {
                                    return (
                                        <div className="pdfBack fileBack">
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div>
                                            {/* <span >播放</span> */}
                                            <video onClick={teacherV.theVideoPlay.bind(this, i)} className="videoDiv" src={v.videoPath}></video>
                                            {/* <span>{v.videoName}</span> */}
                                        </div>
                                    )
                                }

                            })
                        }
                        <button className="uploadBtn" onClick={teacherV.uploadVideo.bind(this, i)}>上传视频</button>
                    </div>
                </div>
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
            videoName: []
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
    render() {
        return (
            <div id="addARTextbook" style={{ height: this.state.clientHeight }}>
                <div className="cont">
                    <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                    <div className="addCurriculum_cont">
                        <WhiteSpace size="lg" />
                        <InputItem
                            placeholder="请输入教材名称"
                            ref={el => this.labelFocusInst = el}
                            onChange={v => teacherV.setState({
                                ARTextbookValue: v
                            })}
                        ><div onClick={() => this.labelFocusInst.focus()}>AR教材</div></InputItem>
                        <WhiteSpace size="lg" />
                        <div className="my_flex sameBack">
                            <span className="textTitle">上传附件</span>
                            {
                                teacherV.state.fileNewArr.map((v, i) => {
                                    //var imgStr = "附件";
                                    // if (v.fileExtra == "pdf") {
                                    //     imgStr = "pdf 图片"
                                    // } else if (v.fileExtra == "ppt") {
                                    //     imgStr = "PPT图片"
                                    // }else if (v.fileExtra == "doc" || v.fileExtra == "docx" ) {
                                    //     imgStr = "word图片"
                                    // }else {
                                    //     imgStr = "默认图标"
                                    // }
                                    return (
                                        <div className="fileBack">
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                })
                            }
                            <button className="uploadBtn" onClick={teacherV.uploadFile}>上传附件</button>

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
