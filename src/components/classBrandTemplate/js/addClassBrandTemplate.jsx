import React from 'react';
import {
    Toast,
    WhiteSpace,
    Button,
    WingBlank,
    InputItem,
    DatePicker,
} from 'antd-mobile';
import '../css/addClassBrandTemplate.less'

var addAT;

export default class addClassBrandTemplate extends React.Component {
    constructor(props) {
        super(props);
        addAT = this;
        this.state = {
            teachBuildValue: "",
            skinClassName:"",
            cols: 1,
            search_bg: false,
            clientHeight: document.body.clientHeight,
            imgPath:""
        };
    }

    componentWillMount() {
        document.title = '皮肤添加管理';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ uid });
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount() {
        Bridge.setShareAble("false");
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindwoResize);
    }

    /**
     * 监听窗口改变时间
     */
    onWindwoResize() {
        setTimeout(() => {
            addAT.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }
     /**
     * 上传照片
     * uploadImages
     */
    uploadImage() {
        var phoneType = navigator.userAgent;
        var phone;
        var data;
        
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else if(phoneType.indexOf('Android') > -1 ) {
            phone = 'android'
        }else {
            phone = ""
        }
        if (phone == 'ios' || phone == 'android'){
            data = {
                method: 'uploadClassDemeanor',
            };
        }else {
            data = {
                method: 'selectImages',
            };
        }
       
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            var imgPath = res.split("?");
            var usePath = imgPath[0];
            addAT.setState({
                imgPath:usePath
            })
            console.log(res,"sddsds")
        }, function (error) {
            console.log(error);
        });
    }
    /**
     * 提交
     */
    subAttendanceTime = () => {
        if (addAT.state.teachBuildValue == "") {
            Toast.info("皮肤名称不能为空")
            return
        }

        if (addAT.state.skinClassName == "") {
            Toast.info("皮肤类名不能为空")
            return
        }
       
        var param = {
            "method": 'addBraceletBoxSkin',
            "skinName":addAT.state.teachBuildValue,
            "skinAttr":addAT.state.skinClassName,
            "image":addAT.state.imgPath
        }
        console.log(param)
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

    render() {
        return (
            <div id="addClassBrandTemplate" style={{ height: this.state.clientHeight }}>
                <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                <div className="addCurriculum_cont">
                    <WhiteSpace size="lg" />
                    <div className='teachBuild'>
                        <InputItem
                            placeholder="请输入名称"
                            data-seed="logId"
                            onChange={v => {
                                addAT.setState({
                                    "teachBuildValue": v
                                })
                            }}
                            value={this.state.teachBuildValue}
                        >皮肤名称<i className='redStar'>*</i></InputItem>
                    </div>
                    <WhiteSpace size="lg" />
                    <div className='teachBuild'>
                        <InputItem
                            placeholder="请输入类名"
                            data-seed="logId"
                            onChange={v => {
                                addAT.setState({
                                    "skinClassName": v
                                })
                            }}
                            value={this.state.skinClassName}
                        >皮肤类名<i className='redStar'>*</i></InputItem>
                    </div>
                    <WhiteSpace size="lg" />
                    <div className="uploadDiv">
                        <div className="title">上传图片</div>
                        <div className="my_flex photoCont">
                            {
                                addAT.state.imgPath == "" ?  "" :<div className="imgDiv"><img src={addAT.state.imgPath}/></div>
                            }
                            {/* {<img src={addAT.state.imgPath} />} */}
                            <div className="uploadBtn" onClick={this.uploadImage}></div>
                        </div>
                    </div>

                </div>
                <Button type="warning" className="submitBtn" onClick={this.subAttendanceTime}>提交</Button>
            </div>
        );
    }
}
