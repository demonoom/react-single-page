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
            ARTextbookArr: [],  //AR材料结构
            ARTextbookDataArr: [],  //AR材料数据
            search_bg: false,
            clientHeight: document.body.clientHeight,
            fileNewArr: [],  //存储附件
            picNewArr: [],  //存储照片
            videoNewArr: [] //存储视频
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
        
        if(teacherV.state.picNewArr.length == 0){
            Toast.info("请上传照片")
            return
        }
        
        if(teacherV.state.videoNewArr.length == 0){
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
                "attachment": filePath
            }
        }
        var classArray = [];
        this.state.ARTextbookDataArr.forEach(function (v, i) {
            classArray.push({
                "pageNoValue": v.pageNoValue,
                "index": i + 1,
                "pic": v.picPath[0],
                "video": v.videoPath[0]
            })
        })
        param.bookData.itemList = classArray;

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
    inputOnChange = (index, value) => {
        this.setState({
            pageNoValue:value
        })
        this.state.ARTextbookDataArr[index].pageNoValue = value;
        this.buildARTextbook();
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
                <div className="flex_container my_flex flex_addElement">
                    <InputItem
                        className="add_element"
                        placeholder="请输入页码"
                        value={v.pageNoValue}
                        onChange={_this.inputOnChange.bind(this, i)}
                    ></InputItem>
                </div>
                {
                    teacherV.state.ARTextbookDataArr[i].picPath.map((v, i) => {
                        return (
                            <img src={v} />
                        )
                    })

                }
                {
                    teacherV.state.ARTextbookDataArr[i].picName.map((v, i) => {
                        return (
                            <span>{v}</span>
                        )
                    })
                }
                <div onClick={teacherV.uploadImage.bind(this, i)}>上传图片</div>
                {
                    teacherV.state.ARTextbookDataArr[i].videoPath.map((v, i) => {
                        return (
                            <video src={v}></video>
                        )
                    })
                }
                {
                    teacherV.state.ARTextbookDataArr[i].videoName.map((v, i) => {
                        return (
                            <span>{v}</span>
                        )
                    })
                }
                <div onClick={teacherV.uploadVideo.bind(this, i)}>上传视频</div>

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
                teacherV.state.ARTextbookDataArr[index].picPath.push(newArr[i].picPath);
                teacherV.state.ARTextbookDataArr[index].picName.push(newArr[i].picName);
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
                    videoName: item[1].split("=")[1]
                })
                teacherV.state.ARTextbookDataArr[index].videoPath.push(newArr[i].videoPath);
                teacherV.state.ARTextbookDataArr[index].videoName.push(newArr[i].videoName);
            })
            teacherV.setState({ videoNewArr: newArr });
            teacherV.buildARTextbook();
        }, function (error) {
            console.log(error);
        });
    }
    render() {
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
                    <div className='CourseTableArea'>
                        {
                            this.state.ARTextbookArr.map((v) => {
                                return <div>{v}</div>
                            })
                        }
                        <img onClick={this.addARTextbookTable} className='addARTextbookTable'
                            src={require('../imgs/addClassTable.png')} alt="" />
                    </div>

                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.addARBook}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
