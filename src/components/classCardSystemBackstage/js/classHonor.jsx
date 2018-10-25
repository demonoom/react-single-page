import React from 'react';
import { Picker, List, WhiteSpace, WingBlank, Button, Toast, Modal } from 'antd-mobile';
import '../css/classDemeanor.less'

var demeanor;
const alert = Modal.alert;

export default class classHonor extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            data: [],
            // asyncValue: [],
            imgFromAndArr: [],
            imgArr: [],
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("&")[0].split('=')[1];
        var className = locationSearch.split("&")[1].split('=')[1];
        // this.getClazzesByUserId(ident)
        // console.log(ident);
        // console.log(className);
        // this.setState({className});
        document.title = className;
        this.setState({ classId: ident });
        this.getClassDemeanorInfo(ident);
    }

    getClassDemeanorInfo(id) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": id,
            "type": 2
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "re")
                if (result.msg == '调用成功' || result.success == true) {
                    demeanor.setState({ imgArr: result.response });
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 原生上传照片返回地址
     */
    uploadImgBtn() {
        var data = {
            method: 'selectImgAndVideo',
        };
        Bridge.callHandler(data, function (res) {
            //拿到图片地址,显示在页面等待上传
            var arr = res.split(',');
            demeanor.setState({ imgFromAndArr: demeanor.state.imgFromAndArr.concat(arr) });
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 本地上传照片
     */
    uploadImg = () => {
        if (demeanor.state.imgFromAndArr.length == 0) {
            Toast.fail('请先选择照片', 2)
            return
        }
        // if (WebServiceUtil.isEmpty(demeanor.state.asyncValue)) {
        //     Toast.fail('请先选择班级')
        //     return
        // }
        demeanor.state.imgFromAndArr.forEach(function (v, i) {
            var param = {
                "method": 'saveClassDemeanorInfo',
                "clazzId": demeanor.state.classId,
                "imagePath": v,
                "type": 2
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (i == demeanor.state.imgFromAndArr.length - 1) {
                            Toast.success('上传成功');
                            //刷新上半部
                            demeanor.getClassDemeanorInfo(demeanor.state.classId)
                            demeanor.state.imgFromAndArr.splice(0)
                        }
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        })
    }


    showAlert = (success, cancel) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        const alertInstance = alert('确定删除吗?', '', [
            {
                text: '取消', onPress: () => {
                    if (cancel) {
                        cancel();
                    }
                }, style: 'default'
            },
            {
                text: '确定', onPress: () => {
                    if (success) {
                        success()
                    }
                }
            },
        ], phone);
    }

    deleteClassDemeanorInfo(id) {
        this.showAlert(function () {    //成功回调
            var param = {
                "method": 'deleteClassDemeanorInfo',
                "id": id,
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        var arr = demeanor.state.imgArr
                        demeanor.state.imgArr.forEach((v, i) => {
                            if (v.id == id) {
                                arr.splice(i, 1);
                            }
                        })
                        demeanor.setState({ imgArr: arr })
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });

        }, function () {                 //取消回调
            // console.log('已取消');
        });

    }

    deleteimgFromAndArr(index) {
        var arr = demeanor.state.imgFromAndArr;
        demeanor.state.imgFromAndArr.forEach((v, i) => {
            if (i == index) {
                arr.splice(i, 1);
            }
        })
        demeanor.setState({ imgFromAndArr: arr })
    }

    render() {
        return (
            <div id="classDemeanor" style={{ height: document.body.clientHeight }}>
                <div className="Img_cont">
                    <div className="classDemeanor_title">荣誉展示</div>
                    <div className='showImg my_flex my_flex_wrap'>
                        {this.state.imgArr.map((v) => {
                            console.log(v, "calmc")
                            var arr = v.imagePath.split('?');
                            var extra = arr[0].split('.');
                            return <div className="listImg flex_center">
                                {
                                    extra[extra.length - 1] == "mp4" ? <video style={{ width: "100%",height:"100%" }} src={v.imagePath}></video> : <img className='uploadImgBtn' src={v.imagePath} alt="" />
                                }

                                <img onClick={this.deleteClassDemeanorInfo.bind(this, v.id)} className='delImgBtn'
                                    src={require('../imgs/delPic.png')} alt="" />
                            </div>
                        })}
                    </div>
                    <WhiteSpace size="lg" />
                    <div className="classDemeanor_title">上传资源</div>
                    <div className='uploadImg my_flex my_flex_wrap'>
                        {this.state.imgFromAndArr.map((v, i) => {
                            console.log(v, "vvvv")
                            var arr = v.split('?');
                            var extra = arr[0].split('.');
                            console.log(extra[extra.length - 1], "arr")
                            return <div className="listImg flex_center">
                                {
                                    extra[extra.length - 1] == "jpg" ? <img className='uploadImgBtn' src={v} alt="" /> :
                                        extra[extra.length - 1] == "mp4" ? <video style={{ width: "100%",height:"100%" }} src={v}></video> : 
                                        extra[extra.length - 1] == "JPG" ? <img className='uploadImgBtn' src={v} alt="" /> : ""
                                }
                                <img onClick={this.deleteimgFromAndArr.bind(this, i)} className='delImgBtn'
                                    src={require('../imgs/delPic.png')} alt="" />
                            </div>
                        })}
                        <img
                            className='uploadImgBtn'
                            src={require('../imgs/addPic.png')}
                            alt=""
                            onClick={this.uploadImgBtn}
                        />
                    </div>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.uploadImg}>上传</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
