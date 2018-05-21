import React from "react";

export default class tableItemDetil extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //params:{"method":"viewCourseTableItemPage","sid":1,"w":"5","cid":819,"rid":-1,"uid":"23836"}
        this.viewCourseTableItemPage()
    }

    viewCourseTableItemPage() {
        var param = {
            "method": 'viewCourseTableItemPage',
            "sid": this.state.sValue[1],
            "w": v[0],
            "cid": this.state.sValue[0],
            "rid": -1,
            "uid": JSON.parse(localStorage.getItem('loginUserSchedule')).colUid
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var arr = result.response[0].courseList
                    _this.setState({classTableArray: arr});
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    render() {
        return (
            <div id="tableItemDetil" style={{height: document.body.clientHeight}}>
                1234
            </div>
        )
    }
}