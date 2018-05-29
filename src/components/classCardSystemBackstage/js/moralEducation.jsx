import React from 'react';
import {Toast, Picker, List, WhiteSpace, DatePicker} from 'antd-mobile';
import '../css/moralEducation.less'


const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
var mEducation;

export default class moralEducation extends React.Component {
    constructor(props) {
        super(props);
        mEducation = this;
        this.state = {
            data: [],
            cols: 1,
            sValue: ['0', '0'],
            visible: false,
            date: now,
            time: now,
            visible: false,
            moralEducationSelectData: {},
            customChildValue:null,
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

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("&")[0].split("=")[1];
        var loginUser = {
            "userId": ident,
        };
        localStorage.setItem("userIdKey", JSON.stringify(loginUser));
    }

    componentDidMount() {
        document.title = '德育评价';
    }


    /**
     * 获取班级，学期和日期
     */
    getSelectData = (v) => {
        if (mEducation.state.sValue[0] === '0') {
            Toast.fail('请先选择班级')
            return
        }
        if (mEducation.state.sValue[1] === '0') {
            Toast.fail("请先选择学期")
        }
        var _this = this;
        var d = new Date(v);
        var newTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var param = {
            "method": 'getMoralEducationInfo',
            "clazzId": mEducation.state.sValue[0],
            // "termId": mEducation.state.sValue[1],
            "createTime": newTime
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        _this.setState({moralEducationSelectData: result.response})
                    }
                }
            },
            onError: function (error) {
            }
        });
    }

    getClassAndTerm = (v) => {

        this.setState({sValue: v})
    }

    /**
     * 获取学期的ID
     */
    getSemesterList(ident) {
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
        const CustomChildren = ({ extra, onClick, children }) => (

            <div className="am-list-item am-list-item-middle"
              onClick={onClick}
            >
                <div className="am-list-line">
                  <div className="am-list-content">{children}</div>
                  <span className="choiceData am-list-extra" style={{ float: 'right', color: '#888' }}>{extra}</span><div className="am-list-arrow am-list-arrow-horizontal"></div>
                </div>
            </div>
          );
          
        return (
            <div id="moralEducation" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                {/*班级,学期*/}
                <Picker
                    data={this.state.seasons}
                    cascade={false}
                    value={this.state.sValue}
                    className="gradeAndTerm"
                    onChange={v => this.setState({sValue: v})}
                    onOk={this.getClassAndTerm}
                >
                    <List.Item arrow="horizontal"
                               onClick={this.getSemesterList.bind(this, JSON.parse(localStorage.getItem("userIdKey")).userId)}
                    >班级,学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                {/*日期*/}
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.customChildValue}
                    onOk={this.getSelectData}
                    onChange={v => this.setState({ customChildValue: v })}
                    extra="请选择"
                >   
                    <CustomChildren>选择日期</CustomChildren>
                    {/* <List.Item arrow="horizontal">日期</List.Item> */}
                </DatePicker>
                <WhiteSpace size="lg"/>
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
                    <img src={require("../../ringBindInformation/imgs/addBtn.png")}/>
                </div>
            </div>
        );
    }
}
