import React from 'react';
import { } from 'antd-mobile';
export default class yunxiao extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS'
        };
    }
    componentDidMount() {
        var _this = this
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({ phone: 'IOS' })
        } else {
            this.setState({ phone: 'Android' })
        }
    }

    downLoadFile = () => {
        var phone = this.state.phone
        if (phone == 'IOS') {
            window.open('https://itunes.apple.com/cn/app/apple-store/id1268534857?mt=8')
        } else {
            window.open('http://60.205.86.217/upload7_app/2018-08-02/19/3c09e2df-fd58-4f81-8b5f-7deb38748000.apk')
        }
    }

    render() {
        return (
            <div id='fileDownload'>
                 <div className='topImg'><img src={require('../img/topImg_elearning.png')} alt=""/></div>
                <div className='textCont'>
                    <div>小蚂蚁云校</div>
                    <span>实景体验式学习，把世界装进课堂</span>
                </div>
                <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile}>
                    <span>免费下载{this.state.phone}版</span></div>
                 <div className='bottomImg'><img
                        src={require('../img/bottomImg_elearning.png')} alt=""/></div>
            </div>
        );

    }
}


