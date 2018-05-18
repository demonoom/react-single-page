import React from 'react';
import {Picker, List, WhiteSpace, WingBlank, Button, Toast} from 'antd-mobile';
import '../css/classDemeanor.less'

var demeanor;

export default class classDemeanor extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            data: [],
            asyncValue: [],
            imgFromAndArr: [],
            imgArr: [],
        };
    }

    componentDidMount() {
        document.title = '班级风采';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("&")[0].split('=')[1];
        this.getClazzesByUserId(ident)
    }

    /**
     * 获取此用户所在班级
     */
    getClazzesByUserId(ident) {
        var _this = this;
        var param = {
            "method": 'getClazzesByUserId',
            "userId": ident
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        var arr = []
                        result.response.forEach(function (v, i) {
                            arr.push({
                                value: v.id, label: v.name
                            })
                        })
                        _this.setState({data: arr})
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 班级切换的回调
     * @param val
     */
    onPickerChange = (val) => {
        const d = [...this.state.data];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
        });
    };

    chooseClassOnOk(v) {
        this.setState({asyncValue: v})
        this.getClassDemeanorInfo(v[0])
    }

    getClassDemeanorInfo(id) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": id
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    demeanor.setState({imgArr: result.response});
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
            method: 'uploadClassDemeanor',
        };

        Bridge.callHandler(data, function (res) {
            //拿到图片地址,显示在页面等待上传
            var arr = res.split(',');
            demeanor.setState({imgFromAndArr: arr});
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 本地上传照片
     */
    uploadImg = () => {
        if (demeanor.state.imgFromAndArr.length == 0) {
            Toast.fail('请先选择照片')
            return
        }
        if (WebServiceUtil.isEmpty(demeanor.state.asyncValue)) {
            Toast.fail('请先选择班级')
            return
        }
        demeanor.state.imgFromAndArr.forEach(function (v, i) {
            var param = {
                "method": 'saveClassDemeanorInfo',
                "clazzId": demeanor.state.asyncValue[0],
                "imagePath": v,
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (i == demeanor.state.imgFromAndArr.length - 1) {
                            Toast.success('上传成功');
                            //刷新上半部
                            demeanor.getClassDemeanorInfo(demeanor.state.asyncValue[0])
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

    deleteClassDemeanorInfo(id) {
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
                    demeanor.setState({imgArr: arr})
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    deleteimgFromAndArr(index) {
        var arr = demeanor.state.imgFromAndArr;
        demeanor.state.imgFromAndArr.forEach((v, i) => {
            if (i == index) {
                arr.splice(i, 1);
            }
        })
        demeanor.setState({imgFromAndArr: arr})
    }

    render() {
        console.log(demeanor.state.imgArr);
        return (
            <div id="classDemeanor" style={{height: document.body.clientHeight}}>
                <div className="Img_cont">
                    <WhiteSpace size="lg"/>
                    {/*日期*/}
                    <Picker
                        data={this.state.data}
                        cols={1}
                        value={this.state.asyncValue}
                        onPickerChange={this.onPickerChange}
                        onOk={v => this.chooseClassOnOk(v)}
                    >
                        <List.Item arrow="horizontal">班级</List.Item>
                    </Picker>
                    <WhiteSpace size="lg"/>
                    <div className="classDemeanor_title">风采展示</div>
                    <div className='showImg my_flex my_flex_wrap'>
                        {this.state.imgArr.map((v) => {
                            return <div className="listImg flex_center">
                                <img className='uploadImgBtn' src={v.imagePath} alt=""/>
                                <img onClick={this.deleteClassDemeanorInfo.bind(this, v.id)} className='delImgBtn'
                                     src={require('../imgs/delPic.png')} alt=""/>
                            </div>
                        })}
                    </div>
                    <WhiteSpace size="lg"/>
                    <div className="classDemeanor_title">上传照片</div>
                    <div className='uploadImg my_flex my_flex_wrap'>
                        {this.state.imgFromAndArr.map((v, i) => {
                            return <div className="listImg flex_center">
                                <img className='uploadImgBtn' src={v} alt=""/>
                                <img onClick={this.deleteimgFromAndArr.bind(this, i)} className='delImgBtn'
                                     src={require('../imgs/delPic.png')} alt=""/>
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
                    <WhiteSpace size="lg"/>
                    <WingBlank>
                        <Button type="warning" onClick={this.uploadImg}>上传</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}