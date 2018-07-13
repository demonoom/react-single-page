import React from 'react';
import {
    Toast,
    WhiteSpace,
    Button,
    WingBlank,
    InputItem,
    DatePicker,
} from 'antd-mobile';

var UpdateAT;

export default class updateClassBrandTemplate extends React.Component {
    constructor(props) {
        super(props);
        UpdateAT = this;
        this.state = {
            teachBuildValue: "",
            skinClassName:"",
            cols: 1,
            initData:[],
            search_bg: false,
            clientHeight: document.body.clientHeight,
        };
    }

    componentWillMount() {
        document.title = '皮肤编辑管理';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var classId = locationSearch.split("&")[1].split("=")[1];
        this.setState({ uid, "classId":classId });
        this.viewSchoolAttendance(classId);
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount() {
        Bridge.setShareAble("false");
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindwoResize);
    }

    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            UpdateAT.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }

    /**
     * 数据回显
     * aId  班级ID
     */
    viewSchoolAttendance = (classId) => {
        var param = {
            "method":"viewSchoolAttendance",
            "aId":classId
        }
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log("resutl",result)
                if (result.msg == '调用成功' || result.success == true) {
                    UpdateAT.setState({
                        initData:result.response,
                        teachBuildValue:result.response.name,
                        skinClassName:result.response.cName,

                    })
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 更新提交
     */
    updateSchoolAttendance = () => {
        var _this = this;
        if (UpdateAT.state.teachBuildValue == "" || UpdateAT.state.teachBuildValue == undefined) {
            Toast.info("皮肤名称不能为空")
        }
        if (UpdateAT.state.skinClassName == "" || UpdateAT.state.skinClassName == undefined) {
            Toast.info("皮肤类名不能为空")
        }
        var param = {
            "method": 'updateSchoolAttendance',
            "name": UpdateAT.state.teachBuildValue,
            "cName":UpdateAT.state.skinClassName
        }
        console.log(param)
        return
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(result)
                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };

                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        const ComeChildren = ({ extra, onClick, children }) => (
            <div className="am-list-item am-list-item-middle">
                <div className="am-list-line">
                    <div className="am-list-content">{children}<i className="redStar">*</i></div>
                    <div className="am-list-extra" onClick={onClick}>{extra}</div>
                    <div className="am-list-arrow am-list-arrow-horizontal"></div>
                </div>
            </div>
        );
        const LeaveChildren = ({ extra, onClick, children }) => (
            <div className="am-list-item am-list-item-middle">
                <div className="am-list-line">
                    <div className="am-list-content">{children}<i className="redStar">*</i></div>
                    <div className="am-list-extra" onClick={onClick}>{extra}</div>
                    <div className="am-list-arrow am-list-arrow-horizontal"></div>
                </div>
            </div>
        );
        return (
            <div id="updateClassBrandTemplate" style={{ height: this.state.clientHeight }}>
                <div className="search_bg" style={{ display: this.state.search_bg ? 'block' : 'none' }}></div>
                <div className="addCurriculum_cont">
                    <WhiteSpace size="lg" />
                    <div className='teachBuild'>
                        <InputItem
                            placeholder="请输入名称"
                            data-seed="logId"
                            onChange={v => {
                                UpdateAT.setState({
                                    "teachBuildValue": v
                                })
                            }}
                            value={this.state.teachBuildValue}
                        >皮肤名称<i className='redStar'>*</i></InputItem>
                    </div>
                    <WhiteSpace size="lg" />
                    <div className='teachBuild'>
                        <InputItem
                            placeholder="请输入类名"
                            data-seed="logId"
                            onChange={v => {
                                UpdateAT.setState({
                                    "skinClassName": v
                                })
                            }}
                            value={this.state.skinClassName}
                        >皮肤类名<i className='redStar'>*</i></InputItem>
                    </div>
                   
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.updateSchoolAttendance}>提交</Button>
                    </WingBlank>
                </div>

            </div>
        );
    }
}
