import React from 'react';
import {Tabs} from 'antd-mobile';
import '../css/LookAtTheAnswer.less'

var LookAtTheAnswer;

export default class lookAtTheAnswer extends React.Component {

    constructor(props) {
        super(props);
        LookAtTheAnswer = this;
        this.state = {
            nameArr: [],
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        document.title = '作答答案'
        Bridge.setShareAble("false");
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var tpId = searchArray[0].split('=')[1];
        this.viewFuzzyHomeworkResult(tpId)
    }

    /**
     *  学生作答模糊作业
     * @param tpId
     */
    viewFuzzyHomeworkResult(tpId) {
        var _this = this;
        var param = {
            "method": 'viewFuzzyHomeworkResult',
            "tpId": tpId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var res = result.response;
                    _this.buildSourceObj(res)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 构建tab
     * @param data
     */
    buildSourceObj(data) {
        var _this = this;
        var array = [];
        var arr = [];
        var ansItem;
        var ansContent = <div className="answerContNo">
            未作答
        </div>;
        var dataDefault = data[0]
        if (WebServiceUtil.isEmpty(data) == false) {
            data.forEach(function (v, i) {
                var obj = {
                    title: v.student.userName,
                    id: v.student.colUid,
                    answerList: v.answerList,
                    itemList: v.itemList,
                }
                array.push(obj)
            })

            for (var j = 0; j < dataDefault.itemList.length; j++) {
                ansItem = <div className="answerList">
                    <div>第{dataDefault.itemList[j].index + 1}题：</div>
                    {ansContent}
                </div>

                if (WebServiceUtil.isEmpty(dataDefault.answerList) == false) {
                    dataDefault.answerList.forEach(function (v, i) {
                        if (v.item.index == dataDefault.itemList[j].index) {
                            if (v.type == 1 || v.type == 3) {
                                var ansIndexItem = <div className="">
                                    <div className="answerCont">{v.textContent}</div>
                                </div>
                            } else {
                                var imgArr = v.picContent.split(',');
                                var ansImgArr = [];
                                var audioArr = v.audioContent.split(',')
                                var ansAudioArr = [];
                                if (imgArr.length != 0 && WebServiceUtil.isEmpty(v.picContent) == false) {
                                    imgArr.forEach(function (item, index) {
                                        ansImgArr.push(
                                            <span className="ansImg">
                                        <img className="empty_center" src={item}
                                             onClick={_this.imgOnClick.bind(this, item, v.picContent)}/>
                                    </span>
                                        )
                                    })
                                }
                                if (audioArr.length != 0 && WebServiceUtil.isEmpty(v.audioContent) == false) {
                                    audioArr.forEach(function (src, srcIndex) {
                                        ansAudioArr.push(
                                            <div className="ansAudio" onClick={_this.topicVoicePlay}>
                                                <div className="audio_left">
                                                    <audio
                                                        src={src}
                                                        controls="controls"
                                                        loop="false"
                                                        hidden="true"
                                                        className="audioNoom"
                                                    ></audio>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                var ansIndexItem = <div className="">
                                    <div className="answerCont"
                                         style={{display: WebServiceUtil.isEmpty(v.textContent) ? 'none' : 'block'}}
                                    >{v.textContent}</div>
                                    <div className="ansImgCont">{ansImgArr}</div>
                                    {ansAudioArr}
                                </div>
                            }
                            ansItem = <div className="answerList">
                                <div>第{dataDefault.itemList[j].index + 1}题：</div>
                                <div>
                                    {ansIndexItem}
                                </div>
                            </div>
                        }
                    })
                }
                arr.push(ansItem)
            }
        }
        this.setState({nameArr: array, ansArr: arr});
    }

    /**
     * tab切换
     * @param TabData
     * @param index
     */
    tabOnChange = (TabData, index) => {
        var _this = this
        var arr = [];
        var ansItem;
        var ansContent = <div className="answerContNo">
            未作答
        </div>;
        for (var j = 0; j < TabData.itemList.length; j++) {
            ansItem = <div className="answerList">
                <div>第{TabData.itemList[j].index + 1}题：</div>
                {ansContent}
            </div>

            if (WebServiceUtil.isEmpty(TabData.answerList) == false) {
                TabData.answerList.forEach(function (v, i) {
                    if (v.item.index == TabData.itemList[j].index) {
                        if (v.type == 1 || v.type == 3) {
                            var ansIndexItem = <div>
                                <div className="answerCont">{v.textContent}</div>
                            </div>
                        } else {
                            var imgArr = v.picContent.split(',');
                            var ansImgArr = [];
                            var audioArr = v.audioContent.split(',')
                            var ansAudioArr = [];
                            if (imgArr.length != 0 && WebServiceUtil.isEmpty(v.picContent) == false) {
                                imgArr.forEach(function (item, index) {
                                    ansImgArr.push(
                                        <span className="ansImg">
                                        <img className="empty_center" src={item}
                                             onClick={_this.imgOnClick.bind(this, item, v.picContent)}/>
                                    </span>
                                    )
                                })
                            }
                            if (audioArr.length != 0 && WebServiceUtil.isEmpty(v.audioContent) == false) {
                                audioArr.forEach(function (src, srcIndex) {
                                    ansAudioArr.push(
                                        <div className="ansAudio" onClick={_this.topicVoicePlay}>
                                            <div className="audio_left">
                                                <audio
                                                    src={src}
                                                    controls="controls"
                                                    loop="false"
                                                    hidden="true"
                                                    className="audioNoom"
                                                ></audio>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            var ansIndexItem = <div>
                                <div className="answerCont"
                                     style={{display: WebServiceUtil.isEmpty(v.textContent) ? 'none' : 'block'}}
                                >{v.textContent}</div>
                                <div className="ansImgCont">{ansImgArr}</div>
                                {ansAudioArr}
                            </div>
                        }
                        ansItem = <div className="answerList">
                            <div>第{TabData.itemList[j].index + 1}题：</div>
                            <div>
                                {ansIndexItem}
                            </div>
                        </div>
                    }
                })
            }
            arr.push(ansItem)
        }
        this.setState({ansArr: arr})
    }

    /**
     * 语音播放
     * @param e
     */
    topicVoicePlay(e) {
        var music = e.target.children[0].children[0];
        var music_btn = e.target.children[0];
        if (music.paused) {
            for (var i = 0; i < $('.audioNoom').length; i++) {
                if (!$('.audioNoom')[i].paused) {
                    $('.audioNoom')[i].pause();
                }
            }
            for (var i = 0; i < $('.audio_left_run').length; i++) {
                $('.audio_left_run')[i].className = 'audio_left'
            }
            music.play();
            music_btn.className = 'audio_left_run';
        }
        else {
            music.pause();
            music_btn.className = 'audio_left';
        }
    }

    /**
     * 查看图片
     * @param currentUrl
     * @param url
     */
    imgOnClick(currentUrl, url) {
        var dataObj = {};
        dataObj.method = 'showImage';
        dataObj.url = url.split(',').join('#');
        dataObj.currentUrl = currentUrl;
        Bridge.callHandler(dataObj, null, function (error) {
            console.log(error);
        })
    }

    render() {

        return (
            <div id="LookAtTheAnswer">
                <Tabs
                    tabs={this.state.nameArr}
                    renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5}/>}
                    onChange={this.tabOnChange}
                    swipeable={false}   //是否可以滑动内容切换
                    animated={true}     //是否开启切换动画
                    useOnPan={false}    //使用跟手滚动   禁用跟手滚动 但是开启动画与滑动切换 达到与原生的体验
                    destroyInactiveTab={false}   //销毁超出范围Tab
                >
                    <div
                        style={{
                            height: document.body.clientHeight
                        }}
                    >
                        <div className="answerContent">{this.state.ansArr}</div>
                    </div>
                </Tabs>
            </div>
        );
    }
}
