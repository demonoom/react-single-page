import React from 'react';
import {} from 'antd-mobile';
import '../css/ringBinding.less'

export default class ringBinding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '绑定手环信息';   //设置title
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
        ``
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
                <div className='bracelet' onClick={this.braceletOnclick}>
                    <img src={require('../imgs/ring.png')} alt=""/>
                    <span>绑定学生手环信息</span>
                </div>
                <div className='box' onClick={this.boxOnclick}>
                    <img src={require('../imgs/box.png')} alt=""/>
                    <span>绑定课堂盒子信息</span>
                </div>
            </div>
        );
    }
}
