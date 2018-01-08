import React from 'react';
import {
    SearchBar, Tabs, Steps,
} from 'antd-mobile';
import fetch from 'dva/fetch'

const mobileUrl = 'http://www.maaee.com/Excoord_For_Education/webservice';

export default class Demo extends React.Component {
    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        var type = searchArray[1].split('=')[1];
        this.subjectDetailShow(id, type);
    }

    parseJSON(response) {
        return response.json();
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    subjectDetailShow(id, type) {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'subjectDetailShow',
            "ident": '54208',
            "sid": id,
            "fid": id,
            "type": type
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                console.log(result);
                var response = result.data.response;
                // for (let i = 0; i < response.length; i++) {
                //     var topic = response[i];
                //     dataBlob[`${i}`] = topic;
                // }
                // _this.initData = _this.initData.concat(response);
                // _this.setState({
                //     dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                //     isLoading: false,
                // })
            });
    }

    render() {
        return (<div style={{marginBottom: 30}}>
            课程详情页面
        </div>);
    }
}
