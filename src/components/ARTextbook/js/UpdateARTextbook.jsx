import React from 'react';
import {
    Toast,
    Picker,
    List,
    WhiteSpace,
    Button,
    WingBlank,
    InputItem,
    DatePicker,
    TextareaItem,
    Radio
} from 'antd-mobile';
import "../../classCardSystemBackstage/css/classDemeanor.less"
// import '../css/addCurriculumSchedule.less'

var teacherV;

const RadioItem = Radio.RadioItem;
export default class addARTextbook extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            search_bg: false,
            clientHeight: document.body.clientHeight,
            fileNewArr: [],  //存储附件
            picNewArr: [],  //存储照片
            videoNewArr: [], //存储视频
            initData: [{
                "creatorId": "123123",
                "id": 111,
                "name": "123",
                "attachment": "http://60.205.86.217/upload8/2018-06-27/17/5133bd02-fa57-4ba4-8114-a04e19b25af8.pdf",
                "itemList": [
                    {
                        "index": 1,
                        "pageNoValue": 32,
                        "pic": "http://60.205.86.217/upload8/2018-06-27/17/03dbfe20-9204-4d6e-a180-1a223c21c36b.png",
                        "video": "http://60.205.86.217/upload8/2018-06-27/17/e26480d0-3b86-45fb-854f-57c8a5141fbf.mp4"
                    }
                ]

            }]
        };
    }

    componentWillMount() {
        document.title = '修改AR教材';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount() {
        Bridge.setShareAble("false");
        
        this.viewARBook();
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
        if (teacherV.state.ARTextbookValue == undefined) {
            Toast.info("请输入AR教材名称")
            return
        }
        if (teacherV.state.fileNewArr.length == 0) {
            Toast.info("请上传附件")
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
        /**
        * 获取照片路径
        */
        var picPath = teacherV.state.picNewArr.map((v, i) => {
            return v.picPath
        })
        /**
        * 获取视频路径
        */
        var videoPath = teacherV.state.videoNewArr.map((v, i) => {
            return v.videoPath
        })
        var param = {
            "method": 'updateARBook',
            "bookData": {
                "creatorId": teacherV.state.uid,
                "name": teacherV.state.ARTextbookValue,
                "attachment": filePath,
                "itemList": {
                    "pageNoValue": teacherV.state.pageNoValue,
                    "pic": picPath,
                    "video": videoPath
                }
            }
        }
        console.log(param);
        return

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
    viewARBook() {
        teacherV.state.ARTextbookValue = teacherV.state.initData[0].name
        console.log(teacherV.state.initData[0   ].name)
        teacherV.state.fileNewArr.filePath = teacherV.state.initData[0].attachment
        teacherV.state.pageNoValue = teacherV.state.initData[0].itemList[0].pageNoValue

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
    uploadImage() {
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
            })
            teacherV.setState({ picNewArr: newArr });
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
            arr.forEach((v, i) => {
                let item = v.split("?");
                newArr.push({
                    videoPath: item[0],
                    videoName: item[1].split("=")[1]
                })
            })
            teacherV.setState({ videoNewArr: newArr });
        }, function (error) {
            console.log(error);
        });
    }
    render() {
        var _this = this;
        return (
            <div id="addCurriculumSchedule" style={{ height: this.state.clientHeight }}>
                <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                <div className="addCurriculum_cont">
                    <WhiteSpace size="lg" />
                    <InputItem
                        placeholder="请输入教材名称"
                        ref={el => this.labelFocusInst = el}
                        onChange={v => teacherV.setState({
                            ARTextbookValue: v
                        })}
                        value={_this.state.ARTextbookValue}
                    ><div onClick={() => this.labelFocusInst.focus()}>AR教材</div></InputItem>
                    <button onClick={teacherV.uploadFile}>上传附件</button>
                    {
                        teacherV.state.fileNewArr.map((v, i) => {
                            console.log("hahahhahahahha", v)
                            var imgStr;
                            if (v.fileExtra == "pdf") {
                                imgStr = "pdf 图片"
                            } else if (v.fileExtra == "ppt") {
                                imgStr = "PPT图片"
                            }
                            return (
                                <div>
                                    <div>{imgStr}</div>
                                    <div>{v.fileName}</div>
                                </div>
                            )
                        })
                    }
                    <InputItem
                        className="add_element"
                        placeholder="请输入页码"
                        value={teacherV.state.pageNoValue}
                        onChange={_this.inputOnChange}
                    ></InputItem>
                    {
                        teacherV.state.picNewArr.map((v, i) => {
                            console.log("ahahhaha", v)
                            return (
                                <div>
                                    <img src={v.picPath} />
                                    <span>{v.picName}</span>
                                </div>
                            )
                        })

                    }
                    <div onClick={teacherV.uploadImage}>上传图片</div>
                    {
                        teacherV.state.videoNewArr.map((v, i) => {
                            console.log("ahahhaha", v)
                            return (
                                <div>
                                    <video src={v.videoPath} ></video>
                                    <span>{v.videoName}</span>
                                </div>
                            )
                        })

                    }
                    <div onClick={teacherV.uploadVideo}>上传视频</div>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.updateARBook}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
