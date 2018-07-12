import React from 'react';
import '../css/healthList.less';
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

var _this;

export default class healthList extends React.Component {

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            // classId: 819,
        }

    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classId = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            classId:classId,
        })

    }

    componentDidMount() {
        document.title = "健康数据列表";

    }

    componentWillUnmount() {

    }


    toRanking(type){
        if(type){
            let url;
            if (this.state.classId) {
                url = encodeURI(WebServiceUtil.mobileServiceURL + "health?classId=" + this.state.classId+'&healthType='+type);
            } else { }
            var data = {
                method: 'openNewPage',
                url: url
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        }else{
            Toast.fail('type参数有误',2);
        }
    }

    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }



    render() {
        return (
            <div id="skin_primarySchool">
                <div id="healthList" className="home_content" style={{height: this.state.clientHeight}}>
                <div className="inner_bg">
                    <div className="navBar">
                        <span onClick={this.historyGoBack}>首页</span>
                        <span className="icon"></span>
                        <span>健康数据列表</span>
                    </div>
                    <div style={{
                        textAlign:'center',
                        padding:'10px 0px',
                        borderBottom:'1px solid #ccc'
                    }} onClick={this.toRanking.bind(this,'step')}>步数</div>
                    <div style={{
                        textAlign:'center',
                        padding:'10px 0px',
                        borderBottom:'1px solid #ccc'
                    }} onClick={this.toRanking.bind(this,'calories')}>卡路里</div>
                </div>
            </div>
            </div>
        );
    }
}
