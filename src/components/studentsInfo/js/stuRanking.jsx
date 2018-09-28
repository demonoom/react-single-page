import React from 'react';
import '../css/stuRanking.less'
import {List, Toast, ListView, Button, InputItem, Radio, WhiteSpace, Modal} from 'antd-mobile';
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class stuRanking extends React.Component {

    constructor(props) {
        super(props);
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            detaultPageNo: 1,
        };

    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            userId:userId
        }, () => {
            this.getStudentSportsListByParentId();
        });

    }


    getStudentSportsListByParentId(){
        var param = {
            "method": 'getStudentSportsListByParentId',
            "userId": this.state.userId,
            "pageNo": this.state.detaultPageNo,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (res) {
                console.log(res,'res');
                if (res.success == true && res.msg == '调用成功') {

                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    render() {
        return (
            <div id="stuRanking">
                学生运动
            </div>
        );
    }
}
