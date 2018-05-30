import React from 'react';
import {Picker, List, WhiteSpace, Grid, Button, Icon} from 'antd-mobile';
import '../css/studentDutyList.less'

const seasons = [
    []
];

/**
 * 值日生查询页
 */
export default class studentDutyList extends React.Component {

    constructor(props) {
        super(props);
        var weekOfTody = new Date().getDay();
        weekOfTody=(weekOfTody==0?7:weekOfTody);
        this.state = {
            data: [{value: '1', label: '星期一'},
                {value: '2', label: '星期二'},
                {value: '3', label: '星期三'},
                {value: '4', label: '星期四'},
                {value: '5', label: '星期五'},
                {value: '6', label: '星期六'},
                {value: '7', label: '星期日'}],
            cols: 1,
            pickerValue: [],
            asyncValue: [weekOfTody+''],
            sValue: [],
            visible: false,
            studentList: [],
            clazzId: '',
            week: weekOfTody+'',
            editButtonDisabled: true
        };
        this.getClassBrandStudentDutyList = this.getClassBrandStudentDutyList.bind(this);
    }

    componentWillMount() {
        document.title = '班级值日详情页';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var clazzId = locationSearchArray[0].split("=")[1];
        var clazzName = locationSearchArray[1].split("=")[1];
        var userId = locationSearchArray[2].split("=")[1];
        this.getClassBrandStudentDutyList(clazzId);
        this.setState({clazzId,userId,clazzName});
    }

    /**
     * 查看指定班级的值日列表
     */
    getClassBrandStudentDutyList(clazzId,week,pageNo) {
        var _this = this;
        var param = {
            "method": 'getClassBrandStudentDutyList',
            "clazzId": clazzId,
            "week": week,
            "pageNo": pageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result.response);
                var dutyTagList = [];
                if (result.msg == '调用成功' && result.success == true) {
                    var studentDutyList = result.response;
                    console.log(studentDutyList);
                    studentDutyList.forEach(function (studentDuty) {
                        var dutyId = studentDuty.id;
                        var week = studentDuty.week;
                        var users = studentDuty.users;
                        var studentIdStr = "";
                        var studentList = [];
                        if(WebServiceUtil.isEmpty(users)==false){
                            users.forEach(function (user,index) {
                                var userId = user.colUid;
                                studentIdStr+=userId;
                                if(index!=users.length-1){
                                    studentIdStr+=",";
                                }
                                var userName = user.userName;
                                var avatar = user.avatar;
                                var stuJson = {text: userName, icon:avatar};
                                studentList.push(stuJson)
                            })
                        }

                        var dutyTag = <div>
                            <div className="planTitle">
                                <span>星期：{week}</span>
                                <Grid data={studentList} columnNum={4} activeStyle={false}/>
                                <Button type="primary" size="small" onClick={_this.editStudentDuty.bind(_this,week,studentIdStr,dutyId)}>修改</Button>
                                {/*<Button type="primary" size="small" onClick={_this.editStudentDuty}>修改</Button>*/}
                                <Button type="primary" size="small" className="btn_del" onClick={_this.delStudentDuty.bind(_this,dutyId)}>删除</Button>
                            </div>
                            <WhiteSpace size="lg"/>
                        </div>;
                        dutyTagList.push(dutyTag);
                    })
                }
                _this.setState({dutyTagList});
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 修改班级的值日信息
     * 需要将当前页面的查询数据传递到下个页面，然后构建修改页面的数据
     */
    editStudentDuty = (week,studentIdStr,dutyId) => {
        // var studentIdStr = this.state.studentIdList.join(",");
        var editStudentDutyUrl = WebServiceUtil.mobileServiceURL + "editStudentDuty";
        editStudentDutyUrl += "?clazzId=" + this.state.clazzId + "&week=" + week + "&studentIds=" + studentIdStr + "&dutyId=" + dutyId + "&access_user=" + this.state.userId;
        location.href = editStudentDutyUrl;

        var data = {
            method: 'openNewPage',
            url: editStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = editStudentDutyUrl;
        });
    };

    delStudentDuty=(delId)=>{
        var _this = this;
        var param = {
            "method": 'deleteStudentDuty',
            "id": delId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result.response);
                if (result.msg == '调用成功' && result.success == true) {
                    _this.getClassBrandStudentDutyList(_this.state.clazzId);
                }
            },
            onError: function (error) {
            }
        });
    }
    /**
     * 跳转到添加值日生的页面
     */
    turnToAddDutyPage = () => {
        var addStudentDutyUrl = WebServiceUtil.mobileServiceURL + "addStudentDuty?clazzId="+this.state.clazzId+"&clazzName="+this.state.clazzName+"&access_user=" + this.state.userId;
        var data = {
            method: 'openNewPage',
            url: addStudentDutyUrl
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = addStudentDutyUrl;
        });
    }

    render() {
        var _this = this;
        return (
            <div id="studentDutyList" style={{height: document.body.clientHeight}}>
                值日班级:{_this.state.clazzName}
                {_this.state.dutyTagList}
                <div className='addBunton' onClick={this.turnToAddDutyPage}>
                    <img src={require("../imgs/addBtn.png")} />
                </div>
            </div>
        );
    }
}
