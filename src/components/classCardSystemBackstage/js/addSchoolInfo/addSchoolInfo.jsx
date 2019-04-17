import React from 'react';
import {
    TextareaItem, List, Toast, Button
} from 'antd-mobile';
import "./addSchoolInfo.less"
var teacherV;
export default class addSchoolInfo extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            schoolInfo: ""
        };
    }
    componentDidMount () {
        Bridge.setShareAble("false");
    }
    componentWillMount () {
        document.title = '添加学校简介';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var schoolId = locationSearch.split("&")[0].split('=')[1];
        this.setState({ schoolId })
        window.addEventListener('resize', this.onWindwoResize);
        this.getSchoolById(schoolId)

    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onWindwoResize);
    }

    //监听窗口改变时间
    onWindwoResize () {
        setTimeout(() => {
            teacherV.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }

    /**
      * 获取校园简介
      */
    getSchoolById = (schoolId) => {
        var param = {
            "method": 'getSchoolById',
            "id": schoolId,
            "actionName": "sharedClassAction",
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, "result")
                if (result.msg == '调用成功') {
                    if (result.response.synopsis) {
                        this.setState({
                            schoolInfo: result.response.synopsis
                        })
                    } else {
                        this.setState({
                            schoolInfo: ""
                        })
                    }
                    if (result.response.avatar) {
                        var teaPic = <img src={result.response.avatar} alt="" />;
                        _this.setState({ teaPic, teaPicSrc: result.response.avatar })
                    } else {
                        this.setState({
                            teaPic: "",
                            teaPicSrc:""
                        })
                    }
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }

    /**
     * 简介变化
     */
    textareaOnChange = (value) => {
        this.setState({
            schoolInfo: value
        })
    }

    //保存学校简介
    toSaveSchoolInfo = () => {
        var param = {
            "method": 'updateSchool',
            "id": this.state.schoolId,
            "content": this.state.schoolInfo,
            "actionName": "sharedClassAction",
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                console.log(result, "result")
                if (result.msg == '调用成功') {
                    Toast.info("保存成功",1);
                    var data = {
                        method: 'finish',
                    };
            
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }

    /**
    * 原生上传照片返回地址
    */
    uploadImgBtn = () => {
        var _this = this;
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            console.log(res.split("?"), "res")
            var teaPic = <img src={res} alt="" />;
            _this.setState({ teaPic, teaPicSrc: res })
        }, function (error) {
            console.log(error);
        });
    }


    render () {
        return (
            <div id="addSchoolInfo">
                <div className="school-info">
                    <List renderHeader={() => '学校简介'}>
                        <TextareaItem
                            placeholder="请输入学校简介"
                            value={this.state.schoolInfo}
                            labelNumber={5}
                            onChange={this.textareaOnChange.bind(this)}
                            count={10000}
                            rows={9}
                        />
                    </List>
                </div>
                <div className="ListItem-teacher">
                    <List renderHeader={() => '添加校徽'}>
                        <div className='uploadImgCont'>
                            {this.state.teaPic}
                        </div>
                        <img
                            className='uploadImgBtn'
                            src={require('../../imgs/addPic.png')}
                            alt=""
                            onClick={this.uploadImgBtn}
                        />
                    </List>
                </div>
                <div className='submitBtn'>
                    <Button type="warning" onClick={this.toSaveSchoolInfo}>提交</Button>
                </div>

            </div>
        );
    }
}
