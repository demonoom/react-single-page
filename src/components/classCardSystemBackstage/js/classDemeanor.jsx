import React from 'react';
import {Picker, List, WhiteSpace, WingBlank, Button} from 'antd-mobile';
import '../css/classDemeanor.less'

export default class classDemeanor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            asyncValue: [],
        };
    }

    componentDidMount() {
        document.title = '班级风采';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("=")[1];
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
                    console.log(result);
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

    }

    /**
     * 本地上传照片
     */
    uploadImg() {

    }

    render() {
        return (
            <div id="classDemeanor" style={{height: document.body.clientHeight}}>
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
                <div className='showImg'>
                    <div>风采展示</div>
                </div>
                <WhiteSpace size="lg"/>
                <div className='uploadImg'>
                    <div>上传照片</div>
                    <img
                        className='uploadImgBtn'
                        src={require('../imgs/addPic.png')}
                        alt=""
                        onClick={this.uploadImgBtn}
                    />
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
