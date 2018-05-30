import React from 'react';

import {
    Picker,
    List,
    WhiteSpace,
    Button,
    WingBlank,
    InputItem,
    DatePicker,
    TextareaItem,
    Modal,
    Toast
} from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import '../css/updateMoralEducation.less';

var moralEdu;
const prompt = Modal.prompt;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);


export default class updateMoralEducation extends React.Component {
    constructor(props) {
        super(props);
        moralEdu = this;
        this.state = {
            cols: 1,
            data: [],
            classData: [],
            termData: [],
            asyncValue: [],
            termAsyncValue: [],
            classAsyncValue: [],
            date: now,
            time: now,
            dpValue: null,
            customChildValue: null,
            visible: false,
            timeValue: null,
            showData:{}
        };
    }

    componentDidMount() {
        document.title = '修改德育评价';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var id = locationSearch.split("&")[0].split("=")[1];
        moralEdu.setState({
            "id": id
        })
        this.findMoralEducationById(id)
    }

    /**
     * 班级切换的回调
     * @param val
     */
    onPickerChange = (val) => {
        const d = [...this.state.data];
        const asyncValue = [...val];
        this.setState({
            data: d,
            asyncValue,
        });
    };

    /**
     * 班级切换的回调
     * @param val
     */
    onClassPickerChange = (val) => {
        const d = [...this.state.classData];
        const classAsyncValue = [...val];
        this.setState({
            classData: d,
            classAsyncValue,
        });
    }

    /**
     * 学期切换的回调
     * @param val
     */
    onTermPickerChange = (val) => {
        const d = [...this.state.termData];
        const termAsyncValue = [...val];
        this.setState({
            termData: d,
            termAsyncValue,
        });
    };

    /**
     * 日期切换的回调
     * @param val
     */
    onDatePickerChange = (v) => {
        var d = new Date(v);
        var newTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.setState({
            timeValue: newTime
        })
    }
      /**
     * 查看对应教室ID的德育信息
     */
    findMoralEducationById(id) {
        var _this = this;
       
        var param = {
            "method": 'findMoralEducationById',
            "id": id,
        };
        console.log("param", param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log("result",result);
                if (result.msg == '调用成功' && result.success == true) {
                    _this.setState({
                        "showData": result.response,
                        "health":result.response.health,
                        "politeness":result.response.politeness
                        // isLoadingLeft: isLoading,
                    })
                    console.log(moralEdu.state.health)
                    console.log(moralEdu.state.politeness)
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }
    /**
     * 提交新增的德育项
     */
    addMoralEducationTableItem = () => {
       
        if ($(".healthValue input").val().trim() == '' || $(".healthValue input").val().trim().length == 0) {
            Toast.fail('请填写礼貌评分')
            return
        }
        if ($(".politeValue input").val().trim() == '' || $(".healthValue input").val().trim().length == 0) {
            Toast.fail('请填写健康评分')
            return
        }
        const param = {
            "method": "updateMoralEducation",
            "moralEducationJson": {
                "id": moralEdu.state.id,
                "health": moralEdu.state.health,
                "politeness": moralEdu.state.politeness
            }
        }
        console.log("修改",param);
        console.log(moralEdu.state.health)
        console.log(moralEdu.state.politeness)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('修改成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finishForRefresh',
                        };
                        Bridge.callHandler(data, null, function (error) {
                        });
                    }, 1000)
                }
            },
            onError: function (error) {
            }
        });
    }


   

    /**
     *获取班级的ID
    //  */
    // getClazzesByUserId(id) {
    //     var _this = this;
    //     var param = {
    //         "method": 'getClazzesByUserId',
    //         "userId": id
    //     };
    //     WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
    //         onResponse: function (result) {
    //             if (result.msg == '调用成功' || result.success == true) {
    //                 if (WebServiceUtil.isEmpty(result.response) == false) {
    //                     var arr = [];
    //                     result.response.forEach(function (v, i) {
    //                         arr.push({
    //                             value: v.id, label: v.name
    //                         })
    //                     })
    //                     _this.setState({classData: arr})
    //                 }
    //             }
    //         },
    //         onError: function (error) {
    //         }
    //     });
    // }

    getClassKey = (v) => {
        this.setState({classAsyncValue: v});
    }
    getTermKey = (v) => {
        this.setState({
            termAsyncValue: v
        })
    }

    render() {
        const CustomChildren = ({ extra, onClick, children }) => (
            <div className="am-list-item am-list-item-middle"
                 onClick={onClick}
            >
                <div className="am-list-line">
                    <div className="am-list-content">{children}<i className="redStar">*</i></div>
                    <span className="choiceData am-list-extra" style={{ float: 'right', color: '#888' }}>{extra}</span><div className="am-list-arrow am-list-arrow-horizontal"></div>
                </div>
            </div>

          );
        return (
            <div id="addMoralEducation" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                {/*选择班级*/}
                {/* <Picker
                    data={this.state.classData}
                    cols={1}
                    value={this.state.classAsyncValue}
                    onPickerChange={this.onClassPickerChange}
                    onOk={this.getClassKey}
                >
                    <List.Item arrow="horizontal"
                               onClick={this.getClazzesByUserId.bind(this, JSON.parse(localStorage.getItem("userIdKey")).userId)}>选择班级<i
                        className="redStar">*</i></List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                */}
                {/*选择日期*/}
                {/* <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.customChildValue}
                    onOk={this.onDatePickerChange}
                    onChange={v => this.setState({customChildValue:v})}
                    extra="请选择"
                >
                 <CustomChildren>选择日期</CustomChildren>
                    {/* <List.Item arrow="horizontal">选择日期<i className="redStar">*</i></List.Item> 
                </DatePicker>
                <WhiteSpace size="lg"/> */}
                <div className='CourseTableArea'>
                    <div className="classSearchResultInfo">
                        <List>
                            <InputItem
                                className="politeValue"
                                clear
                                placeholder="请输入分数"
                                value={moralEdu.state.politeness}
                                onChange = {v => {moralEdu.setState({"politeness":v})}}
                                ref={el => this.autoFocusInst = el}
                            >班级礼貌评分</InputItem>
                            <InputItem
                                className="healthValue"
                                clear
                                placeholder="请输入分数"
                                value={moralEdu.state.health}
                                onChange = {v => {moralEdu.setState({"health":v})}}
                                ref={el => this.autoFocusInst = el}
                            >班级健康评分</InputItem>
                        </List>
                    </div>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg"/>
                    <WingBlank>
                        <Button type="warning" onClick={this.addMoralEducationTableItem}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}