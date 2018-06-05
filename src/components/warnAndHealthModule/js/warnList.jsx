import React from 'react';
import '../css/warnList.less';
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

var _this;

export default class warnList extends React.Component {

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            teacherId: '',
        }

    }

    componentWillMount() {
        document.title = "预警数据列表";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var teacherId = locationSearch.split("&")[0].split('=')[1];
        this.setState({teacherId});
    }

    componentDidMount() {
        this.findByCourseTableItemByUserId(this.state.teacherId);
    }

    componentWillUnmount() {

    }

    findByCourseTableItemByUserId(id){    //根据教师id获取课表
        var _this = this;
        var param = {
            "method": 'findByCourseTableItemByUserId',
            "userId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    this.setState({
                        listData:result.response,
                    })
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
            }
        });
    }


    toWarning(id,openTime,closeTime){
        if(id){
            let url;
            url = encodeURI(WebServiceUtil.mobileServiceURL + "warning?id="+id+"&openTime="+openTime+"&closeTime="+closeTime);
            var data = {
                method: 'openNewPage',
                url: url
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        }else{
            Toast.fail('参数有误');
        }
    }



    render() {
        let item = this.state.listData;
        let listItem = '';
        let arr = [];
        for(let k in item){
            // console.log(item)
         // listItem = <div style={{
         //     textAlign:'center',
         //     padding:'10px 0px',
         //     borderBottom:'1px solid #ccc'
         // }} onClick={this.toWarning.bind(this,item[k].id,item[k].openTimeString,item[k].closeTimeString)}>
         //     {item[k].courseName}
         //     <div>开课时间: {item[k].openTimeString} - {item[k].closeTimeString}</div>
         // </div>;
         listItem = <div className="list_item" onClick={this.toWarning.bind(this,item[k].id,item[k].openTimeString,item[k].closeTimeString)}>
             <div className="" style={{
                 display:'inline-block',
                 width:'33.333333%',
                 textAlign:'center'
             }}>{item[k].openTimeString} - {item[k].closeTimeString}</div>
             <div style={{
                 display:'inline-block',
                 width:'33.333333%',
                 textAlign:'center'
             }}>{item[k].courseName}</div>
             <div style={{
                 display:'inline-block',
                 width:'33.333333%',
                 textAlign:'center'
             }}>{item[k].clazz.name}</div>
         </div>
         arr.push(listItem);
        }
        return (
            <div id="warnList" style={{height: this.state.clientHeight}}>
                <div className="list_head">
                    <div className="" style={{
                        display:'inline-block',
                        width:'33.333333%',
                        textAlign:'center'
                    }}>时间</div>
                    <div style={{
                        display:'inline-block',
                        width:'33.333333%',
                        textAlign:'center'
                    }}>科目</div>
                    <div style={{
                        display:'inline-block',
                        width:'33.333333%',
                        textAlign:'center'
                    }}>班级</div>
                </div>
                {arr}
            </div>
        );
    }
}
