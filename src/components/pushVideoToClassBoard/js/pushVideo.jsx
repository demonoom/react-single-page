import React from 'react';
import { SimpleWebsocketConnection } from '../../../helpers/simple_websocket_connection'
var calm;
window.simpleMS = null;



export default class pushVideo extends React.Component {

    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            videoArr: [],
        }
    }

    componentWillMount() {
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var schoolId = locationSearch.split("&")[0].split("=")[1];
        calm.setState({
            schoolId:schoolId
        })
        this.simpleListener()
    }

    /**
     * 消息监听
     */
    simpleListener() {
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: function (info) {
                console.log(info)
            }
        };
    }

    addVideo = () => {
        console.log("dianjile")
        var data = {
            method: 'selectOnlyVideo',
        };
        Bridge.callHandler(data, function (res) {
            console.log(res, "res")
            //拿到视频地址,显示在页面等待上传
            var arr = res.split(',');
            console.log(arr, "pathArr")
            let newArr = [];
            let pathArr = [];
            arr.forEach((v, i) => {
                let item = v.split("?");
                pathArr.push(item[0])
                newArr.push({
                    videoPath: item[0],
                    videoName: item[1].split("=")[1],
                    videoExtra: (item[1].split("=")[1]).split(".")[1],
                    pushValue: "推送"
                })
            })
            console.log(newArr, "newArr")
            calm.setState({
                videoArr: newArr
            })
        }, function (error) {
            console.log(error);
        });
    }
    previewVideo = (src) => {
        //视频预览
        var data = {
            method: 'playVideo',
            url: src
        };
        Bridge.callHandler(data, null, function (error) {

        });
    }
    pushVideoToClassboard = (value, index, videoPath) => {
        console.log(videoPath,"videoPath")
        console.log(index,"index")
        if (value == "推送") {
            calm.state.videoArr[index].pushValue = "停止"
            calm.setState({
                videoArr: calm.state.videoArr
            })
            var obj = {
                "command": "playPushVideo",
                "data": {
                    "videoPath": videoPath,
                    "schoolId":calm.state.schoolId
                }
            }
            simpleMS.send(obj)

        }
        if (value == "停止") {
            calm.state.videoArr[index].pushValue = "推送"
            calm.setState({
                videoArr: calm.state.videoArr
            })
            var obj = {
                "command": "stopPushVideo",
                "data": {
                    "videoPath": videoPath,
                    "schoolId":calm.state.schoolId
                }
            }
            simpleMS.send(obj)
        }
    }
    showBtnBox=(index)=>{
        if ($('.btnBox').eq(index).css("display") == "none") {
            $(".btnBox").css({
                display: 'none'
            })
            $('.btnBox').eq(index).css({
                display: 'block'
            })

        } else {
            $('.btnBox').eq(index).css({
                display: 'none'
            })
            // $(".btnBox").eq(index + 1).find(".noticeContent").css({
            //     display: 'block'
            // })
        }
    }
    render() {
        // console.log(this.state.videoArr, "videoArr")
        // calm.state.videoArr = [
        //     {
        //         videoName:"1",
        //         videoPath:"url1",
        //         pushValue:"推送"
        //     },
        //     {
        //         videoName:"2",
        //         videoPath:"url2",
        //         pushValue:"推送"
        //     },
        // ]
        return (
            <div id="pushVideo">
                {
                    calm.state.videoArr.map((v, i) => {
                        return (
                            <div>
                                <div><span>{v.videoName}</span><span onClick={calm.showBtnBox.bind(this,i)}>上箭头</span></div>
                                <div className="btnBox" style={{display:"none"}}>
                                    <span onClick={calm.previewVideo.bind(this, v.videoPath)}>预览</span>
                                    <span onClick={calm.pushVideoToClassboard.bind(this, v.pushValue, i, v.videoPath)}>{v.pushValue}</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        )
                    })
                }
                <button onClick={this.addVideo}>添加</button>
            </div>
        );
    }
}
