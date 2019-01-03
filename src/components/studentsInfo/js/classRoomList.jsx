import React from 'react';

import {
    Toast,
    Card,
    Modal,
    Button
} from 'antd-mobile';
const alert = Modal.alert;
const prompt = Modal.prompt;
export default class classRoomList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initData: [],
        };

    }

    componentDidMount() {
        document.title = "班级列表";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        var type = locationSearch.split("&")[1].split('=')[1];
        this.setState({
            userId: userId,
            type: type
        }, () => {
            this.getBindedClazzesAndHeartRate();
        });

    }

    getBindedClazzesAndHeartRate() {
        var param = {
            "method": 'getBindedClazzesAndHeartRate',
            "userId": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res) => {
                console.log(res, 'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.setState({
                        initData: res.response
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

    }

    updateBindedClazzHeartRate=(cId, heartRate,index) =>{
        var param = {
            "method": 'updateBindedClazzHeartRate',
            "clazzId": cId,
            "heartRate": heartRate
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res) => {
                console.log(res, 'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.state.initData.forEach((v,i)=>{
                        if(index == i){
                            v.clazzHeartRate = heartRate;
                        }
                    })
                    this.setState({
                        initData:this.state.initData
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

    }

    /**
    * 修改弹出框
    */
    showModal(childrenHeartRate, cId,index) {
        console.log('弹窗');
        // console.log(colUid);
        prompt('请输入心率阀值', '', [
            { text: '取消' },
            {
                text: '确定', onPress: value => {
                    console.log(`输入的内容:${value}`);
                    this.updateBindedClazzHeartRate(cId, value,index);
                }
            },
        ], 'default', childrenHeartRate)
    }

    render() {
        return (
            <div>
                {
                    this.state.initData.map((v, i) => {
                        console.log(v, "vvv")
                        return (
                            <div>
                                <div>班级：<span> {
                                    v.clazz.grade.name + v.clazz.name
                                }</span></div>
                                <div>
                                    心率：<span>
                                        {v.clazzHeartRate}
                                    </span>
                                    <span onClick={this.showModal.bind(this, v.clazzHeartRate, v.clazz.id,i)}> 编辑</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}