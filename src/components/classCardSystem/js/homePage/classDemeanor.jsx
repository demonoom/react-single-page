import React from 'react';
import {} from 'antd-mobile';

var demeanor;

export default class classDemeanor extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {
        var clazzId = '819';
        this.getClassDemeanorInfo(clazzId);
    }

    componentDidMount() {

    }

    /**
     * 班牌值日今日信息查询
     * @param clazzId
     */
    getClassDemeanorInfo(clazzId) {
        var _this = this;
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var classDemeanorList = [];
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            _this.setState({"isLoadingLeft": false})
                        } else {
                            var classDemeanors = result.response;
                            classDemeanors.forEach(function (classDemeanor) {
                                if (classDemeanor != null && classDemeanor != undefined) {
                                    var stuImgTag=<div>
                                        <div><img style={{width:'80px',height:'80px'}} id={classDemeanor.id} src={classDemeanor.imagePath}/></div>
                                    </div>
                                    classDemeanorList.push(stuImgTag)
                                }
                            })
                        }
                    }
                }
                _this.setState({classDemeanorList});
            },
            onError: function (error) {
            }
        });
    }

    render() {
        return (
            <div id="classDemeanor"  className="home_card classDemeanor_height">
                <h3 className="home_title">班级风采</h3>
                <div>
                    <marquee direction="left">
                        {this.state.classDemeanorList}
                    </marquee>
                </div>
            </div>
        );
    }
}
