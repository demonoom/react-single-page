import React from 'react';
import fetch from 'dva/fetch'
import {Tabs, Flex, List, WingBlank, Toast} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import './reaultAnalysis.less';

// const mobileUrl = 'http://www.maaee.com/Excoord_For_Education/webservice';
const mobileUrl = 'http://192.168.1.230:9006/Excoord_ApiServer/webservice';

const tabs = [
    {title: '成绩分析'},
    {title: '题目分析'},
];

const dataF = {
    "success": true,
    "msg": "调用成功",
    "response": {
        "gradeName": "年级",
        "max": 135,
        "min": 0,
        "ave": 111.99337748344371,
        "excellentRate": 0.9668874172185431,
        "passingRate": 0.9960264900662251,
        "top5StudentList": [
            {
                "studName": "498",
                "studScore": 135
            },
            {
                "studName": "718",
                "studScore": 134
            },
            {
                "studName": "575",
                "studScore": 133
            },
            {
                "studName": "233",
                "studScore": 131
            },
            {
                "studName": "513",
                "studScore": 130
            }
        ],
        "clazzes": [
            {
                "clazzId": "1812",
                "order": 1,
                "clazzName": "1812",
                "clazzAve": 121.48979591836735
            },
            {
                "clazzId": "1811",
                "order": 2,
                "clazzName": "1811",
                "clazzAve": 120.15
            },
            {
                "clazzId": "1816",
                "order": 3,
                "clazzName": "1816",
                "clazzAve": 119.33
            },
            {
                "clazzId": "1813",
                "order": 4,
                "clazzName": "1813",
                "clazzAve": 117.43
            },
            {
                "clazzId": "1814",
                "order": 5,
                "clazzName": "1814",
                "clazzAve": 118.20408163265306
            },
            {
                "clazzId": "1815",
                "order": 6,
                "clazzName": "1815",
                "clazzAve": 116.42
            },
            {
                "clazzId": "1805",
                "order": 7,
                "clazzName": "1805",
                "clazzAve": 110.78888888888889
            },
            {
                "clazzId": "1803",
                "order": 8,
                "clazzName": "1803",
                "clazzAve": 109.67
            },
            {
                "clazzId": "1804",
                "order": 9,
                "clazzName": "1804",
                "clazzAve": 108.3
            },
            {
                "clazzId": "1809",
                "order": 10,
                "clazzName": "1809",
                "clazzAve": 109.12765957446808
            },
            {
                "clazzId": "1801",
                "order": 11,
                "clazzName": "1801",
                "clazzAve": 107.08888888888889
            },
            {
                "clazzId": "1802",
                "order": 12,
                "clazzName": "1802",
                "clazzAve": 106.5609756097561
            },
            {
                "clazzId": "1808",
                "order": 13,
                "clazzName": "1808",
                "clazzAve": 107.03260869565217
            },
            {
                "clazzId": "1806",
                "order": 14,
                "clazzName": "1806",
                "clazzAve": 105.96875
            },
            {
                "clazzId": "1807",
                "order": 15,
                "clazzName": "1807",
                "clazzAve": 105.44318181818181
            },
            {
                "clazzId": "1810",
                "order": 16,
                "clazzName": "1810",
                "clazzAve": 105.09782608695652
            }
        ],
        "topics": [
            {
                "name": "题目:1",
                "knowledgePoint": "正弦定理",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:2",
                "knowledgePoint": "求等差数列的公差",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:3",
                "knowledgePoint": "一元二次不等式求解逆用",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:4",
                "knowledgePoint": "等比数列求和公式应用",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:5",
                "knowledgePoint": "余弦定理，三角形的解的个数判断",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:6",
                "knowledgePoint": "均值不等式应用",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:7",
                "knowledgePoint": "等差前 项和最值",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:8",
                "knowledgePoint": "二次方程根的分布",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:9",
                "knowledgePoint": "函数与数列，递增数列的判断",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:10",
                "knowledgePoint": "数列的拓展应用，累加，拆项相消",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:11",
                "knowledgePoint": "等差数列的通项公式",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:12",
                "knowledgePoint": "余弦定理的实际应用",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:13",
                "knowledgePoint": "均值不等式的综合",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:14",
                "knowledgePoint": "等比数列的性质，函数与数列",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:15",
                "knowledgePoint": "多命题正误判断（跨章节知识应用）",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:16",
                "knowledgePoint": "正、余弦定理与解三角形",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:17",
                "knowledgePoint": "解二次不等式，大小比较，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:18",
                "knowledgePoint": "等差数列，等比数列，累加，分组求和",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:19",
                "knowledgePoint": "正、余弦定理与三角变换的综合",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:20",
                "knowledgePoint": "数列，不等式综合的实际应用题",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:21",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:22",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:23",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:24",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:25",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:26",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:27",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:28",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:29",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:30",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            },
            {
                "name": "题目:31",
                "knowledgePoint": "数列综合应用，错位相减，不等式恒成立",
                "hitPeopleCount": 755,
                "missPeopleCount": 0,
                "hitRate": 1
            }
        ]
    }
}

