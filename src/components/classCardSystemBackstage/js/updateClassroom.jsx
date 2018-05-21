import React from 'react';
import {
    Toast,
    InputItem,
    List,
    Radio,
    ListView,
    Modal,
    PullToRefresh,
    Checkbox, Flex
} from 'antd-mobile';
import '../css/updateClassroom.less'
import { ucs2 } from 'punycode';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
var updateCM;

export default class updateClassroom extends React.Component {

    constructor(props) {
        super(props);
        updateCM = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            chooseResultDiv: 'none',
            searchData: [],
            selectData: [],
            calmFlag:false
        };
    }
   
    onDataChange = (value) => {
        updateCM.setState({
            gradeNameValue:value
        });
        
    };

    
   

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '绑定教室信息';
        var uid = JSON.parse(localStorage.getItem("uIdKey")).uidKey;
        this.setState({ "uid": uid })
        this.viewClassRoomPage(uid);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', updateCM.onWindowResize)
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classIdBynoom = locationSearch.split("&")[0].split("=")[1];
        this.setState({classIdBynoom});
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', updateCM.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            updateCM.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }

    /**
     * 展示班级页面信息
     */
    viewClassRoomPage(uid) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var PageNo = this.state.defaultPageNo;
        var param = {
            "method": 'viewClassRoomPage',
            "uid": uid,
            "pn": PageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    updateCM.state.selectData = result.response
                    var arr = result.response;
                    var pager = result.pager;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    if (arr.length > 0) {
                        if (pager.pageCount == 1 && pager.rsCount < 30) {
                            isLoading = false;
                        } else {
                            isLoading = true;
                        }
                    } else {
                        isLoading = false;
                    }
                    _this.initData = _this.initData.concat(arr);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: isLoading,
                        refreshing: false
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }



    /**
     * 开启添加教室管理的界面
     */
    addRing = () => {
        $('.tableDiv').hide("fast");
    };

    /**
     * searchClassroomName搜索班级的名称
     */
    searchClassroomName() {
        var _this = this;
        var param = {
            "method": 'searchClazz',
            "aid": updateCM.state.uid,
            "keyWord": $('.gradeName .am-input-control input').val(),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {

                    updateCM.setState({
                        searchData: result.response,
                        chooseResultDiv: "block",
                        classId: result.response[0].id
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
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
        var param;

        if(this.state.calmFlag) {
            param = {
                "method": 'updateClassRoom',
                "cr": {
                    "creatorId": updateCM.state.uid,
                    "name": updateCM.state.classroomValue,
                    "classId": updateCM.state.classId,
                    "id":updateCM.state.classIdBynoom
                }
    
            };
        } else{
            param = {
                "method": 'updateClassRoom',
                "cr": {
                    "creatorId": updateCM.state.uid,
                    "name": updateCM.state.classroomValue,
                    "id":updateCM.state.classIdBynoom
                }
    
            };
        }
    
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    $('.tableDiv').show("fast");
                    _this.state.gradeNameValue = '';
                    _this.state.classroomValue = '';
                    _this.setState({ chooseResultDiv: 'none' });
                    _this.viewClassRoomPage(_this.state.uid);
                    $('.bindGrade span').removeClass("am-checkbox-checked");
                    $('.gradeName').css({
                        display: 'none'
                    })
                    Toast.success('添加成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finish',
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


    /**
     * 获取绑定班级的状态，是否显示
     */
    getbindGradeState(e) {
        if (e.target.checked) {
            this.setState({calmFlag:true,
            gradeNameValue:''})
            $('.gradeName').css({
                display: 'block'
            })
        } else {
            this.setState({calmFlag:false,
                chooseResultDiv:'none'
            })
            $('.gradeName').css({
                display: 'none'
            })
            
        }
    }
    /**
     * 输入框改变的回调
     */
    inputOnChange(e) {
        this.setState({ classroomValue: e });
    }
    inputChange(e) {
        this.setState({ gradeNameValue: e })
    }
    
    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({ isLoadingLeft: true, defaultPageNo: currentPageNo });
        _this.viewClassRoomPage(_this.state.uid);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            isLoadingLeft: true,
        });
    };

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({ defaultPageNo: 1, refreshing: true, isLoadingLeft: true });
        this.viewClassRoomPage(this.state.uid);
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
                                onChange={this.inputOnChange.bind(this)}
                                value={this.state.classroomValue}
                            >教室名称<i className='redStar'>*</i></InputItem>
                        </div>
                        <div className="bindGrade">
                            <AgreeItem data-seed="logId" onChange={e => this.getbindGradeState(e)}>
                                绑定班级
                            </AgreeItem>
                        </div>
                        <div className='gradeName' style={{ display: "none" }}>
                            <InputItem
                                placeholder="请输入班级名称"
                                data-seed="logId"
                                onChange={this.inputChange.bind(this)}
                                value={this.state.gradeNameValue}
                            >班级名称<i className='redStar'>*</i></InputItem>
                            <div id='stIcon' className='stIcon' onClick={this.searchClassroomName}>
                                <img  src={require('../imgs/down.png')}/>
                            </div>


                        </div>
                        <div className='chooseResult'
                            style={{ display: this.state.chooseResultDiv }}>
                            <List>
                                {updateCM.state.searchData.map(i => (
                                    <RadioItem key={i.id} checked={ updateCM.state.gradeNameValue === i.name}  onChange={() => this.onDataChange(i.name)}>
                                        {i.name}
                                    </RadioItem>
                                ))}
                            </List>
                        </div>
                    </List>
                    <div className="bottomBox">
                        <span className="bind" onClick={this.binding}>提交</span>
                    </div>

                </div>
            </div>
        );
    }
}
