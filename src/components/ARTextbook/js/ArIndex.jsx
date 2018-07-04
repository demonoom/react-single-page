import React from "react";
import "../css/ArIndex.less"
export default class ArIndex extends React.Component {
    toArLIst() {
        var url = WebServiceUtil.mobileServiceURL + "ARTextbookList";
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    toArScan() {
        var url = "https://www.maaee.com:6443/easyAr/";
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {
        var _this = this;
        return (
            <div id="ArIndex">
                <div className="container">
                    <div className="btnMade" onClick={_this.toArLIst}><span className="textStyle">制作</span></div>
                    <div className="btnScan" onClick={_this.toArScan}><span className="textStyle">识别</span></div>
                </div>
            </div>
        )
    }
}