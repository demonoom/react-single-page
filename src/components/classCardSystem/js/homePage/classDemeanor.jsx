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

    componentWillReceiveProps(nextProps) {
        // jsonObject.put("command", "classDemeanor");
        // jsonObject.put("cid", cid);
        var clazzId = localStorage.getItem("clazzId");
        if (nextProps.classCommand.command == "classDemeanor" && nextProps.classCommand.data.cid == clazzId) {
            this.getClassDemeanorInfo(clazzId);
            this.getClassRewardInfo(clazzId);
        }
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
            "type": 1
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

                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    var stuImgTag = <div className='videoDiv'>
                                                       <i></i>
                                                        <video style={{width: '100%'}}
                                                               onDoubleClick={_this.videoOnClick.bind(this, classDemeanor)}
                                                               src={classDemeanor.imagePath.split('?')[0]}>
                                                        </video>
                                                    </div>
                                } else {
                                    var stuImgTag = <img style={{width: '100%', height: '100%'}} id={classDemeanor.id}
                                                         src={classDemeanor.imagePath}/>;
                                }
                                classDemeanorList.push(stuImgTag);
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
            "type": 2
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

                                    if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                        var stuImgTag =
                                            <div className='videoDiv'>
                                            <i></i>
                                            <video style={{width: '100%'}}
                                                               onDoubleClick={_this.videoOnClick.bind(this, classDemeanor)}
                                                            src={classDemeanor.imagePath.split('?')[0]}></video>
                                            </div>
                                    } else {
                                        var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                                             id={classDemeanor.id}
                                                             src={classDemeanor.imagePath}/>;
                                    }
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

    /**
     * 视频被点击
     * 弹出窗口,播放视频
     */
    videoOnClick = (obj) => {
        this.props.playVideo(obj.imagePath.split('?')[0])
    }

    render() {
        var clazzDemeanor = <Carousel className="space-carousel class_mien1"
                                      frameOverflow="visible"
                                      cellSpacing={12}
                                      slideWidth={0.25}
                                      autoplay={true}
                                      infinite
                                      dots={false}
                                      beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                                      afterChange={index => this.setState({slideIndex: index})}
        >
            {this.state.classDemeanorList}
        </Carousel>;
        var classReward = <Carousel className="space-carousel class_mien2"
                                    frameOverflow="visible"
                                    cellSpacing={12}
                                    slideWidth={0.45}
                                    autoplay={true}
                                    infinite
                                    dots={false}
                                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                                    afterChange={index => this.setState({slideIndex: index})}
        >
            {this.state.classRewardList}
        </Carousel>;
        if (WebServiceUtil.isEmpty(this.state.classDemeanorList) === true || this.state.classDemeanorList.length == 0) {
            clazzDemeanor = <div className="demeanor_list1">
                <div className="empty_center">
                    <div className="empty_icon empty_honor"></div>
                    <div className="empty_text">暂无荣誉</div>
                </div>
            </div>
        }
        if (WebServiceUtil.isEmpty(this.state.classRewardList) === true || this.state.classRewardList.length == 0) {
            classReward = <div className="demeanor_list2">
                <div className="empty_center">
                    <div className="empty_icon empty_activity"></div>
                    <div className="empty_text">暂无活动</div>
                </div>
            </div>
        }

        return (
            <div id="classDemeanor" className="home_card classDemeanor_height">
                <h3 className="home_title">班级风采</h3>
                <div className="demeanor_margin">
                    {clazzDemeanor}
                    {classReward}
                </div>
            </div>
        );
    }
}