export default class resultAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top5StudentListArr: [],
            clazzesArr: [],
            topDataArr: [],
        }
    }

    componentDidMount() {
        document.title = '成绩分析';
        // var locationHref = window.location.href;
        // var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var searchArray = locationSearch.split("&");
        this.viewGradeAnalysis()
    }

    parseJSON(response) {
        return response.json();
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    /**
     * 查看试卷分析中的年级的结果
     */
    viewGradeAnalysis() {
        var _this = this;
        var param = {
            "method": 'viewGradeAnalysis',
            "taskId": 1,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        // var ret = dataF.response;
        // this.buildAnalysis(ret);

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                console.log(result);
                var ret = result.data.response;
                if (result.data.success == true && result.data.msg == '调用成功') {
                    //  获得数据
                    _this.buildAnalysis(ret);
                } else {
                    Toast.fail(result.data.msg, 1);
                }
            });
    }

    /**
     * 渲染年级分析结果
     * @param data
     */
    buildAnalysis(data) {
        var _this = this;
        console.log(data);
        var top5StudentList = data.top5StudentList;   //前五名
        var top5StudentListArr = []
        top5StudentList.forEach(function (v, i) {
            var li = <li><img src={require('./' + (i + 1) + '.png')}/>{v.studName}<span>{v.studScore}</span></li>;
            top5StudentListArr.push(li);
        });

        var clazzes = data.clazzes;   //班级排名
        var clazzesArr = [];
        clazzes.forEach(function (v, i) {
            var liClass = <li onClick={_this.turnToClassRel.bind(this, v.clazzId)}><b>{v.order}</b>{v.clazzName}</li>
            clazzesArr.push(liClass);
        });

        var ave = data.ave.toFixed(1);  //平均分
        var excellentRate = (data.excellentRate * 100).toFixed(1);  //优秀率
        var passingRate = (data.passingRate * 100).toFixed(1);  //通过率
        var max = data.max;   //最高分
        var min = data.min;   //最低分
        var topData = [
            {
                score: max + '/' + min,
                str: '最高分/最低分'
            },
            {
                score: ave,
                str: '平均分'
            },
            {
                score: excellentRate + '%',
                str: '优秀率'
            },
            {
                score: passingRate + '%',
                str: '及格率'
            },

        ];
        var topDataArr = [];   //顶部四格
        topData.forEach(function (v, i) {
            var flex = <Flex.Item>
                <div className='placeholder'>
                    <div className="font_20 color">{v.score}</div>
                    <div>{v.str}</div>
                </div>
            </Flex.Item>
            topDataArr.push(flex);
        });


        this.setState({top5StudentListArr, clazzesArr, topDataArr});

    }

    /**
     * 跳转到班级分析结果
     * @param id
     */
    turnToClassRel(id) {
        window.open("/#/classReaultAnalysis?taskId=" + 1 + "&clazzId=" + id);

        /*var url = "http://jiaoxue.maaee.com:8091/#/classReaultAnalysis?taskId=" + 1 + "&clazzId=" + id;
        var data = {};
        data.method = 'openNewPage';
        data.url = url;
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });*/
    }

    renderTabBar(props) {
        return (<Sticky>
            {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }

    render() {

        return (
            <div className='result'>
                <StickyContainer>
                    <Tabs tabs={tabs}
                          initalPage={0}
                          renderTabBar={this.renderTabBar}
                          swipeable={false}
                          animated={false}
                          useOnPan={false}
                    >
                        <div style={{
                            height: document.documentElement.clientHeight - 45,
                            backgroundColor: '#f4f4f4'
                        }}>
                            <Flex className='flexByNoom'>
                                {this.state.topDataArr}
                            </Flex>

                            <WingBlank size="md">
                                <div className='gradeRank rank'>年级前五名</div>
                                <ul className='ulFirstByNoom'>
                                    {this.state.top5StudentListArr}
                                </ul>
                            </WingBlank>
                            <WingBlank size="md">
                                <div className='classRank rank'>班级平均分排名</div>
                                <ul className='ulFirstByNoom'>
                                    {this.state.clazzesArr}
                                </ul>
                            </WingBlank>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: document.documentElement.clientHeight - 45,
                            backgroundColor: '#fff'
                        }}>
                            Content of second tab
                        </div>
                    </Tabs>
                </StickyContainer>
            </div>
        );
    }
}