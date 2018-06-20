import React from "react";
import "../css/attendanceTime.less"
import { DatePicker, Toast,WhiteSpace } from 'antd-mobile';

var attTime;
export default class attendanceTime extends React.Component {
    constructor(props) {
        super(props);
        attTime = this;
        this.state = {
            dpValue: null,
            comeTimeValue: null,
            leaveTimeValue: null,
            visible: false,
        }
    }


    componentDidMount() {
        document.title = "设置考勤时段"
    }
    /**
     * 获取入校时间
     * @param {*} v 
     */
    getComeTime(v) {
        console.log(v);
    }

    /**
     * 
     * @param {获取离校时间} v 
     */
    getLeaveTime(v) {
        console.log(v);
    }

    /**
     * 提交
     */
    submitTime() {
        if (attTime.state.comeTimeValue == null) {
            Toast.info("请选择入校时间")
            return
        }
        if (attTime.state.leaveTimeValue == null) {
            Toast.info("请选择离校时间")
            return
        }
        var comeTime = attTime.state.comeTimeValue.getTime()
        var leaveTime = attTime.state.leaveTimeValue.getTime()

        var param = {
            "method": 'VVVVVVV',
            "comeTime": WebServiceUtil.formatHM(comeTime),
            "leaveTime": WebServiceUtil.formatHM(leaveTime),
        };
        console.log(param);
        return
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.info("设置成功")
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
    render() {
        var _this = this;
        const ComeChildren = ({ extra, onClick, children }) => (
            <div
                style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px' }}
            >
                {children}
                <span style={{ float: 'right', color: '#333', padding: '0 15px' }}>前</span>
                <span onClick={onClick} style={{ float: 'right', color: '#888' }}>{extra}</span>
            </div>
        );
        const LeaveChildren = ({ extra, onClick, children }) => (
            <div
                style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px' }}
            >
                {children}
                <span style={{ float: 'right', color: '#333', padding: '0 15px' }}>后</span>
                <span onClick={onClick} style={{ float: 'right', color: '#888' }}>{extra}</span>
            </div>
        );
        return (
            <div id="attendanceTime">
                <DatePicker
                    mode="time"
                    format="HH:mm"
                    value={this.state.comeTimeValue}
                    onChange={v => this.setState({ comeTimeValue: v })}
                    onOk={(v) => _this.getComeTime(v)}
                    extra="请选择"
                >
                    <ComeChildren>入校考勤时间：</ComeChildren>
                </DatePicker>
                <WhiteSpace size="lg" />
                <DatePicker
                    mode="time"
                    format="HH:mm"
                    value={this.state.leaveTimeValue}
                    onChange={v => this.setState({ leaveTimeValue: v })}
                    onOk={(v) => _this.getLeaveTime(v)}
                    extra="请选择"
                >
                    <LeaveChildren>离校考勤时间：</LeaveChildren>
                </DatePicker>

                <div className="bottomBox">
                    <span style={{ background: '#F56A55',
                                color: '#fff'}} onClick={this.submitTime}>提交
                                </span>
                </div>
                
            </div >
        )
    }
}