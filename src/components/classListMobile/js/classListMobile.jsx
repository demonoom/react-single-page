import React from "react";
import { List, Switch,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import '../css/classListMobile.less'
var calm;
export default class classListMobile extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            classListData: [],
            initialValue:false
        }
    }
    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var id = locationSearchArray[0].split("=")[1];
        // calm.getClazzesByUserId(id)
        calm.setState({
            userId:id
        })
        calm.getBraceletOpeningClazzesByUserId(id)
    }

    /**
     *获取班级的ID
     */
    getClazzesByUserId(id) {
        var _this = this;
        var param = {
            "method": 'getClazzesByUserId',
            "userId": id
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "班级列表")
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        // var arr = [];
                        // result.response.forEach(function (v, i) {
                        //     arr.push({
                        //         value: v.id, label: v.name
                        //     })
                        // })
                        calm.setState({ classListData: result.response })
                    }
                }
            },
            onError: function (error) {
                message.error(error)
            }
        });
    }
    /**
     *获取班级开课
     */
    getBraceletOpeningClazzesByUserId(id) {
        var _this = this;
        var param = {
            "method": 'getBraceletOpeningClazzesByUserId',
            "userId": id
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "userID")
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        // var arr = [];
                        // result.response.forEach(function (v, i) {
                        //     arr.push({
                        //         value: v.id, label: v.name
                        //     })
                        // })
                        calm.setState({ classListData: result.response })
                    }
                }
            },
            onError: function (error) {
                message.error(error)
            }
        });
    }
    /** */
    toDetail = (v) => {
        if(!calm.state.initialValue){
            Toast.info("请先开启课堂监测",1)
            return
        }
        if(v.status){
            var url = WebServiceUtil.mobileServiceURL + "classListDetail?className=" + v.clazz.grade.name + v.clazz.name + "&classId=" + v.clazz.id;
            var data = {
                method: 'openNewPage',
                url: url,
            };
    
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        }else {
            Toast.info("该班级暂未开课",1)
        }
    }

    /**
     * 开启和关闭
     * @param checked
     */
    getChatMsg(checked) {
        calm.setState({
            initialValue:checked
        })
    }
    render() {
        let SwitchExample = (props) => {
            const {getFieldProps} = props.form;
            return (
                <List>
                    <List.Item
                        extra={<Switch
                            {...getFieldProps('Switch8', {
                                initialValue: calm.state.initialValue,
                                valuePropName: 'checked',
                            })}
                            platform="ios"
                            onClick={(checked) => {
                                calm.getChatMsg(checked)
                            }}
                        />}
                    >开启手环监测进入课堂</List.Item>
                </List>
            );
        };
        SwitchExample = createForm()(SwitchExample);
        return (
            <div id='classListMobile'>
                <SwitchExample />
                <div className='listCont'>
                    {
                        calm.state.classListData.length == 0 ?
                            <div className='empty'>
                                暂无数据
                            </div>
                            :
                            calm.state.classListData.map((v, i) => {
                                return (
                                    <div className='line_public item textOver'>
                                        <div className={v.status ? "black":"gray"}>
                                            <span onClick={calm.toDetail.bind(this, v)}>{v.clazz.grade.name + v.clazz.name}</span>
                                            <span className='course'>{v.courseItem ? v.courseItem.courseName:""}课</span>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>

            </div>
        )
    }
}