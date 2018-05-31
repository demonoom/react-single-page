import React from 'react';
import {
    Toast,
    InputItem,
    List,
    Radio,
    PullToRefresh,
    Checkbox, Flex
} from 'antd-mobile';
import '../css/updateClassroom.less'
import { ucs2 } from 'punycode';

const RadioItem = Radio.RadioItem;
var updateCM;

export default class updateClassroom extends React.Component {

    constructor(props) {
        super(props);
        updateCM = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            chooseResultDiv: 'none',
            searchData: [],
            selectData: [],
            calmHeight: document.body.clientHeight - 190 
        };
    }

    onDataChange = (value, id) => {
        updateCM.setState({
            gradeNameValue: value,
            "classId": id
        });
    };

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classIdBynoom = locationSearch.split("&")[0].split("=")[1];
        this.viewClassRoom(classIdBynoom);
        this.setState({ classIdBynoom });
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '绑定教室信息';
        var uid = JSON.parse(localStorage.getItem("uIdKey")).uidKey;
        this.setState({ "uid": uid })
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', updateCM.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', updateCM.onWindowResize)
    }
    /**
     * 根据教室ID显示对应的信息
     * @param {*} roomId 
     */
    viewClassRoom(roomId) {
        var _this = this;
        var param = {
            "method": 'viewClassRoom',
            "id": roomId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    var clazzRoom = result.response
                    var roomName = clazzRoom.name;
                    var gradeName = clazzRoom.defaultBindedClazz.name;
                    var defaultId = clazzRoom.defaultBindedClazz.id;
                    _this.setState({
                        'classroomValue': roomName,
                        "gradeNameValue": gradeName,
                        "classId":defaultId
                    });
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });
    }
    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            updateCM.setState({ clientHeight: document.body.clientHeight,calmHeight: document.body.clientHeight - 190  });
        }, 100)
    }
    /**
     * searchClassroomName搜索班级的名称
     */
    searchClassroomName() {
        var _this = this;
        var param = {
            "method": 'searchClazz',
            "aid": updateCM.state.uid,
            "keyWord":updateCM.state.gradeNameValue,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    if(result.response.length === 0){
                        Toast.info('没有查找到该班级');
                    }
                    updateCM.setState({
                        chooseResultDiv: "block",
                        searchData: result.response,
                        classId: updateCM.state.classId
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });
    }
    /**
     * 点击提交时，确认绑定教室和班级
     */
    binding = () => {
        var _this = this;
        if (_this.state.gradeNameValue == '' || _this.state.classroomValue == '') {
            Toast.fail('请填写教室名称和班级名称', )
            return
        }
        var param = {
            "method": 'updateClassRoom',
            "cr": {
                "creatorId": updateCM.state.uid,
                "name": updateCM.state.classroomValue,
                "classId": updateCM.state.classId,
                "id": updateCM.state.classIdBynoom
            }
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    $('.tableDiv').show("fast");
                    _this.state.gradeNameValue = '';
                    _this.state.classroomValue = '';
                    _this.setState({ chooseResultDiv: 'none' });
                    Toast.success('修改成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finishForRefresh',
                        };
                        Bridge.callHandler(data, null, function (error) {
                        });
                    }, 1000)
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });

    }

    render() {
        var _this = this;
        return (
            <div id="updateClassroom" style={{ height: updateCM.state.clientHeight }}>
                <div className='addModel' style={{ height: updateCM.state.clientHeight }}>
                    <List>
                        <div className='classroomName'>
                            <InputItem
                                placeholder="请输入教室名称"
                                data-seed="logId"
                                onChange={v => {updateCM.setState({
                                    "classroomValue":v
                                })}}
                                value={this.state.classroomValue}
                            >教室名称<i className='redStar'>*</i></InputItem>
                        </div>
                        <div className='gradeName'>
                            <InputItem
                                placeholder="请输入班级名称"
                                data-seed="logId"
                                onChange={v => {
                                    updateCM.setState({
                                        "gradeNameValue":v,
                                        "classId":""
                                    })
                                }}
                                value={this.state.gradeNameValue}
                            >班级名称<i className='redStar'>*</i></InputItem>
                            <div id='stIcon' className='stIcon' onClick={this.searchClassroomName}>
                                <img src={require('../imgs/icon_search.png')} />
                            </div>
                        </div>
                        <div className='chooseResult'
                            style={{ display: this.state.chooseResultDiv,height: this.state.calmHeight  }}>
                            <List>
                                {updateCM.state.searchData.map(i => (
                                    <RadioItem key={i.id} checked={updateCM.state.gradeNameValue === i.name} onChange={() => this.onDataChange(i.name, i.id)}>
                                        {i.name}
                                    </RadioItem>
                                ))}
                            </List>
                        </div>
                    </List>
                    <div className="bottomBox submitBtn">
                        <span className="bind" onClick={this.binding}>提 交</span>
                    </div>
                </div>
            </div>
        );
    }
}
