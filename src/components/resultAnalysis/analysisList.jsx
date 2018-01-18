import React from 'react';
import fetch from 'dva/fetch'
import {Tabs, Flex, List, WingBlank, Toast} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import './analysisList.less';

// const mobileUrl = 'http://www.maaee.com/Excoord_For_Education/webservice';
const mobileUrl = 'http://192.168.1.230:9006/Excoord_ApiServer/webservice';

export default class analysisList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        document.title = '成绩分析';
        // var locationHref = window.location.href;
        // var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var searchArray = locationSearch.split("&");
        this.viewPaperAnalysisTaskPage()
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

    /**
     * 查看试卷分析中的年级的结果
     */
    viewPaperAnalysisTaskPage() {
        /*var taskId = array[0].split('=')[1];
        var clazzId = array[1].split('=')[1];*/
        var _this = this;
        var param = {
            "method": 'viewPaperAnalysisTaskPage',
            "colUid": 23836,
            "pageNo": -1,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        // var ret = dataF.response;
        // this.buildAnalysis(ret);

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                console.log(result);
                var ret = result.data.response;
                if (result.data.success == true && result.data.msg == '调用成功') {
                    //  获得数据

                } else {
                    Toast.fail(result.data.msg, 1);
                }
            });
    }

    /**
     * 渲染年级分析结果
     * @param data
     */



    render() {

        return (
            <div className='analysisList'>

            </div>
        );
    }
}
