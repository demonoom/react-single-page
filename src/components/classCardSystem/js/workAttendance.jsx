import React from "react";
import "../css/workAttendance.less";

export default class workAttendance extends React.Component{
    constructor(props){
        super(props);
        
    }

    componentDidMount(){

    }
  

    render() {
        return (
            <div id="skin_primarySchool">
                <div id="workAttendance" style={{height: document.body.clientHeight}}>
                    <div className="workAttendanceL">
                        <h1>签到名单</h1>
                    </div>
                    <div className="workAttendanceM">
                        <h1>未签到名单</h1>
                    </div>
                    <div className="workAttendanceR">
                        <h1>迟到名单</h1>
                    </div>
                </div>
            </div>
        )
    }
}