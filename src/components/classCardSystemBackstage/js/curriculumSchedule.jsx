import React from 'react';
import {Picker, List, WhiteSpace, Toast} from 'antd-mobile';
import '../css/curriculumSchedule.less'

export default class curriculumSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}],
            cols: 1,
            asyncValue: [],
            sValue: ['0', '0'],
            visible: false,
            classTableArray: [],
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
        var ident = locationSearch.split("&")[0].split('=')[1];
        var loginUser = {
            "colUid": ident,
        };
        localStorage.setItem("loginUserSchedule", JSON.stringify(loginUser));
    }

    componentDidMount() {
        document.title = '班级课程表';
    }

    /**
     *  获得定义的学期列表
     * @param ident
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
                // message.error(error);
            }
        });
    }

    /**
     * 获取此用户所在班级
     * @param ident
     * @param semesterList
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
                // message.error(error);
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
     * 星期切换的回调
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
     * 增加课程表的回调
     */
    addSchedule() {
        var url = WebServiceUtil.mobileServiceURL + "addCurriculumSchedule";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 查看课表项管理页
     * @param v
     */
    viewCourseTableItemPage(v) {
        var _this = this;
        this.setState({asyncValue: v})
        if (this.state.sValue[0] == 0) {
            Toast.fail('请选择班级')
            return
        }
        if (this.state.sValue[1] == 0) {
            Toast.fail('请选择学期')
            return
        }
        var param = {
            "method": 'viewCourseTableItemPage',
            "sid": this.state.sValue[1],
            "w": v[0],
            "cid": this.state.sValue[0],
            "rid": -1,
            "uid": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = result.response[0].courseList
                    _this.setState({classTableArray: arr});
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                {/*班级,学期*/}
                <Picker
                    data={this.state.seasons}
                    cascade={false}
                    value={this.state.sValue}
                    onChange={v => this.setState({sValue: v})}
                    onOk={v => this.setState({sValue: v})}
                >
                    <List.Item
                        arrow="horizontal"
                        onClick={this.getSemesterList.bind(this, JSON.parse(localStorage.getItem('loginUserSchedule')).colUid)}
                    >班级,学期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                {/*日期*/}
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onPickerChange={this.onPickerChange}
                    onOk={v => this.viewCourseTableItemPage(v)}
                >
                    <List.Item arrow="horizontal">日期</List.Item>
                </Picker>
                <WhiteSpace size="lg"/>
                <div className="curriculum_cont cont_communal">
                    {this.state.classTableArray.map((v, i) => {
                        return <li>
                            <div className="font_gray add_title">第{i + 1}节</div>
                            <div className="list_high list">
                                <span className="text_hidden text_cont1">{v.openTime + '-' + v.closeTime}</span>
                                <span className="text_hidden text_cont2">{v.classRoom.name}</span>
                                <span className="text_hidden text_cont3">{v.courseName}</span>
                                <span className="amend_btn">修改</span>
                            </div>
                        </li>
                    })}
                </div>
                <div className='addBunton' onClick={this.addSchedule}>
                    <img src={require("../../ringBindInformation/imgs/addBtn.png")}/>
                </div>
            </div>
        );
    }
}
