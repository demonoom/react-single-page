import React from 'react';
import {WingBlank, Toast,Tabs,Badge} from 'antd-mobile';
import '../css/classPractice.less';
var tabs = [
    { title: "题目统计" },
    { title: "正确率"},
    { title: "答题时间"},
];
export default class classPractice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topicData:[],
            correctData:[],
            answerTime:[],
            topicDataInStu:[],
            showNamesBox:false,
            namesHtml:'',
            userType:'TEAC'
        }
    }

    componentWillMount() {
        document.title = '课堂练习统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var colUid = searchArray[0].split('=')[1];
        var vid = searchArray[1].split('=')[1];
        this.setState({
            userId : colUid,
            vid: vid,
        },()=>{
            this.getSubjectsResultByVid();

        })
    }




    /**
     * 根据用户id和虚拟课堂vid查询当前课堂上的答题情况,进行题目统计
     */
    getSubjectsResultByVid() {
        var param = {
            "method": 'getSubjectsResultByVid',
            "userId": this.state.userId,
            "vid": this.state.vid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (result) => {
                if (result.success == true && result.msg == '调用成功') {
                    var response = result.response;
                    console.log(response);
                    this.setState({
                        userType: response.user.colUtype
                    },()=>{
                        if(this.state.userType == 'TEAC'){
                            tabs = [
                                { title: "题目统计" },
                                { title: "正确率"},
                                { title: "答题时间"},
                            ];
                            this.setState({
                                subjectCount: response.subjectCount,
                                pushDate: WebServiceUtil.formatHM(response.pushDate),
                                topicData: response.subjectInfoList || [],
                                className: response.clazzInfo?response.clazzInfo.clazzName:'暂无班级',
                                topicDataInStu:[]
                            });
                            this.getSubjectScoreList();
                            this.getStudentClassTime();
                        }else{
                            tabs = [
                                { title: "答题情况" },
                                { title: "成绩排名"},
                                { title: "答题时间"},
                            ];
                            this.setState({
                                subjectCount: response.subjectCount,
                                pushDate: WebServiceUtil.formatYMD(response.pushDate),
                                // topicDataInStu: response.subjectInfoList || [],
                                className: response.user.userName,
                                topicData:[]
                            });
                            this.getStudentClassSubjectAnswerInfoList();
                            this.getSubjectScoreList();
                            this.getStudentClassTime();
                        }
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 完成题目正确率统计
     */
    getSubjectScoreList() {
        var param = {
            "method": 'getSubjectScoreList',
            "userId": this.state.userId,
            "vid": this.state.vid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (result) => {
                if (result.success == true && result.msg == '调用成功') {
                    var response = result.response;
                    console.log(response,'正确率');
                    this.setState({
                        correctData: response
                    })

                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 完成学生答题用时统计
     */
    getStudentClassTime() {
        var param = {
            "method": 'getStudentClassTime',
            "userId": this.state.userId,
            "vid": this.state.vid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (result) => {
                if (result.success == true && result.msg == '调用成功') {
                    var response = result.response;
                    console.log(response,'答题统计');
                    this.setState({
                        answerTime:response
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 查询当前学生自己的答题情况
     */
    getStudentClassSubjectAnswerInfoList() {
        var param = {
            "method": 'getStudentClassSubjectAnswerInfoList',
            "userId": this.state.userId,
            "vid": this.state.vid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (result) => {
                if (result.success == true && result.msg == '调用成功') {
                    var response = result.response;
                    console.log(response,'学生答题情况');
                    this.setState({
                        topicDataInStu: response
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    //展示姓名半屏
    showNames(html,type){
        this.setState({
            showNamesBox:true,
        })
        console.log(html);
        this.setState({
            namesHtml: html
        })
        console.log(type);
        // switch(type){
        //     case 'countAll':
        //         break;
        // }
    }


    //公布答案
    publishedAnswer(){
        console.log('公布答案');
        var param = {
            "method": 'publishClassSubjectAnswer',
            "vid": this.state.vid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (result) => {
                if (result.success == true && result.msg == '调用成功') {
                    Toast.success('已公布答案数:'+result.response);
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    maskClick(){
        console.log('maskClick');
        this.setState({
            showNamesBox:false,
        })
    }



    render() {
        return (
            <div className='classPractice'>

                <div style={{overflow:'hidden'}}>
                    <div style={{float:'left'}}>{this.state.className}</div><button style={this.state.userType == 'TEAC'?{display:'block',float:'right'}:{display:'none'}} onClick={this.publishedAnswer.bind(this)}>公布答案</button>
                </div>
                <div>
                    <div>题目总数: {this.state.subjectCount}</div>
                    <div>练习时间: {this.state.pushDate}</div>
                </div>

                <Tabs tabs={tabs}
                      initialPage={0}
                      // onChange={(tab, index) => { console.log('onChange', index, tab); }}
                      // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div className="topic_list">
                       {/*题目统计*/}
                        {this.state.topicData.map((value,index)=>{
                            return <div className="topic_item">
                                <div className="topicTitle" >
                                    {/*<span>{index+1}</span>.*/}
                                    <div dangerouslySetInnerHTML={{__html: value.shortContent}}></div>
                                </div>
                                <div className="topicAnswer">
                                    <span className="topicAnswer_left">正确答案: {value.answer}</span>
                                    <span className="topicAnswer_right">正确率: {value.rightPercent}%</span>
                                </div>
                                <div className="topic_table">
                                    {value.choosenes.map((value,index)=>{
                                        return <div className="table_item">
                                            <span>选项: {value.serial}</span>
                                            <span>选择率: {value.selectPercent}%</span>
                                            <span onClick={this.showNames.bind(this,value.chooseUserNames,'countAll')}>人数: {value.selectCount}</span>
                                        </div>
                                    })}
                                </div>
                                <div className="list_item_bottom">
                                    <span className="topic_submit" onClick={this.showNames.bind(this,value.submitNames,'submit')}>提交:{value.submit}</span>
                                    <span className="topic_right" onClick={this.showNames.bind(this,value.rightNames,'right')}>正确:{value.right}</span>
                                    <span className="topic_wrong" onClick={this.showNames.bind(this,value.wrongNames,'wrong')}>答错:{value.wrong}</span>
                                </div>
                            </div>
                        })}
                        {/*答题情况*/}
                        {this.state.topicDataInStu.map((value,index)=>{
                            return <div className="topic_item">
                                <div className="topicTitle" >
                                    {/*<span>{index+1}</span>.*/}
                                    <div dangerouslySetInnerHTML={{__html: value.shortContent}}></div>
                                </div>
                                {/*<div>*/}
                                    {/*<span>A:</span>*/}
                                    {/*<span>B:</span>*/}
                                    {/*<span>C:</span>*/}
                                    {/*<span>D:</span>*/}
                                {/*</div>*/}
                                <div>
                                    <div>正确答案:{value.rightAnswer}</div>
                                    <div style={value.result == '错误'?{color:'red'}:{color:'green'}}>我的答案:{value.answer}</div>
                                </div>
                            </div>
                        })}
                    </div>
                    <div>
                        <div style={this.state.correctData.length > 0?{display:'block'}:{display:'none'}}>
                            <span>编号</span>
                            <span>姓名</span>
                            <span>正确数</span>
                            <span>正确率</span>
                        </div>
                        {/*正确率*/}
                        {this.state.correctData.map((value,index)=>{
                            return <div>
                                <span>{index+1}</span>
                                <span>{value.userName}</span>
                                <span>{value.right}</span>
                                <span>{(value.right/value.total)*100}%</span>
                            </div>
                        })}
                    </div>
                    <div>
                        {/*答题时间*/}
                        <div style={this.state.answerTime.length > 0?{display:'block'}:{display:'none'}}>
                            <span>编号</span>
                            <span>姓名</span>
                            <span>提交数目</span>
                            <span>花费时间</span>
                        </div>
                        {/*正确率*/}
                        {this.state.answerTime.map((value,index)=>{
                            return <div>
                                <span>{index+1}</span>
                                <span>{value.userName}</span>
                                <span>{value.score}</span>
                                <span>{value.userTimeFormat}</span>
                            </div>
                        })}
                    </div>
                </Tabs>
                <div className="names_box" style={this.state.showNamesBox?{transform:'translate(0%,0%)'}:{transform:'translate(0%,100%)'}}>
                    <div>
                        <div>此项选择的学生<span onClick={this.maskClick.bind(this)}>X</span></div>
                        {this.state.namesHtml}
                    </div>
                </div>
                <div className="mask" onClick={this.maskClick.bind(this)} style={this.state.showNamesBox?{display:'block',height: document.body.clientHeight}:{display:'none',height: document.body.clientHeight}}></div>
            </div>
        );
    }
}
