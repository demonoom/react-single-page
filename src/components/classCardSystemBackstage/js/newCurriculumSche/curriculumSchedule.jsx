import React from 'react';
import {List, WhiteSpace, Toast} from 'antd-mobile';
import '../../css/newCurriculumSche/curriculumSchedule.less'

var cSchedule;
const Item = List.Item;
export default class curriculumSchedule extends React.Component {

    constructor(props) {
        super(props);
        cSchedule = this;
        this.state = {
            classTableArray: [],
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
     * 增加课程表的回调
     */
    addSchedule() {
        var url = WebServiceUtil.mobileServiceURL + "newAddCurriculumSchedule";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 跳转到课程表更新页面
     */
    turnToUpdatePage(currentSchedule) {
        var currentScheduleId = currentSchedule.id;
        var clazzOrRoomId = this.state.sValue[0];
        var termId = this.state.sValue[1];
        var week = this.state.asyncValue[0];
        var url = WebServiceUtil.mobileServiceURL + "updateCurriculumSchedule?currentScheduleId=" + currentScheduleId + "&clazzOrRoomId=" + clazzOrRoomId + "&termId=" + termId + "&week=" + week + "&curriculumType=" + this.state.curriculumType;
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 根据ID删除课表
     */
    delSchedule(sId) {
        var _this = this;
        var param = {
            "method": 'deleteCourseTableItem',
            "id": sId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('删除成功', 1);
                    var arr = cSchedule.state.classTableArray
                    arr.forEach((v, i) => {
                        if (v.id == sId) {
                            arr.splice(i, 1);
                        }
                    })
                    cSchedule.setState({classTableArray: arr})
                } else {
                    Toast.fail(result.msg)
                }
            },
            onError: function (error) {
                Toast.info('删除失败');
            }
        });
    }

    render() {
        var pickerTip = "班级";
        if (this.state.curriculumType == 2) {
            pickerTip = "教室";
        }
        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <List className="my-list">
                    <Item>Title</Item>
                </List>
                <WhiteSpace size="lg"/>
                <div className="curriculum_cont cont_communal">
                    {this.state.classTableArray.map((v, i) => {
                        return <li>
                            <div className="add_title">
                                <span className="font_gray">第{i + 1}节</span>
                                <span
                                    className="amend_btn" onClick={this.turnToUpdatePage.bind(this, v)}>修改</span>
                                <span className="delete" onClick={this.delSchedule.bind(this, v.id)}>删除</span>
                            </div>

                            <div className="list_high list textOver">
                                <span className="text_hidden text_cont1">{v.openTime + '-' + v.closeTime}</span>
                                <span className="text_hidden text_cont2">{v.courseName}</span>
                            </div>
                            <div className="list_high list lineList textOver">
                                <span className="text_hidden text_cont3">{v.classRoom.name}</span>
                            </div>
                        </li>
                    })}
                </div>
                <div className='addBunton' onClick={this.addSchedule}>
                    <img src={require("../../../ringBindInformation/imgs/addBtn.png")}/>
                </div>
            </div>
        );
    }
}
