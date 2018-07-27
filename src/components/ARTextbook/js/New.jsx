import React from "react";
import { InputItem, Tag } from 'antd-mobile';
var teacherV;
export default class New extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            searchData: [],
            arrDiv:[]
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
    tagChange(id,selected){
        var arr = [];
        if(selected){
            arr.push(id)
            teacherV.setState({
                arrDiv:teacherV.state.arrDiv.concat(arr)
            },()=>{
                // console.log(teacherV.state.arrDiv,"arrDiv")
            })
        }
        if(!selected){
            var index = teacherV.state.arrDiv.indexOf(id);
            if (index > -1) {
                teacherV.state.arrDiv.splice(index, 1);
            }
        }

    }

    submitTagArr(){
        console.log(teacherV.state.arrDiv,"finish")
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
                            <Tag data-seed={v.id} onChange={teacherV.tagChange.bind(this,v.id)}>{v.content}</Tag>
                        )
                    })
                }
                <div onClick={teacherV.submitTagArr}>确定</div>
            </div>
        )
    }
}