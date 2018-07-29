import React from "react";
import { InputItem } from 'antd-mobile';
var teacherV;
export default class New extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {};
    }
    componentDidMount() {
        // this.autoFocusInst.focus();
    }
    
    getValue() {
        console.log("111")
        // console.log(this.state.value, "value")
    }

    render() {
        // var _this = this;
        console.log("hello")
        return (
            <div>
                <InputItem
                    placeholder="请输入搜索关键字"
                    // ref={el => this.labelFocusInst = el}
                    onChange={v => teacherV.setState({
                        searchValue: v
                    })}
                >
                    {/* <div onClick={() => this.labelFocusInst.focus()}>AR教材</div> */}
                </InputItem>
                <div onClick={teacherV.getValue}>搜索</div>
            </div>
        )
    }
}