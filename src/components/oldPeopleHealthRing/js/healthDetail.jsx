import React from "react";
import { Tabs, List, Switch } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import { createForm } from 'rc-form';
import '../css/healthDetail.less'
function renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
const tabs = [
    { title: '步数' },
    { title: '心率' },
];
var str = <span className="month">月</span>;


var cccalm;
export default class healthDetail extends React.Component {
    constructor(props) {
        super(props);
        cccalm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
        }

    }
    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '健康数据';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', this.onWindowResize)
        this.viewWatchPage(uid);
    }


    /**
        * 查看绑定的设备
        */
    viewWatchPage(uid) {
        var _this = this;
        var param = {
            "method": 'getOldManBraceletSportStepByOpenId',
            "openId": uid,
            "dataType": "week",
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' && result.success == true) {

                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    saveChecked(checked) {
        console.log(checked);
        if (checked) {
            str = <span className="month">月</span>;
            console.log(str,"1")
        } else {    
            str = <span className="week">周</span>;
            console.log(str,"2")
        }



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
                <div className="switchBtn"><List.Item
                    extra={<Switch
                        {...getFieldProps('Switch1', {
                            initialValue: true,
                            valuePropName: 'checked',
                        })}
                        name="123"
                        //   onChange={(checked)=>this.setState({
                        //       theStatus:checked
                        //   })}
                        onClick={cccalm.saveChecked}
                    />}
                ></List.Item>
                    {str}</div>
            );
        };

        SwitchExample = createForm()(SwitchExample);
        return (

            <div id="healthDetail" style={{ height: this.state.clientHeight }}>
                <div className="my_flex">
                    <div className="titleItem textOver">
                        <span className="title">手环名称：</span>
                        <span></span>
                    </div>
                    <div className="titleItem textOver">
                        <span className="title">手环ID：</span>
                        <span></span>
                    </div>
                </div>


                <div className="step chartItem">
                    步数图柱形（月和周切换）
                    <SwitchExample />
                </div>
                <div className="heartRate chartItem">
                    心率折线图（切换前一天）
               </div>
                <div className="unusualHeartRate chartItem">
                    <div className="title">
                        <span>时间</span>
                        <span>异常心率</span>
                    </div>
               </div>
            </div>
        )
    }
}