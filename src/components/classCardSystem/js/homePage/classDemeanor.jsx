import React from 'react';
import Slider from 'react-slick';

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

                                // console.log(classDemeanor);

                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    var stuImgTag = <div className='videoDiv'>
                                        <i onClick={_this.videoOnClick.bind(this, classDemeanor)}></i>
                                        <video style={{width: '100%'}}
                                               src={classDemeanor.imagePath.split('?')[0]}>
                                        </video>
                                    </div>
                                } else {

                                    if (classDemeanor.imagePath.indexOf('?') == -1) {
                                        var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                                             id={classDemeanor.id}
                                                             src={classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG}/>;
                                    } else {
                                        var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                                             id={classDemeanor.id}
                                                             src={classDemeanor.imagePath + '&' + WebServiceUtil.LARGE_IMG}/>;
                                    }
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
                                console.log(classDemeanor);
                                if (classDemeanor != null && classDemeanor != undefined) {

                                    if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                        var stuImgTag =
                                            <div className='videoDiv'>
                                                <i onClick={_this.videoOnClick.bind(this, classDemeanor)}></i>
                                                <video style={{width: '100%'}}
                                                       src={classDemeanor.imagePath.split('?')[0]}></video>
                                            </div>
                                    } else {

                                        if (classDemeanor.imagePath.indexOf('?') == -1) {
                                            var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                                                 id={classDemeanor.id}
                                                                 src={classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG}/>;
                                        } else {
                                            var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                                                 id={classDemeanor.id}
                                                                 src={classDemeanor.imagePath + '&' + WebServiceUtil.LARGE_IMG}/>;
                                        }
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

        const settings = {
            infinite: true,
            speed: 300,
            autoplaySpeed: 4500,
            slidesToShow: 3,
            sliderToScroll: 30,
            autoplay: true,
            arrows: false,
            pauseOnHover: true,
        };

        var clazzDemeanor = <Slider {...settings}>
            {this.state.classDemeanorList}
        </Slider>;

        var classReward = <Slider  {...settings}>
            {this.state.classRewardList}
        </Slider>;

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
                    <div className='clazzDemeanor'>
                        {clazzDemeanor}
                    </div>
                    <div className='classReward'>
                        {classReward}
                    </div>
                </div>
            </div>
        );
    }
}
