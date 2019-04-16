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
        this.setState({teaPic})


        return
        var _this = this;
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            var teaPic = <img src={res} alt=""/>;
            _this.setState({teaPic})
        }, function (error) {
            console.log(error);
        });
    }

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
                <div className="ListItem-teacher">
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
                <div>
                    <Button type='primary'>保存</Button>
                </div>
            </div>
        )
    }
}
