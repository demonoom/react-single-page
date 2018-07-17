import React from "react";
import { Tabs, List, Switch } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import { createForm } from 'rc-form';

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
    saveChecked(){
        
    }
    render() {
        let datas = [
            {
                content: "123",
                time: "2019-9-0"
            },
            {
                content: "222",
                time: "2019-1-1"
            }
        ]
        
        let SwitchExample = (props) => {
            const { getFieldProps } = props.form;
            return (
                <div><List.Item
                extra={<Switch
                  {...getFieldProps('Switch1', {
                    initialValue: true,
                    valuePropName: 'checked',
                  })}
                  onClick={(checked) => { console.log(checked); }}
                />}
              ></List.Item>
              <span>周</span><span>月</span></div>
            );
          };
          
          SwitchExample = createForm()(SwitchExample);
        return (
            
            <div>
                <span>手环名称：</span>
                <span>手环：</span>
                <div className="step">
                    步数图柱形（月和周切换）
                    <SwitchExample />
                </div>
                <div className="step">
                    心率折线图（切换前一天）
               </div>
                <div>
                    异常心率
               </div>
            </div>
        )
    }
}