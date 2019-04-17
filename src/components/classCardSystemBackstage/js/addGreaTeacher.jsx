import React from "react";
import {Toast, InputItem, List, TextareaItem, Button} from "antd-mobile"
import '../css/addGreaTeacher.less'

export default class addGreaTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teaName: '',
            teaNote: '',
            teaPic: '',
            teaPicSrc: '',
        }
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var schoolId = locationSearch.split("&")[0].split("=")[1];
        console.log(schoolId);
        this.setState({schoolId})
    }

    teaNameOnChange = (e) => {
        this.setState({teaName: e})
    };

    teaNoteOnChange = (e) => {
        this.setState({teaNote: e})
    };

    /**
     * 原生上传照片返回地址
     */
    uploadImgBtn = () => {
        var _this = this;
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            var src = res.split('?')[0];
            var teaPic = <img src={src} alt=""/>;
            _this.setState({teaPic, teaPicSrc: src})
        }, function (error) {
            console.log(error);
        });
    }

    /**
     *{"method":"saveTeacherStyle",
        "actionName":"sharedClassAction",
        "content":"测试侧测试",
        "teacherName":"拿铁城",
        "avatar":"2",
        "schoolId":"22222"}
     */
    saveTeacherStyle = () => {
        if (this.state.teaName.trim() === '') {
            Toast.fail('请输入教师姓名');
            return
        }
        if (this.state.teaNote.trim() === '') {
            Toast.fail('请输入教师简介');
            return
        }
        if (this.state.teaPicSrc.trim() === '') {
            Toast.fail('请上传半身照');
            return
        }
        var param = {
            "method": 'saveTeacherStyle',
            "actionName": "sharedClassAction",
            "content": this.state.teaNote,
            "teacherName": this.state.teaName,
            "avatar": this.state.teaPicSrc,
            "schoolId": this.state.schoolId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.success == true && result.msg == '调用成功') {
                    Toast.success('保存成功')
                    setTimeout(function () {
                        var data = {
                            method: 'finishForRefresh',
                        };
                        Bridge.callHandler(data, null, function (error) {
                            console.log(error);
                        });
                    }, 1000)
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    };

    render() {
        return (
            <div id='addGreaTeacher'>
                <div className="ListItem line_public">
                    <List renderHeader={() => '姓名'}>
                        <InputItem
                            placeholder='请输入教师姓名'
                            value={this.state.teaName}
                            onChange={this.teaNameOnChange}
                        />
                    </List>
                </div>
                <div className="ListItem-teacher list-textarea">
                    <List renderHeader={() => '简介'}>
                        <TextareaItem
                            rows={5}
                            count={200}
                            placeholder='请输入该教师简介'
                            value={this.state.teaNote}
                            onChange={this.teaNoteOnChange}
                        />
                    </List>
                </div>
                <div className="ListItem-teacher">
                    <List renderHeader={() => '添加照片'}>
                        <div className='uploadImgCont'>
                            {this.state.teaPic}
                        </div>
                        <img
                            className='uploadImgBtn'
                            src={require('../imgs/addPic.png')}
                            alt=""
                            onClick={this.uploadImgBtn}
                        />
                    </List>
                </div>
                <div className="submitBtn">
                    <Button type='warning' onClick={this.saveTeacherStyle}>保存</Button>
                </div>

            </div>
        )
    }
}
