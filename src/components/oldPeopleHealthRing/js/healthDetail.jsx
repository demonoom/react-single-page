import React from "react";
import { Tabs, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';


function renderTabBar(props) {
    return (<Sticky>
      {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
  }
const tabs = [
    { title: '步数' },
    { title: '心率' },
];



export default class healthDetail extends React.Component {
    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '健康数据';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', this.onWindowResize)
    }


    /**
        * 查看绑定的设备
        */
    viewWatchPage(loginUser) {
        var _this = this;
        var param = {
            "method": 'viewWatchPage',
            "aid": loginUser.ident,
            "cid": -1,
            "pn": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {

                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        let datas = [
            {
                content:"123",
                time:"2019-9-0"
            },
            {
                content:"222",
                time:"2019-1-1"
            }
        ]
        return (
            <div>
                <WhiteSpace />
                <StickyContainer>
                    <Tabs tabs={tabs}
                        initalPage={'t2'}
                        renderTabBar={renderTabBar}
                    >
                        {
                            datas.map((v, i) => {
                                return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                                    <span>{v.time}</span>{v.content}
                                </div>
                            })
                        }
                    </Tabs>
                </StickyContainer>
                <WhiteSpace />
            </div>
        )
    }
}