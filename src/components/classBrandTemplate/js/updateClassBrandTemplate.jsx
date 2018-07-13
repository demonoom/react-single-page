import React from 'react';
import {
    Toast,
    WhiteSpace,
    Button,
    WingBlank,
    InputItem,
} from 'antd-mobile';

var UpdateAT;

export default class updateClassBrandTemplate extends React.Component {
    constructor(props) {
        super(props);
        UpdateAT = this;
        this.state = {
            teachBuildValue: "",
            skinClassName: "",
            cols: 1,
            initData: [],
            search_bg: false,
            clientHeight: document.body.clientHeight,
        };
    }

    componentWillMount() {
        document.title = '皮肤编辑管理';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var skinId = locationSearch.split("&")[1].split("=")[1];
        this.setState({ uid, "skinId": skinId });
        this.getBraceletBoxSkinById(skinId);
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
            UpdateAT.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }

    /**
     * 数据回显
     * id  皮肤ID
     */
    getBraceletBoxSkinById = (skinId) => {
        var param = {
            "method": "getBraceletBoxSkinById",
            "id": skinId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "shuju")
                if (result.msg == '调用成功' || result.success == true) {
                    UpdateAT.setState({
                        initData: result.response,
                        teachBuildValue: result.response.skinName,
                        skinClassName: result.response.skinAttr,
                        imgPath: result.response.image
                    })
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
     * 更新提交
     */
    updateBraceletBoxSkinStatusInfo = () => {
        var _this = this;
        if (UpdateAT.state.teachBuildValue == "" || UpdateAT.state.teachBuildValue == undefined) {
            Toast.info("皮肤名称不能为空")
        }
        if (UpdateAT.state.skinClassName == "" || UpdateAT.state.skinClassName == undefined) {
            Toast.info("皮肤类名不能为空")
        }
        var param = {
            "method": 'updateBraceletBoxSkinStatusInfo',
            "id": _this.state.skinId,
            "skinName": UpdateAT.state.teachBuildValue,
            "skinAttr": UpdateAT.state.skinClassName,
            "image": UpdateAT.state.imgPath
        }
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
             * 上传照片
             */
    uploadImage() {
        var phoneType = navigator.userAgent;
        var phone;
        var data;
        
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else if(!(phoneType.indexOf('iPhone') > -1) || !(phoneType.indexOf('iPad') > -1)) {
            phone = 'android'
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
            UpdateAT.setState({
                imgPath: usePath
            })
            console.log(res, "sddsds")
        }, function (error) {
            console.log(error);
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
                                UpdateAT.setState({
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
                                UpdateAT.setState({
                                    "skinClassName": v
                                })
                            }}
                            value={this.state.skinClassName}
                        >皮肤类名<i className='redStar'>*</i></InputItem>
                    </div>
                    <WhiteSpace size="lg" />
                    <div className="modifyDiv my_flex">
                        <div className="imgDiv">
                            {
                                <img src={this.state.imgPath} alt="" />
                            }
                        </div>
                        <div className="modifyBtn" onClick={this.uploadImage}>修改图片</div>
                    </div>

                </div>
                <div className='addCourseButton'>
                    <Button type="warning" className="submitBtn" onClick={this.updateBraceletBoxSkinStatusInfo}>提交</Button>
                </div>

            </div>
        );
    }
}
