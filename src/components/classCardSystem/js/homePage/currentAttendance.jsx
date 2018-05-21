import React from 'react';
import {} from 'antd-mobile';

var demeanor;

export default class currentAttendance extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.messageUtilObj.command == 'brand_class_open') {
            //查看某个课表项
            this.getBraceletAttend(nextProps.messageUtilObj.data)
        } else if (nextProps.messageUtilObj.command == 'brand_class_close') {
            console.log('下课')
        }
    }

    componentDidMount() {
        this.getBraceletAttend()
    }

    /**
     * 获取手环考勤数据
     * @param data
     */
    getBraceletAttend(data) {
        var param = {
            "method": 'getBraceletAttend',
            // "cid": data.classTableId
            "cid": 3
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

    render() {
        return (
            <div id="currentAttendance">
                考勤
            </div>
        );
    }
}
