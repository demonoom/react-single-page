import React from 'react';
import {List, WhiteSpace, Toast, Modal} from 'antd-mobile';
import '../../css/newCurriculumSche/curriculumSchedule.less'

var cSchedule;
const Item = List.Item;
const alert = Modal.alert;
export default class curriculumSchedule extends React.Component {

    constructor(props) {
        super(props);
        cSchedule = this;
        this.state = {
            classTableArray: [],
            weekData: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}],
        };
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var clazzroomId = locationSearch.split("&")[0].split('=')[1];
        var classTableId = locationSearch.split("&")[1].split('=')[1];
        var classTableName = locationSearch.split("&")[2].split('=')[1];
        this.setState({clazzroomId, classTableId, classTableName})
        this.viewCourseTableItemPage(classTableId)
    }

    componentDidMount() {
        document.title = '班级课程表';
    }

    viewCourseTableItemPage(id) {
        var param = {
            "method": 'viewCourseTableItemPage',
            "tid": id,
            "w": -1
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    cSchedule.setState({classTableArray: result.response})
                }
            },
            onError: function (error) {
                Toast.fail(error)
            }
        });
    }

    /**
     * 增加课程表的回调
     */
    addSchedule() {
        var url = WebServiceUtil.mobileServiceURL + "newAddCurriculumSchedule?clazzroomId=" + cSchedule.state.clazzroomId + "&classTableId=" + cSchedule.state.classTableId;
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
        var url = WebServiceUtil.mobileServiceURL + "newUpdateCurriculumSchedule?clazzroomId=" + this.state.clazzroomId + "&classTableId=" + this.state.classTableId + "&classTableDetilId=" + currentSchedule.id;
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 删除弹出框
     */
    showAlert = (sId) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('删除', '您确定要删除该课表项吗?', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delSchedule(sId)},
        ], phone);
    };

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
        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <List className="my-list">
                    <Item>{this.state.classTableName}</Item>
                </List>
                <WhiteSpace size="lg"/>
                <div className="curriculum_cont cont_communal">
                    {this.state.classTableArray.map((v, i) => {
                        return <li>
                            <div className="add_title">
                                <span className="font_gray">第{i + 1}节</span>
                                <span
                                    className="amend_btn" onClick={this.turnToUpdatePage.bind(this, v)}>修改</span>
                                <span className="delete" onClick={this.showAlert.bind(this, v.id)}>删除</span>
                            </div>

                            <div className="list_high list textOver">
                                <span className="text_hidden text_cont1">{v.openTime + '-' + v.closeTime}</span>
                                <span className="text_hidden text_cont2">{v.courseName}</span>
                            </div>
                            <div className="list_high list lineList textOver">
                                <span className="text_hidden text_cont3">{this.state.weekData[v.week - 1].label}</span>
                            </div>
                            <div className="list_high list lineList textOver">
                                <span className="text_hidden text_cont3">{v.teacher.userName}</span>
                            </div>
                            <div className="list_high list lineList textOver">
                                <span className="text_hidden text_cont3">{v.clazz.name}</span>
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
