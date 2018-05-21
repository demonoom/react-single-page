import React from 'react';
import {Carousel} from 'antd-mobile';

var demeanor;

export default class classDemeanor extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {
        var clazzId = localStorage.getItem("clazzId");
        this.getClassDemeanorInfo(clazzId);
        this.getClassRewardInfo(clazzId);
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
            "type":1
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
                                    var stuImgTag=<img style={{width:'80px',height:'80px'}} id={classDemeanor.id} src={classDemeanor.imagePath}/>;
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

    /**
     * 班牌值日今日信息查询
     * @param clazzId
     */
    getClassRewardInfo(clazzId) {
        var _this = this;
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
            "type":2
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var classRewardList = [];
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            _this.setState({"isLoadingLeft": false})
                        } else {
                            var classRewards = result.response;
                            classRewards.forEach(function (classDemeanor) {
                                if (classDemeanor != null && classDemeanor != undefined) {
                                    var stuImgTag=<img style={{width:'80px',height:'80px'}} id={classDemeanor.id} src={classDemeanor.imagePath}/>;
                                    classRewardList.push(stuImgTag);
                                }
                            })
                        }
                    }
                }
                _this.setState({classRewardList});
            },
            onError: function (error) {
            }
        });
    }

    render() {
        return (
            <div id="classDemeanor">
                <div>班级风采</div>
                <div>
                    <Carousel className="space-carousel"
                              frameOverflow="visible"
                              cellSpacing={1}
                              slideWidth={0.8}
                              autoplay={true}
                              infinite
                              dots={false}
                              beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                              afterChange={index => this.setState({ slideIndex: index })}
                    >
                        {this.state.classDemeanorList}
                    </Carousel>
                    <Carousel className="space-carousel"
                              frameOverflow="visible"
                              cellSpacing={1}
                              slideWidth={0.8}
                              autoplay={true}
                              infinite
                              dots={false}
                              beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                              afterChange={index => this.setState({ slideIndex: index })}
                    >
                        {this.state.classRewardList}
                    </Carousel>
                </div>
            </div>
        );
    }
}
