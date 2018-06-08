import React from 'react';
import {} from 'antd-mobile';

var demeanor;

export default class application extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    intoApplication() {
        var url = WebServiceUtil.mobileServiceURL + "homeworkModule?classId=" + localStorage.getItem('clazzId');
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    intoNFC() {
        var data = {
            method: 'gotoNFCbyKK',
        };

        Bridge.callHandler(data, null, function (error) {

        });
    }

    toStep() {
        var url = WebServiceUtil.mobileServiceURL + "health?classId=" + localStorage.getItem('clazzId')+"&healthType=step";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    toCalories() {
        var url = WebServiceUtil.mobileServiceURL + "health?classId=" + localStorage.getItem('clazzId')+"&healthType=calories";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        return (
            <div id="application" className="application_height home_card">
                <h3 className="home_title">应用</h3>
                <div className="application_cont">
                    <li className="app_list" onClick={this.intoApplication}>
                        <div className="app_list_img"><span className="task"></span></div>
                        <div className="app_list_text text_hidden">蚁巢作业</div>
                    </li>
                    <li className="app_list" onClick={this.intoNFC}>
                        <div className="app_list_img"><span className="task"></span></div>
                        <div className="app_list_text text_hidden">NFC</div>
                    </li>
                    <li className="app_list" onClick={this.toStep}>
                        <div className="app_list_img"><span className="task"></span></div>
                        <div className="app_list_text text_hidden">步数</div>
                    </li>
                    <li className="app_list" onClick={this.toCalories}>
                        <div className="app_list_img"><span className="task"></span></div>
                        <div className="app_list_text text_hidden">卡路里</div>
                    </li>
                </div>
            </div>
        );
    }
}
