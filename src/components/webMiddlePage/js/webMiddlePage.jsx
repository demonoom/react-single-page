import React from 'react';
import '../css/webMiddlePage.less'

export default class webMiddlePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
        };
    }

    componentDidMount() {
        document.title = '文件展示';
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        var type = searchArray[1].split('=')[1];
        this.Courseware(id, type)
    }

    Courseware(id, type) {
        var _this = this;
        var param = {
            "method": 'getCoursewareById',
            "sourceId": id,
            "sourceType": type,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var res = result.response;
                    console.log(res);
                    _this.buildContent(res)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    buildContent(res) {
        var img;
        var btn = <div className='noom_btn' onClick={this.lookUpFile(res.path, res.type)}>查看</div>;
        if (res.type == 1) {
            //PDF
            img = <img className='noom_img' src={require('../imgs/pdf.png')} alt=""/>
        } else if (res.type == 31) {
            //DOC
            img = <img className='noom_img' src={require('../imgs/word.png')} alt=""/>
        } else if (res.type == 33) {
            //PPT
            img = <img className='noom_img' src={require('../imgs/ppt.png')} alt=""/>
        } else if (res.type == 5) {
            //IMG
            img = <img className='noom_img' src={require('../imgs/pic.png')} alt=""/>
        } else if (res.type == 7) {
            //V
            img = <img className='noom_img' src={require('../imgs/mp3.png')} alt=""/>
        } else if (res.type == 9) {
            //A
            img = <img className='noom_img' src={require('../imgs/mp4.png')} alt=""/>
        } else if (res.type == -11) {
            //UNKNOW_FILE
            img = <img className='noom_img' src={require('../imgs/other.png')} alt=""/>
            btn = <span className="noom_btn_text">暂不支持查看</span>
        }
        var content = <div className='content_noom'>
            {img}
            <div className='noom_title'>{res.title}</div>
            <div className='noom_userName'>上传者：{res.user.userName}</div>
            <div
                className='noom_createTime'>
                上传时间：{WebServiceUtil.formatYMD(res.createTime) + ' ' + WebServiceUtil.formatHM(res.createTime)}</div>
            {btn}
        </div>
        this.setState({content});
    }

    lookUpFile(src, type) {
        return () => {
            if (type == 5) {
                //图片
                var imgsObj = {};
                imgsObj.method = 'showImage';
                imgsObj.url = src;
                imgsObj.currentUrl = src.split('#')[0];
                Bridge.callHandler(imgsObj, null, function (error) {
                    console.log(error);
                })

            } else {
                var htmlObj = {
                    src: src,
                    type: type
                }
                localStorage.setItem("previewFile", JSON.stringify(htmlObj)); //将分享人的相关信息存储在每一页中进行渲染
                //进入预览页
                var url = WebServiceUtil.mobileServiceURL + "previewFile";
                var data = {
                    method: 'openNewPage',
                    url: url
                };
                Bridge.callHandler(data, null, function (error) {
                    window.location.href = url;
                });
            }
        }
    }

    render() {

        return (
            <div id="webMiddlePage" style={{height: document.body.clientHeight}}>
                {this.state.content}
            </div>
        );
    }
}
