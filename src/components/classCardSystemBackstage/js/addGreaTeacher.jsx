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
        var teaPic = <img className='uploadImgBtn'
                          src='http://60.205.86.217/upload8/2018-11-08/10/f43b56b7-5a6f-4aa8-8468-fdd24f438a58.jpg'
                          alt=""/>;
        this.setState({
            teaPic,
            teaPicSrc: 'http://60.205.86.217/upload8/2018-11-08/10/f43b56b7-5a6f-4aa8-8468-fdd24f438a58.jpg'
        });


        return
        var _this = this;
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            var teaPic = <img src={res} alt=""/>;
            _this.setState({teaPic, teaPicSrc: res})
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * {"method":"saveTeacherStyle",
        "actionName":"sharedClassAction",
        "content":"测试侧测试",
        "teacherName":"拿铁城",
        "avatar":"2"}
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
        };
        console.log(param);
        debugger
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    if (result.response) {
                        // window.location.href = 'https://172.16.2.128:6443/arBook/'
                        window.location.href = 'https://www.maaee.com:6443/arBook/';
                        localStorage.setItem('loginAr', 'success');
                    } else {
                        Toast.info('您还未购买,无法使用', 2)
                    }

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
                <List renderHeader={() => '请输入教师姓名'}>
                    <InputItem
                        placeholder='请输入教师姓名'
                        value={this.state.teaName}
                        onChange={this.teaNameOnChange}
                    />
                </List>
                <List renderHeader={() => '请输入教师简介'}>
                    <TextareaItem
                        rows={5}
                        count={200}
                        placeholder='请输入教师简介'
                        value={this.state.teaNote}
                        onChange={this.teaNoteOnChange}
                    />
                </List>
                <List renderHeader={() => '请上传半身照'}>
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

                <div>
                    <Button type='primary' onClick={this.saveTeacherStyle}>保存</Button>
                </div>
            </div>
        )
    }
}
