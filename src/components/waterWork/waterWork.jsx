import React from 'react';
import "./waterWork.less";

import { Tabs, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
function renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
export default class waterWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initData: [
                {
                    "homework": {
                        "id": 1,           // 作业的id 
                        "teacher": {
                            "userName": "章三"    // 布置作业的人名
                        },

                        "topic": {
                            "content": "hahhahahahahah"     // 作业内容
                        },

                        "questionCount": 20 // 作业有几道题 
                    },
                    "index": 1,              // 作业的第几道题
                    "answerTotalCount": 40,   // 答题总人数
                    "answerCount": 30       // 实际答题的人数
                },
                {
                    "homework": {
                        "id": 2,          // 作业的id 
                        "teacher": {
                            "userName": "李四"    // 布置作业的人名
                        },

                        "topic": {
                            "content": "heheheheheh"     // 作业内容
                        },

                        "questionCount": 30 // 作业有几道题 
                    },
                    "index": 2,              // 作业的第几道题
                    "answerTotalCount": 40,   // 答题总人数
                    "answerCount": 30        // 实际答题的人数
                }
            ],
            htmlList: []
        }
    }

    componentDidMount() {
        var _this = this;
        var arr = [];
        _this.state.initData.forEach((v, i) => {
            let html = <div>
                <div>作业内容:{v.homework.topic.content}</div>
                <div>老师：{v.homework.teacher.userName}</div>
                <div className="water" onClick={this.toWaterDetail.bind(this, v.homework.id)} >
                    <div>{v.answerCount / v.answerTotalCount}</div>
                    <span>第{v.index}题</span>
                </div>
            </div>
            arr.push(html)
        })
        _this.setState({
            htmlList: arr
        })

        // this.getHomeworkData();
    }
    /**
     * 获取数据
     */
    // getHomeworkData() {
    //     var param = {
    //         "method": '',
    //     };
    //     WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
    //         onResponse: function (result) {
    //             if (result.msg == '调用成功' || result.success == true) {

    //             }
    //         },
    //         onError: function (error) {
    //             // message.error(error);
    //         }
    //     });
    // }

    /**
     * 跳转原生水滴页面
     * @param {*} id 
     */
    toWaterDetail(id) {
        console.log(id)
    }


    onScroll(e){
        console.log("123")
    }
    render() {
        var _this = this;
        const tabs = [
            { title: 'First Tab' },
            { title: 'Second Tab' },
            { title: 'Third Tab' },
        ];

        const TabExample = () => (
            <div>
                <WhiteSpace />
                <StickyContainer>
                    <Tabs tabs={tabs}
                          initalPage={'t2'}
                          renderTabBar={renderTabBar}
                    >
                        <div className="calm"  onScroll={this.onScroll} style={{ display: 'block', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            <p>111Content of first tab</p>
                            <p>
                                222Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <br />
                            <p>
                                333Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                444 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                            </p>
                            <p>
                                555Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                666 of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                77 of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                        </div>
                        <div style={{ display: 'block', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            <p>111Content of first tab</p>
                            <p>
                                222Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <br />
                            <p>
                                333Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                444 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                            </p>
                            <p>
                                555Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                666 of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                77 of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                        </div>
                        <div style={{ display: 'block', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            <p>111Content of first tab</p>
                            <p>
                                222Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            </p>
                            <br />
                            <p>
                                333Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            Content of first tab
                            </p>
                            <p>
                                444 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                                 Content of first tab
                            </p>
                            <p>
                                555Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                                Content of first tab
                            </p>
                            <p>
                                <p>
                                    666 of first tab
                                    Content of first tab
                                    Content of first tab
                                    Content of first tab
                                    Content of first tab
                                    Content of first tab
                                    Content of first tab
                            </p>
                                <p>
                                    <p>
                                        77 of first tab
                                        Content of first tab
                                        Content of first tab
                                        Content of first tab
                                        Content of first tab
                                        Content of first tab
                                        Content of first tab
                            </p>
                                </p>
                            </p>
                        </div>
                    </Tabs>
                </StickyContainer>
                <WhiteSpace />
            </div>
        );
        return (
            <div id="waterWorkContent">
                {
                    _this.state.htmlList
                }
                <TabExample

                />
            </div>
        )
    }
}