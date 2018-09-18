import React from "react";

var calm;
export default class classListMobile extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            classListData: []
        }
    }
    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var id = locationSearchArray[0].split("=")[1];
        calm.getClazzesByUserId(id)
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
    /** */
    toDetail = (v) => {
        var url = WebServiceUtil.mobileServiceURL + "classListDetail?className=" +v.grade.name + v.name+"&classId="+v.id;

        var data = {
            method: 'openNewPage',
            url: url,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {
        return (
            <div>班级列表
                {
                    calm.state.classListData.length == 0 ?
                    <div>
                        空的
                    </div>
                    :
                    calm.state.classListData.map((v, i) => {
                        return (
                            <div>
                                <div onClick={calm.toDetail.bind(this, v)}>{v.grade.name + v.name}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}