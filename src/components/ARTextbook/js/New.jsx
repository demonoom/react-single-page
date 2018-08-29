import React from "react";
import { InputItem, Tag } from 'antd-mobile';
var teacherV;
export default class New extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            searchData: [],
            arrIdDiv:[]
        };
    }
    componentDidMount() {
        // this.autoFocusInst.focus();
    }

    /**
     * 搜索关键字结果
     */
    searchARBookTag() {
        var param = {
            "method": 'searchARBookTag',
            "adminId": 23836,
            "keyword": teacherV.state.searchValue,
            "pn": -1
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    teacherV.setState({
                        searchData:result.response
                    })
                }
            },
            onError: function (error) {
                Toast.fail('删除失败');
            }
        });
    }


    tagChange(v,selected){
        var arrID = [];
        var arrText = [];
        if(selected){
            arrID.push(v.id)
            arrText.push(v.content)
            teacherV.setState({
                arrIdDiv:teacherV.state.arrIdDiv.concat(arrID)
            },()=>{
                // console.log(teacherV.state.arrDiv,"arrDiv")
            })
        }
        if(!selected){
            var index = teacherV.state.arrIdDiv.indexOf(id);
            if (index > -1) {
                teacherV.state.arrIdDiv.splice(index, 1);
            }
        }

    }

    submitTagArr(){
        console.log(teacherV.state.arrIdDiv,"finish")
    }
    render() {
        return (
            <div>
                <InputItem
                    placeholder="请输入关键字"
                    onChange={v => teacherV.setState({
                        searchValue: v
                    })}
                >
                </InputItem>
                <div onClick={teacherV.searchARBookTag}>搜索</div>
                {
                    teacherV.state.searchData.map((v,i)=>{
                        console.log(v,"V")
                        return (
                            <Tag data-seed={v.id} onChange={teacherV.tagChange.bind(this,v)}>{v.content}</Tag>
                        )
                    })
                }
                <div onClick={teacherV.submitTagArr}>确定</div>
            </div>
        )
    }
}