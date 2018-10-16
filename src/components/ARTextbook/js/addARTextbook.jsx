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
            tagData: [],
            tagChangeData: [],
            searchValue: "",
            tagIndex: "",
            arrTextDiv: [],
            flag: true,
            pageNoValue:1
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
     * 去重
     * @param arr
     * @returns {*}
     */
    makeArr(arr, properties) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i][properties] == arr[j][properties]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr
    }
    /**
     * 删除标签
     */
    deleteTag(item, index) {
        teacherV.state.ARTextbookDataArr[index].tagText.forEach((v, i) => {
            if (item.id == v.id) {
                teacherV.state.ARTextbookDataArr[index].tagText.splice(i, 1)
            }
        })
        teacherV.buildARTextbook();
    }
    /**
     * 新增AR教材
     */
    addARBook = () => {
        if (teacherV.state.ARTextbookValue == undefined) {
            Toast.info("请输入AR教材名称")
            return
        }
        /*if (teacherV.state.fileNewArr.length == 0) {
            Toast.info("请上传附件")
            return
        }*/

        if (teacherV.state.ARTextbookDataArr.length == 0) {
            Toast.info("AR教材的图片和视频不能为空")
            return
        }
        if (teacherV.state.pageNoValue == "") {
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
        var arr = teacherV.state.ARTextbookDataArr;
        for (var i = 0; i < arr.length; i++) {
            var array = []
            for (var j = 0; j < arr[i].tagText.length; j++) {

                array.push(arr[i].tagText[j].id)

            }
            arr[i].tagText = array
            // newIdArr = arr[i].tagText;
        }

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
                "pic": v.picPath.join(","),
                "video": v.videoPath.join(","),
                "tagList": arr[i].tagText
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
    deleteItem = (ind, useIndex, event) => {
        event.stopPropagation()
        teacherV.state.ARTextbookDataArr[useIndex].videoPath.forEach((v, i) => {
            if (ind == i) {
                teacherV.state.ARTextbookDataArr[useIndex].videoPath.splice(i, 1)
                teacherV.state.ARTextbookDataArr[useIndex].videoObj.splice(i, 1)
                teacherV.buildARTextbook();
            }
        })

    }



    deleteImg=(ind, useIndex, event)=>{
        event.stopPropagation()
        teacherV.state.ARTextbookDataArr[useIndex].picPath.forEach((v, i) => {
            if (ind == i) {
                teacherV.state.ARTextbookDataArr[useIndex].picPath.splice(i, 1)
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
        dataObj.url = data;
        dataObj.currentUrl = data;
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
    submitTagArr() {
        $(`.calmTagDiv`).slideUp();
        $(`.tagBack`).hide();
        var newAtemprr = JSON.parse(localStorage.getItem('tagChangeData') || '[]')
        newAtemprr = newAtemprr.concat(teacherV.state.tagChangeData);
        newAtemprr = teacherV.makeArr(newAtemprr,"id")
        localStorage.setItem('tagChangeData', JSON.stringify(newAtemprr));
        teacherV.state.ARTextbookDataArr[teacherV.state.tagIndex].tagText = teacherV.state.ARTextbookDataArr[teacherV.state.tagIndex].tagText.concat(teacherV.state.tagChangeData);
        var arr = teacherV.state.ARTextbookDataArr[teacherV.state.tagIndex].tagText;
        teacherV.state.ARTextbookDataArr[teacherV.state.tagIndex].tagText = teacherV.makeArr(arr,"id")
        teacherV.buildARTextbook();
        teacherV.setState({ tagData: [], tagChangeData: [], searchValue: "" })
    }

    /**
     * 取消标签
     */
    cancelSubmit() {
        $(`.calmTagDiv`).slideUp();
        $(`.tagBack`).hide();
        teacherV.setState({ tagData: [] })
        teacherV.setState({ searchValue: '' })
    }
    /** 
     * 搜索框
     */
    searchInputChange = (value) => {
        teacherV.setState({
            searchValue: value
        })
    }

    /**
     * 添加标签
     */
    addTag(index) {
        var arr = [];
        var tempArr = JSON.parse(localStorage.getItem('tagChangeData') || '[]')
        console.log(arr)
        tempArr.forEach(function (v, i) {
            arr.push(<Tag
                selected={false}
                onChange={teacherV.tagChange.bind(this, v)}
            >{v.content}</Tag>)
        })
        teacherV.setState({ tagData: arr })
        $(`.calmTagDiv`).slideDown();
        $(`.tagBack`).show();
        teacherV.setState({
            tagIndex: index
        })

    }

    /**
     * 删除一组
     * @param {} index 
     */
    deleteGroup(index) {

        teacherV.state.ARTextbookDataArr.forEach((v, i) => {
            if (index == i) {
                teacherV.state.ARTextbookDataArr.splice(i, 1)
                teacherV.buildARTextbook();
            }
            if (teacherV.state.ARTextbookDataArr.length == 0) {

                console.log("ok")
            }
        })
    }
    /**
     * 根据数据构建,完成数据的动态绑定
     */
    buildARTextbook = () => {
        var _this = this;
        var ARTextbookArr = [];
        this.state.ARTextbookDataArr.forEach(function (v, i) {
            var useIndex = i;
            ARTextbookArr.push(<div>
                {/*<div className="cont_communal add_title font_gray">{i + 1}<span className="icon_delete icon_pointer" onClick={teacherV.deleteGroup.bind(this, useIndex)}></span></div>*/}
                {/*<div className="line_public flex_container"></div>*/}
                <div className="flex_addElement calm">
                    <span className="icon_delete icon_pointer" onClick={teacherV.deleteGroup.bind(this, useIndex)}></span>
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
                <div className="line_public flex_container"></div>
                <div className="sameBack my_flex">
                    <span className="textTitle">教材图片
                        <p style={{ margin: 0, height: 5 }}></p>
                        <span className="uploadSupport">(jpg格式)</span>
                    </span>
                    <div className="videoCont my_flex">
                    {
                        teacherV.state.ARTextbookDataArr[i].picPath.map((v,i)=>{
                            console.log(v,"picpath")
                            return (
                               <div className="fileBack picDiv">
                                    <img onClick={teacherV.imgPreview.bind(this, v)}
                                className="imgTag" src={v} />
                                  <span className="del_ar" onClick={teacherV.deleteImg.bind(this, i, useIndex)} ></span>
                               </div>
                            )
                        })
                    }
                     <button className="uploadBtn" onClick={teacherV.uploadImage.bind(this, i)}>教材图片</button>
                     </div>
                    {/* {teacherV.state.ARTextbookDataArr[i].picPath.length == 0 ?
                        <button className="uploadBtn" onClick={teacherV.uploadImage.bind(this, i)}>教材图片</button>
                        :
                        <div className="upload_file">
                            
                            <div className="icon_pointer" onClick={teacherV.uploadImage.bind(this, i)}>修改</div>
                        </div>

                    } */}

                </div>

                <div className="line_public flex_container"></div>
                <div className="sameBack my_flex">
                    <div className="textTitle">相关文件
                        <p style={{ margin: 0, height: 5 }}></p>
                        <span className="uploadSupport">(office、mp4文件)</span>
                    </div>
                    <div className="videoCont my_flex">
                        {
                            teacherV.state.ARTextbookDataArr[i].videoObj.map((v, i) => {
                                if (v.videoExtra == "pdf") {
                                    return (
                                        <div className="pdfBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            <span className="del_ar" onClick={teacherV.deleteItem.bind(this, i, useIndex)} ></span>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else if (v.videoExtra == "docx" || v.videoExtra == "doc") {
                                    return (
                                        <div className="docBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            <span className="del_ar" onClick={teacherV.deleteItem.bind(this, i, useIndex)} ></span>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else if (v.videoExtra == "xls" || v.videoExtra == "xlsx") {
                                    return (
                                        <div className="xlsBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            <span className="del_ar" onClick={teacherV.deleteItem.bind(this, i, useIndex)} ></span>
                                            {/* <div>{v.fileName}</div> */}
                                        </div>
                                    )
                                } else if (v.videoExtra == "pptx" || v.videoExtra == "ppt") {
                                    return (
                                        <div className="pptBack fileBack"
                                            onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <span className="del_ar" onClick={teacherV.deleteItem.bind(this, i, useIndex)} ></span>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="videoDiv" onClick={teacherV.videoPreview.bind(this, v.videoPath)}>
                                            {/* <span >播放</span> */}
                                            <video
                                                src={v.videoPath}></video>
                                            <span className="del_ar" onClick={teacherV.deleteItem.bind(this, i, useIndex)} ></span>
                                            {/* <span>{v.videoName}</span> */}
                                        </div>
                                    )
                                }

                            })
                        }
                        <button className="uploadBtn" onClick={teacherV.uploadVideo.bind(this, i)}>相关视频</button>
                    </div>
                </div>
                <div className="line_public flex_container"></div>
                <div className="sameBack my_flex">
                    <div className="textTitle">相关标签
                    </div>
                    <div className="videoCont">
                        {
                            v.tagText.length == 0 ?
                                ""
                                :
                                 teacherV.state.ARTextbookDataArr[useIndex].tagText.map((v, i) => {
                                    console.log(v, "cal")
                                    return (
                                        <div className="spanTag">
                                            <span className="textOver">{v.content}</span>
                                            <span className="del_tag" onClick={teacherV.deleteTag.bind(this, v, useIndex)}></span>
                                        </div>
                                    )
                                })
                        }
                        <button className="tagBtn icon_pointer" onClick={teacherV.addTag.bind(this, useIndex)}></button>
                    </div>
                </div>
            </div>)
        })
        _this.setState({ ARTextbookArr })
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
        teacherV.state.ARTextbookDataArr.push({
            pageNoValue: 1,
            picPath: [],
            picName: [],
            videoPath: [],
            videoObj: [],
            videoName: [],
            tagName: [],
            tagText: [],
            arrTextDiv: []
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
            method: 'selectImgComplex',
        };
        Bridge.callHandler(data, function (res) {
            console.log(res,"rererere")
            // 拿到照片地址,显示在页面等待上传
            var arr = res.split(',');
            let newArr = [];
            arr.forEach((v, i) => {
                let item = v.split("?");
                newArr.push({
                    picPath: item[0]+'?size=300x300',
                    picName: item[1].split("=")[1]
                })
                // teacherV.state.ARTextbookDataArr[index].picPath = newArr[i].picPath
                // teacherV.state.ARTextbookDataArr[index].picName = newArr[i].picName;
                teacherV.state.ARTextbookDataArr[index].picPath.push(newArr[i].picPath);
                teacherV.state.ARTextbookDataArr[index].picName.push(newArr[i].picName);
            })
            var calmArr = teacherV.state.picNewArr.concat(newArr);
            teacherV.setState({ picNewArr: calmArr });
            teacherV.buildARTextbook();
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传视频
     */
    uploadVideo(index) {
        // event.stopPropagation();
        var data = {
            method: 'selectComplexVideo',
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
     * 标签改变
     */
    tagChange(data, status) {
        if (status) {
            teacherV.state.tagChangeData.push(data);
        } else {
            teacherV.state.tagChangeData.forEach((v, i) => {
                if (v.id == data.id) {
                    teacherV.state.tagChangeData.splice(i, 1)
                }
            })
        }


        console.log(teacherV.state.tagChangeData,"tagChangeData")
    }
    /**
   * 搜索关键字结果
   */
    searchARBookTag() {
        if (teacherV.state.searchValue == "") {
            Toast.info("请输入搜索的关键词")
            return;
        }
        teacherV.setState({ tagData: [] }, () => {
            var param = {
                "method": 'searchARBookTag',
                "adminId": teacherV.state.uid,
                "keyword": teacherV.state.searchValue,
                "pn": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                console.log(v);
                                arr.push(<Tag
                                    selected={false}
                                    onChange={teacherV.tagChange.bind(this, v)}
                                >{v.content}</Tag>)
                            })
                            teacherV.setState({ tagData: arr })
                        }
                    } else {
                        Toast.fail(result.msg, 5);
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        })
    }

    render() {
        return (
            <div id="addARTextbook" style={{ height: this.state.clientHeight }}>
                <div className="cont">
                    <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                    <div className="addCurriculum_cont">
                        <div className="noticeMsg_common">该页面除标签项，其它项均为必填</div>
                        {/* 教材名称 */}
                        <InputItem
                            placeholder="请输入教材名称"
                            ref={el => this.labelFocusInst = el}
                            onChange={v => teacherV.setState({
                                ARTextbookValue: v
                            })}

                        >
                            <div onClick={() => this.labelFocusInst.focus()}>AR教材</div>
                        </InputItem>
                        <div className="line_public flex_container"></div>
                        <div className="my_flex sameBack firstDiv">
                            <span className="textTitle">教材附件
                                <p style={{ margin: 0, height: 5 }}></p>
                                <span className="uploadSupport">(pdf文件)</span>
                            </span>
                            {
                                teacherV.state.fileNewArr.length == 0 ?
                                    <button className="uploadBtn" onClick={teacherV.uploadFile}>教材附件</button>
                                    :
                                    <div className="upload_file">
                                        {
                                            teacherV.state.fileNewArr.map((v, i) => {
                                                return (
                                                    <div className="fileBack" onClick={teacherV.pdfPreview.bind(this, v)}>
                                                        {/* <div>{v.fileName}</div> */}
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="icon_pointer" onClick={teacherV.uploadFile}>修改</div>
                                    </div>
                            }
                        </div>
                        {/* 扫描图片 */}
                        <div className='CourseTableArea'>
                            {
                                this.state.ARTextbookArr.map((v) => {
                                    return <div className="cont">{v}</div>
                                })
                            }
                            <div onClick={this.addARTextbookTable} className='addARTextbookTable sameBack'>
                                <div className="addBtn icon_pointer">
                                    <Icon type="plus" />
                                    <span>添加扫描图片</span></div>
                            </div>
                        </div>
                        <div className="tagBack" style={{
                            display: "none",
                        }}></div>
                        {/* 添加标签 */}
                        <div className={`calmTagDiv tagCont`}
                            style={{
                                display: "none",
                            }}
                        >
                            {/* {useIndex} */}
                            <div className="tagInput">
                                <InputItem
                                    placeholder="请输入关键字"
                                    onChange={teacherV.searchInputChange}
                                    value={teacherV.state.searchValue}
                                >
                                    <div>标签名称</div>
                                </InputItem>
                                <div className="searchIcon" onClick={teacherV.searchARBookTag}></div>
                            </div>
                            <div className="classTags">
                                {
                                    teacherV.state.tagData
                                }
                            </div>
                            <div className="bottomBox">
                                <span className="close" onClick={teacherV.cancelSubmit}>取消</span>
                                <span className="bind" onClick={teacherV.submitTagArr}>确 定</span>
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
