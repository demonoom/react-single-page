import React from 'react';
import {} from 'antd-mobile';
import '../css/ringBinding.less'

export default class ringBinding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var ident = searchArray[0].split('=')[1];
        var loginUser = {
            "ident": ident,
        };
        localStorage.setItem("loginUserRingBind", JSON.stringify(loginUser));
    }

    /**
     * 跳转至绑定手环界面
     */
    braceletOnclick() {
        var url = WebServiceUtil.mobileServiceURL + "bindingBracelet";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 跳转至绑定盒子界面
     */
    boxOnclick() {
        var url = WebServiceUtil.mobileServiceURL + "boxBracelet";
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
            <div id="ringBinding" style={{height: document.body.clientHeight}}>
                <div className='bracelet' onClick={this.braceletOnclick}>绑定手环</div>
                <div className='box' onClick={this.boxOnclick}>绑定盒子</div>
            </div>
        );
    }
}
