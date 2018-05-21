import React from 'react';
import {Picker, List, WhiteSpace,Button,Toast, Checkbox} from 'antd-mobile';
const CheckboxItem = Checkbox.CheckboxItem;

const seasons = [
    [

    ]
];

const terms = [
    [

    ]
];

var studentCheckedArray=[];

export default class editStudentDuty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cols: 1,
            pickerValue: [],
            asyncValue: [],
            sValue: [],
            termValue: [],
            visible: false,
            studentList:[],
            clazzId: '',
            week: '1',
            termId: ''
        };
        this.studentCheckboxOnChange = this.studentCheckboxOnChange.bind(this);
        this.isHaveSameStudentId = this.isHaveSameStudentId.bind(this);
        this.getClazzesByUserId = this.getClazzesByUserId.bind(this);
        this.getSemesterList = this.getSemesterList.bind(this);
    }

    componentDidMount(){
        document.title = '修改值日生';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var clazzId = locationSearchArray[0].split("=")[1];
        var termId = locationSearchArray[1].split("=")[1];
        var week = locationSearchArray[2].split("=")[1];
        var studentIds = locationSearchArray[3].split("=")[1];
        var dutyId = locationSearchArray[4].split("=")[1];
        var userId = locationSearchArray[5].split("=")[1];
       /* var termValue = [termId+''];
        var sValue = [clazzId+''];
        var asyncValue = [week+''];*/
        var weekData = [{value: '1', label: '星期一'},
            {value: '2', label: '星期二'},
            {value: '3', label: '星期三'},
            {value: '4', label: '星期四'},
            {value: '5', label: '星期五'},
            {value: '6', label: '星期六'},
            {value: '7', label: '星期日'}];
        this.getStudentListByClazz(clazzId,studentIds);
        this.getClazzesByUserId(userId);
        this.getSemesterList(userId);
        // this.setState({clazzId,week,termId,termValue,sValue,asyncValue,data:weekData,studentIds,dutyId});
        this.setState({clazzId,week,termId,data:weekData,studentIds,dutyId});
    }

    onPickerChange = (val) => {
        console.log("week:" + val);
        const d = [...this.state.data];
        const asyncValue = [...val];
        var week = val[0];

        this.setState({
            data: d,
            cols: 1,
            asyncValue,
            week
        });
    };

    onClassChange = (val) => {
        var clazzId = val[0];
        this.setState({sValue: val, clazzId});
    };

    onTermChange = (val) => {
        var termId = val[0];
        this.setState({termId,termValue:val});
    };


    studentCheckboxOnChange(val){
        console.log("studentCheckboxOnChange:"+val);
        this.buildStudentCheckedArray(val);
    }

    /**
     * 进入学生值日页面时，根据用户id获取当前用户的班级
     * @param userId
     */
    getClazzesByUserId(userId){
        var _this = this;
        var param = {
            "method": 'getClazzesByUserId',
            "userId": userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        response.forEach(function (clazz) {
                            var clazzId = clazz.id;
                            //班级
                            var clazzName = clazz.name;
                            //年级
                            var grade = clazz.grade;
                            var gradeName = grade.name;
                            var clazzJson = {
                                label: gradeName+clazzName,
                                // value: clazzId+"",
                                value: 14+"",
                            };
                            if(seasons[0]!=null && seasons[0]!=undefined){
                                seasons[0].push(clazzJson);
                            }
                        })

                    }
                }
                _this.setState({seasons});
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 进入学生值日页面时，根据用户id获取当前用户的班级
     * @param userId
     */
    getSemesterList(userId){
        var _this = this;
        var param = {
            "method": 'getSemesterList',
            "uid": userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    console.log(response);
                    if (response != null && response != undefined) {
                        response.forEach(function (term) {
                            var id = term.id;
                            var name = term.name;
                            var termJson = {
                                label: name,
                                value: id+"",
                            };
                            if(terms[0]!=null && terms[0]!=undefined){
                                terms[0].push(termJson);
                            }
                        })

                    }
                }
                _this.setState({seasons});
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 构建已选学生id的数组
     * @param checkedValue
     */
    buildStudentCheckedArray(checkedValue){
        var studentIdIndex = this.isHaveSameStudentId(checkedValue);
        if(studentIdIndex!=-1){
            studentCheckedArray.splice(studentIdIndex,1);
        }else{
            studentCheckedArray.push(checkedValue);
        }
    }

    /**
     * 因为mobile的checkbox组件没有选中状态的判断，只能获取到当前点击的item项目
     * 所以此处需要提供该函数判断当前选中的值在数组中是否存在，用来在buildStudentCheckedArray中进行判断，
     * 如果存在，则移除，否则则向数组中添加
     * @param checkedValue
     * @returns {number}
     */
    isHaveSameStudentId(checkedValue){
        var studentIdIndex = -1;
        for(var i=0;i<studentCheckedArray.length;i++){
            var stuId = studentCheckedArray[i];
            if(stuId == checkedValue){
                studentIdIndex = i;
                break;
            }
        }
        return studentIdIndex;
    }

    /**
     * 构建考勤数据json，保存学生的考勤数据
     */
    updateClassBrandStudentDuty=()=>{
        var stuStr = studentCheckedArray.join(",");
        var param = {
            "method": 'updateClassBrandStudentDuty',
            "dutyId": this.state.dutyId,
            "clazzId": this.state.clazzId,
            "week": this.state.week,
            "termId": this.state.termId,
            "dutyStudent": stuStr
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        Toast.success('保存成功！', 1);
                    }
                }
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 获取班级的学生列表
     * @param clazzId
     */
    getStudentListByClazz=(clazzId,studentIds)=>{
        var _this = this;
        var studentCheckboxItemList = [];
        studentCheckedArray = studentIds.split(",");
        var studentList = [
            { colUid: 23836, userName: '王丹蛋' },
            { colUid: 23991, userName: '美伦' },
            { colUid: 24827, userName: '邢国文' },
        ];

        studentList.forEach(function (student) {
            var studentId = student.colUid+'';
            var isDefaultChecked = false;
            if(studentCheckedArray.indexOf(studentId)!=-1){
                isDefaultChecked = true;
            }
            var checkBoxItem = <CheckboxItem key={studentId} defaultChecked={isDefaultChecked} onChange={() => _this.studentCheckboxOnChange(studentId)}>
                {student.userName}
            </CheckboxItem>;
            studentCheckboxItemList.push(checkBoxItem);
        })
        this.setState({studentCheckboxItemList});
    }

    render() {
        var _this = this;

        return (
            <div id="curriculumSchedule" style={{height: document.body.clientHeight}}>
                <WhiteSpace size="lg"/>
                <Picker
                    data={seasons}
                    title="请选择"
                    cascade={false}
                    value={this.state.sValue}
                    onOk={v => this.onClassChange(v)}
                >
                    <List.Item arrow="horizontal">班级</List.Item>
                </Picker>

                <WhiteSpace size="lg"/>
                <Picker
                    data={terms}
                    title="请选择"
                    cascade={false}
                    value={this.state.termValue}
                    onOk={v => this.onTermChange(v)}
                >
                    <List.Item arrow="horizontal">选择学期</List.Item>
                </Picker>

                <WhiteSpace size="lg"/>
                <Picker
                    data={this.state.data}
                    cols={1}
                    value={this.state.asyncValue}
                    onOk={v => this.onPickerChange(v)}
                >
                    <List.Item arrow="horizontal" onClick={this.onClick}>选择星期</List.Item>
                </Picker>

                <WhiteSpace size="lg"/>
                <List renderHeader={() => 'CheckboxItem demo'}>
                    {_this.state.studentCheckboxItemList}
                </List>
                <Button type="primary" onClick={this.updateClassBrandStudentDuty}>提交</Button>
            </div>
        );
    }
}
