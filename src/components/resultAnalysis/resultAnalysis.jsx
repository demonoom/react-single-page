import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import fetch from 'dva/fetch'
import {Tabs, Flex, WingBlank, Toast, ActivityIndicator, WhiteSpace} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import './reaultAnalysis.less';

// const mobileUrl = 'http://www.maaee.com/Excoord_For_Education/webservice';
const mobileUrl = 'http://172.16.2.230:9006/Excoord_ApiServer/webservice';

const tabs = [
    {title: '成绩分析'},
    {title: '题目分析'},
];

var reaultA;

export default class resultAnalysis extends React.Component {
    constructor(props) {
        super(props);
        reaultA = this;
        this.state = {
            top5StudentListArr: [],
            clazzesArr: [],
            topDataArr: [],
            tableArr: [],
            animating: true,   //动画状态
            mainDiv: 'hidden',
            radarIndicator:[],
            seriesvalue:[],
            radarOption:{}
        }
    }

    componentDidMount() {
        document.title = '成绩分析';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        this.viewGradeAnalysis(searchArray)
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
    viewGradeAnalysis(array) {
        var taskId = array[0].split('=')[1];
        this.setState({taskId});
        var _this = this;
        var param = {
            "method": 'viewGradeAnalysis',
            "taskId": taskId,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                _this.setState({animating: false});
                var ret = result.data.response;
                if (result.data.success == true && result.data.msg == '调用成功') {
                    //  获得数据
                    _this.buildAnalysis(ret);
                    _this.setState({mainDiv: 'visible'})
                } else {
                    Toast.fail(result.data.msg, 3);
                }
            });
    }

    /**
     * 渲染年级分析结果
     * @param data
     */
    buildAnalysis(data) {
        var _this = this;
        var top5StudentList = data.top5StudentList;   //前五名
        var top5StudentListArr = []
        top5StudentList.forEach(function (v, i) {
            var li = <li><img src={require('./' + (i + 1) + '.png')}/>{v.studName}<span>{v.studScore}</span></li>;
            top5StudentListArr.push(li);
        });

        var clazzes = data.clazzes;   //班级排名
        var clazzesArr = [];
        clazzes.forEach(function (v, i) {
            var liClass = <li onClick={_this.turnToClassRel.bind(this, v.clazzId)}><b>{v.order}</b>{v.clazzName + '班'}
            </li>
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
            </Flex.Item>;
            topDataArr.push(flex);
        });
        var radarIndicator=[];
        var seriesValue=[];
        var tableArr = [];
        if (data.topics.length != 0) {
            data.topics.forEach(function (v, i) {
                var tb = <tr>
                    <td>{i + 1}</td>
                    <td>{v.knowledgePoint}</td>
                    <td>{(v.hitRate * 100).toFixed(1) + '%'}</td>
                    <td>{v.hitPeopleCount}</td>
                    <td>{v.missPeopleCount}</td>
                </tr>;
                tableArr.push(tb);
                var name = v.name;
                var max = v.max;
                var nameJson = { name: name, max: max};
                var hit = v.hit;
                radarIndicator.push(nameJson);
                seriesValue.push(hit);
            });
        }
        console.log(data.topics);
        this.buildRadarOption(radarIndicator,seriesValue);
        this.setState({top5StudentListArr, clazzesArr, topDataArr, tableArr});

    }

    /**
     * 跳转到班级分析结果
     * @param id
     */
    turnToClassRel(id) {
        var taskId = reaultA.state.taskId;
        window.open("/#/classReaultAnalysis?taskId=" + taskId + "&clazzId=" + id);

        // var url = "http://172.16.2.53:8091/#/classReaultAnalysis?taskId=" + taskId + "&clazzId=" + id;
        // var data = {};
        // data.method = 'openNewPage';
        // data.url = url;
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
    }

    renderTabBar(props) {
        return (<Sticky>
            {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }

    buildRadarOption(radarIndicator,seriesValue){
        var _this = this;
        var radarOption = {
            title: {
                text: '题目雷达图',
                textStyle: {
                    fontSize: '14px',
                },
            },
            tooltip: {},
            legend: {
                data: ['得分率']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                /*indicator: [
                    { name: '销售（sales）', max: 6500},
                    { name: '管理（Administration）', max: 16000},
                    { name: '信息技术（Information Techology）', max: 30000},
                    { name: '客服（Customer Support）', max: 38000},
                    { name: '研发（Development）', max: 52000},
                    { name: '市场（Marketing）', max: 25000}
                ]*/
                indicator: radarIndicator,
                splitNumber:5, //让雷达图等分为10份
            },
            series: [{
                name: '得分率',
                type: 'radar',
                // areaStyle: {normal: {}},
                data : [
                    {
                        // value : [4300, 10000, 28000, 35000, 50000, 19000],
                        value :seriesValue,
                        name : '得分率'
                    }
                ]
                //label:{show:true}   //在图中的数据点上显示具体的数值
            }]
        };
        this.setState({"radarOption":radarOption});
    }

    render() {

        return (
            <div className='result'>
                <StickyContainer style={{visibility: this.state.mainDiv}}>
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

                        <div className="class_table" style={{
                            height: document.documentElement.clientHeight - 45,
                            backgroundColor: '#fff'
                        }}>

                            <ReactEcharts
                                option={this.state.radarOption}
                                style={{height: '500px', width: '100%'}}
                                className='react_for_echarts' />

                            <table className="class_table_cont">
                                <thead>
                                <td className="first">题号</td>
                                <td className="second">知识点/考点</td>
                                <td className="three">年级得分率</td>
                                <td className="three">答对人数</td>
                                <td className="three">答错人数</td>
                                </thead>
                                <tbody>
                                {this.state.tableArr}
                                </tbody>
                            </table>
                        </div>
                    </Tabs>
                </StickyContainer>
                <WingBlank>
                    <div className="toast-container">
                        <WhiteSpace size="xl"/>
                        <div className="toast-example">
                            <ActivityIndicator
                                toast
                                text="正在加载..."
                                animating={this.state.animating}
                            />
                        </div>
                    </div>
                </WingBlank>
            </div>
        );
    }
}
