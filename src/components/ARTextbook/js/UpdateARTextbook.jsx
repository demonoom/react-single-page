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
import "../css/UpdateARTextbook.less"
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
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var bId = locationSearch.split("&")[0].split("=")[1];
        var uId = locationSearch.split("&")[1].split("=")[1];
        var getIndex = locationSearch.split("&")[2].split("=")[1];
        this.setState({ "bId": bId,"uId":uId,"getIndex":getIndex });
        console.log(getIndex,"index");
        console.log(uId,"uId");
        this.viewARBook(bId,getIndex);
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount() {
        var index = Number(this.state.getIndex)+1
        document.title = '修改AR教材第'+index+"组数据";

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
        console.log(teacherV.state.itemList,"ghjk");
        var arr = teacherV.state.itemList;
        for(var k in arr){
            console.log(teacherV.state.getIndex,"eeee")
            if(k == teacherV.state.getIndex){
                console.log(arr[k],"cccc")
                arr[k].index = k;
                arr[k].page = teacherV.state.pageNoValue;
                arr[k].pic = teacherV.state.picNewObj;
                arr[k].video = teacherV.state.videoNewObj.join(",")
            }
        }
        var param = {
            "method": 'updateARBook',
            "bookData": {
                "creatorId": teacherV.state.uId,
                "id":teacherV.state.bId,
                "name": teacherV.state.ARTextbookValue,
                "attachment": teacherV.state.attachment,
                "status":teacherV.state.status,
                "itemList": arr
            }
        }
        console.log(param);

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result,"rerererre")
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
    viewARBook(bId,index) {

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
                    // console.log(teacherV.state.initData.itemList[0].video.split(","),"video")
                    
                    teacherV.setState({
                        ARTextbookValue: teacherV.state.initData.name,
                        pageNoValue: teacherV.state.initData.itemList[index].page,
                        attachment:teacherV.state.initData.attachment,
                        status:teacherV.state.initData.status,
                        index:teacherV.state.initData.itemList[index].index,
                        videoNewObj:teacherV.state.initData.itemList[index].video.split(","),
                        picNewObj:teacherV.state.initData.itemList[index].pic,
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

    /**
     *播放视频 
     */
    theVideoPlay(i) {
        // console.log("dianji", i)
        var videoDiv = $(".videoDiv")
        videoDiv[i].play();
      
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
            <div id="UpdateARTextbook" style={{ height: this.state.clientHeight }}>
                <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                <div className="addCurriculum_cont">
                    <InputItem
                        placeholder="请输入教材名称"
                        ref={el => this.labelFocusInst = el}
                        onChange={v => teacherV.setState({
                            ARTextbookValue: v
                        })}
                        value={_this.state.ARTextbookValue}
                    ><div onClick={() => this.labelFocusInst.focus()}>AR教材</div></InputItem>
                    <InputItem
                        className="add_element"
                        placeholder="请输入页码"
                        value={teacherV.state.pageNoValue}
                        onChange={_this.inputOnChange}
                    ><div>页码</div></InputItem>
                    <div className="am-list-item item_list20"
                    >
                        <div className="am-input-label am-input-label-5">附件</div>
                        <div className="div68"><button className="uploadAttech i_uploadAttech upload_file" onClick={teacherV.uploadFile}><div>修改</div></button></div>
                    </div>
                    {/* 显示附件 */}
                    {
                        //    <div>附件地址：{teacherV.state.attachment}</div>
                        <div></div>
                    }


                    {
                        teacherV.state.itemList.map((v,i)=>{

                        })
                    }
                    {/* <div className="mt3PX">第{Number(teacherV.state.getIndex)+1}组数据</div> */}

                    <div className="am-list-item item_list20"
                    >
                        <div className="am-input-label am-input-label-5">图片</div>
                        <div className="div68"><button className="uploadAttech i_uploadAttech"  onClick={teacherV.uploadImage}>{
                            <img className="imgDiv" src={teacherV.state.picNewObj} />
                        }<div>修改</div></button></div>
                    </div>

                    {
                        teacherV.state.videoNewObj.map((v,i)=>{
                            return (
                            <div className="am-list-item item_list20" >
                                <div className="am-input-label am-input-label-5">视频</div>
                                <div className="div68">
                                     <div className="uploadAttech i_uploadAttech">
                                         <video onClick={_this.theVideoPlay.bind(this, i)} className="videoDiv" src={v}></video>
                                         <div onClick={teacherV.uploadVideo}>修改</div>
                                     </div>
                                     {/* <span >播放</span> */}
                                </div>
                            </div>
                               
                            )
                        })
                    }

                </div>
                <div className='submitBtn'>
                        <Button type="warning" onClick={this.updateARBook}>提交</Button>
                </div>
            </div>
        );
    }
}
