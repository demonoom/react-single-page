import React from 'react';
import {List, Toast, Button, Tabs, InputItem} from 'antd-mobile';

export default class wxTempalte extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        // navigator.mediaDevices.enumerateDevices;
        // navigator.mediaDevices.getUserMedia
        // this.getWeChatSignature();
        this.getimage();
    }


    getImage () {
        var cmr = plus.camera.getCamera();
        cmr.captureImage(function(p) {
            plus.io.resolveLocalFileSystemURL(p, function(entry) {
                compressImage(entry.toLocalURL(),entry.name);
            }, function(e) {
                plus.nativeUI.toast("读取拍照文件错误：" + e.message);
            });
        }, function(e) {
        }, {
            filter: 'image'
        });
    }

    getimage() {
        // var video = document.getElementById('video');
        // var videoObj = {
        //     "video" : true
        // };
        // var errBack = function(error) {
        //     console.log("Video capture error: ", error.code);
        // };
        // if (navigator.getUserMedia) { // Standard
        //     navigator.getUserMedia(videoObj, function(stream) {
        //         video.src = stream;
        //         video.play();
        //     }, errBack);
        // } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        //     navigator.webkitGetUserMedia(videoObj, function(stream) {
        //         video.src = window.webkitURL.createObjectURL(stream);
        //         video.play();
        //     }, errBack);
        // } else if (navigator.mozGetUserMedia) { // Firefox-prefixed
        //     navigator.mozGetUserMedia(videoObj, function(stream) {
        //         video.src = window.URL.createObjectURL(stream);
        //         video.play();
        //     }, errBack);
        // }

    }

    getWeChatSignature() {
        var param = {
            "method": 'getWeChatSignature',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result.response);
                let res = result.response;
                wx.config({
                    debug: true,
                    appId: 'wx9d076742b77044dd',
                    timestamp: res.timestamp,
                    nonceStr: res.noncestr,
                    signature: res.signature,
                    jsApiList: [
                        'checkJsApi',
                        'chooseImage',
                        'scanQRCode'
                    ]
                });
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: [
                            'chooseImage',
                            'previewImage',
                            'scanQRCode'
                        ],
                        success: function (res) {

                        }
                    });
                })
                wx.error(function (res) {
                    // Toast.info(res);
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });

            },
            onError: function (error) {

            },
        });
    }

    chooseVideo() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            }
        });
    }

    scanQRCode() {
        wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            }
        });
    }


    render() {
        return (
            <div id="wxTemplate">
                <div>测试</div>
                <Button onClick={this.chooseVideo}>调用摄像头</Button>
                <input type="file" accept="video/*" capture="camera" />
                <Button onClick={this.scanQRCode}>调用微信扫一扫</Button>
                <video style={{
                    border: '1px solid #ccc',
                    display: 'block',
                    margin: '0 0 20px 0',
                    float:'left',

                }} id="video" width="500" height="400" autoplay></video>
            </div>
        );
    }
}
