import React from 'react';
import { Tabs, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
const tabs = [
    { title: '教师端' },
    { title: '学生端' },
    { title: '家长端' },
];

function renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
export default class litleantTeacher extends React.Component {
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

    downLoadFile = (fileType) => {
        var phone = this.state.phone
        if (fileType == 'littleAntTe') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1049156218?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-07-16/19/4e303b59-f115-49e9-9705-d38b5f649c52.apk')
            }
        } else if (fileType == 'littleAntSt') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1049156218?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-07-19/9/93d48c33-cda5-4784-97f9-9f132bbc63e8.apk')
            }
        } else if (fileType == 'littleAntFa') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1395849263?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-06-28/21/f500639a-e8e5-43e2-b813-be6ffbf2f10a.apk')
            }
        }
    }
    render() {
        return (
            <div>
                <StickyContainer>
                    <Tabs tabs={tabs}
                        initalPage={'t2'}
                        renderTabBar={renderTabBar}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            {/* <div className='topImg'><img src={require('../img/topImg_' + imgName + '.png')} alt=""/></div> */}
                            <div>
                                <div>小蚂蚁.教师端</div>
                                <div>科技改变未来，教育成就梦想</div>
                            </div>
                            <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile.bind(this,"littleAntTe")}>
                                <span>免费下载{this.state.phone}版</span></div>
                            {/* <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgName + '.png')} alt=""/></div> */}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            <div>
                                <div>小蚂蚁.学生端</div>
                                <div>科技改变未来，教育成就梦想</div>
                            </div>
                            <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile.bind(this,"littleAntSt")}>
                                <span>免费下载{this.state.phone}版</span></div>
                            {/* <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgName + '.png')} alt=""/></div> */}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            <div>
                                <div>小蚂蚁.家长端</div>
                                <div>科技改变未来，教育成就梦想</div>
                            </div>
                            <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile.bind(this,"littleAntFa")}>
                                <span>免费下载{this.state.phone}版</span></div>
                            {/* <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgName + '.png')} alt=""/></div> */}
                        </div>
                    </Tabs>
                </StickyContainer>
            </div>
        )

    }
}


