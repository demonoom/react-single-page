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
import { ECONNABORTED } from 'constants';
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
            // fileNewObj: {},  //存储附件
            picNewObj: {},  //存储照片
            videoNewObj: [], //存储视频
            initData: {},
            itemList:[]
        };
    }

    componentWillMount() {
        document.title = '修改AR教材';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var bId = locationSearch.split("&")[0].split("=")[1];
        var uId = locationSearch.split("&")[1].split("=")[1];
        this.setState({ "bId": bId,"uId":uId });
        this.viewARBook(bId);
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
     * 更新AR教材
     */
    updateARBook = () => {
        if (teacherV.state.ARTextbookValue == undefined) {
            Toast.info("请输入AR教材名称")
            return
        }
        if (teacherV.state.pageNoValue == undefined) {
            Toast.info("请输入页码")
            return
        }
        /**
         * 获取文件路径
         */
        // var filePath = teacherV.state.fileNewArr.map((v, i) => {
        //     return v.filePath
        // })
        /**
        * 获取照片路径
        */
        // var picPath = teacherV.state.picNewArr.map((v, i) => {
        //     return v.picPath
        // })
        /**
        * 获取视频路径
        */
        // var videoPath = teacherV.state.videoNewArr.map((v, i) => {
        //     return v.videoPath
        // })
        var param = {
            "method": 'updateARBook',
            "bookData": {
                "creatorId": teacherV.state.uId,
                "id":teacherV.state.bId,
                "name": teacherV.state.ARTextbookValue,
                "attachment": teacherV.state.attachment,
                "status":teacherV.state.status,
                "itemList": [
                    {
                        "index":teacherV.state.index,
                        "page": teacherV.state.pageNoValue,
                        "pic": teacherV.state.picNewObj,
                        "video": teacherV.state.videoNewObj.join(",")
                    }
                ]
            }
        }
        console.log(param);

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
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
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "viewARBook")
                if (result.msg == '调用成功' || result.success == true) {
                    teacherV.state.initData = result.response;
                    console.log(teacherV.state.initData.itemList[0].video.split(","),"video")
                    
                    teacherV.setState({
                        ARTextbookValue: teacherV.state.initData.name,
                        pageNoValue: teacherV.state.initData.itemList[0].page,
                        attachment:teacherV.state.initData.attachment,
                        status:teacherV.state.initData.status,
                        index:teacherV.state.initData.itemList[0].index,
                        videoNewObj:teacherV.state.initData.itemList[0].video.split(","),
                        picNewObj:teacherV.state.initData.itemList[0].pic,
                        itemList:teacherV.state.initData.itemList
                    })
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
        // teacherV.setState({
        //     ARTextbookValue: teacherV.state.initData[0].name,
        //     pageNoValue: teacherV.state.initData[0].itemList[0].pageNoValue,
        //     fileNewObj: {
        //         fileExtra: "pdf",
        //         filePath: "123"
        //     },
        //     videoNewObj:teacherV.state.initData[0].itemList[0].video.split(",")
        // })


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
            teacherV.setState({ attachment: newArr.filePath });
            // console.log(teacherV.state.fileNewObj, "fileNewObj")
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
            console.log(res, "asdas");
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
            newArr.picName = item[1].split("=")[1],
            teacherV.setState({ picNewObj: newArr.picPath });
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
                    videoName: item[1].split("=")[1]
                })
            })
            teacherV.state.videoNewObj = []
            var calmVideo = teacherV.state.videoNewObj.concat(pathArr);
            console.log(calmVideo,"hahahh")
            teacherV.setState({ videoNewObj: calmVideo });
        }, function (error) {
            console.log(error);
        });
    }
    render() {
        var _this = this;
        // var imgStr;
        // if (teacherV.state.initData.fileNewObj.fileExtra == "pdf") {
        //     imgStr = "pdf 图片"
        // } else if (teacherV.state.initData.fileNewObj.fileExtra == "ppt") {
        //     imgStr = "PPT图片"
        // }
        // let Attech = <div>
        //     <div>{imgStr}</div>
        //     <div>{teacherV.state.initData.fileNewObj.fileName}</div>
        // </div>
        // console.log(Attech,"atatatta")

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
                    {/* 显示附件 */}
                    {
                       <span>{teacherV.state.attachment}</span>
                    }
                    <button onClick={teacherV.uploadFile}>修改附件</button>
                    <InputItem
                        className="add_element"
                        placeholder="请输入页码"
                        value={teacherV.state.pageNoValue}
                        onChange={_this.inputOnChange}
                    ><div>页码</div></InputItem>
                    {
                        teacherV.state.itemList.map((v,i)=>{
                            
                        })
                    }
                    <div>第{teacherV.state.index}组</div>

                    {
                        <img src={teacherV.state.picNewObj} />
                    }
                    <div onClick={teacherV.uploadImage}>修改图片</div>
                    {
                        teacherV.state.videoNewObj.map((v,i)=>{
                            return (
                                <video src={v}></video>
                            )
                        })
                    }
                    <div onClick={teacherV.uploadVideo}>修改视频</div>
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
