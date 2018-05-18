import React from 'react';
import { Picker, List, WhiteSpace, DatePicker } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import '../css/moralEducation.less'



const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));



export default class moralEducation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cols: 1,
            asyncValue: [],
            sValue: ['0', '0'],
            visible: false,
            date: now,
            time: now,
            utcDate: utcNow,
            dpValue: null,
            customChildValue: null,
            visible: false,
            moralEducationSelectData: {},
            seasons: [[
                {
                    label: '请选择',
                    value: '0',
                }
            ],
                [
                    {
                        label: '请选择',
                        value: '0',
                    }
                ],]
        };
    }
    componentWillMount(){
        document.title = '德育评价';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("=")[1];
        var loginUser = {
            "userId": ident,
        };
    }
    componentDidMount() {
        localStorage.setItem("userIdKey", JSON.stringify(loginUser));
    }

    /**
     * 获取班级，学期和日期
     */
    getSelectData = (v) => {
        var _this = this;
        var d = new Date(v);
        var newTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var param = {
            "method": 'getMoralEducationInfo',
            "clazzId": JSON.parse(localStorage.getItem("classAndTermKey")).classId,
            "termId": JSON.parse(localStorage.getItem("classAndTermKey")).termId,
            "createTime": newTime
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        _this.setState({ moralEducationSelectData: result.response })
                    }
                }
            },
            onError: function (error) {
            }
        });
    }
    getClassAndTerm = (v) => {
        this.setState({ sValue: v })
        var classAndTerm = {
            "classId": v[0],
            "termId": v[1]
        }
        localStorage.setItem("classAndTermKey", JSON.stringify(classAndTerm));
    }
    /**
     * 获取学期的ID
     */
    getSemesterList(ident){
         var _this = this;
         var param = {
            "method": 'getSemesterList',
            "uid": ident
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.getClazzesByUserId(ident, result.response)
                }
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 获取班级ID
     */
    getClazzesByUserId(ident, semesterList) {
        var _this = this;
        var param = {
            "method": 'getClazzesByUserId',
            "userId": ident
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.buildSeasons(result.response, semesterList)
                }
            },
            onError: function (error) {
            }
        });
    }
    buildSeasons(cList, sList) {
        var cListArr = [{
            label: '请选择',
            value: '0',
        }]
        var sListArr = [{
            label: '请选择',
            value: '0',
        }];
        if (WebServiceUtil.isEmpty(cList) == false) {
            cList.forEach(function (v, i) {
                cListArr.push({
                    label: v.name,
                    value: v.id,
                })
            })
        }
        if (WebServiceUtil.isEmpty(sList) == false) {
            sList.forEach(function (item, index) {
                sListArr.push({
                    label: item.name,
                    value: item.id,
                })
            })
        }
        var arr = [cListArr, sListArr];
        this.setState({seasons: arr})
    }
    /**
     * 增加课程表的回调
     */
    addSchedule() {
        var url = WebServiceUtil.mobileServiceURL + "addMoralEducation";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

  
    render() {
        var _this = this;
        return (
            <div id="moralEducation" style={{ height: document.body.clientHeight }}>
                <WhiteSpace size="lg" />
                {/*班级,学期*/}
                <Picker
                    data={this.state.seasons}
                    cascade={false}
                    value={this.state.sValue}
                    className="gradeAndTerm"
                    onChange={v => this.setState({ sValue: v })}
                    onOk={this.getClassAndTerm}
                >
                    <List.Item arrow="horizontal"
                        onClick={this.getSemesterList.bind(this,JSON.parse(localStorage.getItem("userIdKey")).userId)}
                    >班级,学期</List.Item>
                </Picker>
                <WhiteSpace size="lg" />
                {/*日期*/}
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.date}
                    onOk={this.getSelectData}
                    onChange={date => this.setState({ date })

                    }
                >
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace size="lg" />
                <div className='classSearchResult'>
                    <div className="classSearchResultInfo">
                        <div className="classHealth">
                            <span className="resultName">班级健康评分</span>
                            <span className="resultGrade">{_this.state.moralEducationSelectData.health}分</span>
                        </div>
                        <div className="classPoliteness">
                            <span className="resultName">班级礼貌评分</span>
                            <span className="resultGrade">{_this.state.moralEducationSelectData.politeness}分</span>
                        </div>
                    </div>

                </div>
                <div className='addBunton' onClick={this.addSchedule}>
                    <img src={require("../../ringBindInformation/imgs/addBtn.png")} />
                </div>
            </div>
        );
    }
}
