import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {Tabs, Flex, WingBlank, Toast, ActivityIndicator, WhiteSpace} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import './classReaultAnalysis.less';


const tabs = [
    {title: '成绩分析'},
    {title: '题目分析'},
];

export default class classReaultAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top5StudentListArr: [],
            last5StudentListArr: [],
            topDataArr: [],
            topDiv: '',
            isNameShow: 'block',
            tableArr: [],
            animating: true,   //动画状态
            mainDiv: 'hidden',
            radarIndicator: [],
            seriesvalue: [],
            radarOption: {}
        }
    }

    componentDidMount() {
        document.title = '成绩分析';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        this.viewclazzAnalysis(searchArray);
    }

    /**
     * 查看试卷分析中的年级的结果
     */
    viewclazzAnalysis(array) {
        var taskId = array[0].split('=')[1];
        var clazzId = array[1].split('=')[1];
        var _this = this;
        var param = {
            "method": 'viewclazzAnalysis',
            "taskId": taskId,
            "clazzId": clazzId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                _this.setState({animating: false});
                var ret = result.response;
                if (result.success == true && result.msg == '调用成功') {
                    //  获得数据
                    _this.buildAnalysis(ret);
                    _this.setState({mainDiv: 'visible'})
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
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

        var last5StudentList = data.last5StudentList;   //后五名
        var last5StudentListArr = [];
        last5StudentList.forEach(function (v, i) {
            var liLast = <li>{v.studName}<span>{v.studScore}</span></li>
            last5StudentListArr.push(liLast);
        });

        var clazzMax = data.clazzMax;   //班级最高分
        var gradeMax = data.gradeMax;   //年级最高分
        var clazzOrder = data.clazzOrder;   //班级排名
        var clazzCount = data.clazzCount;   //总班级数
        var clazzPassingRate = (data.clazzPassingRate * 100).toFixed(1);  //班级及格率
        var gradePassingRate = (data.gradePassingRate * 100).toFixed(1);  //年级及格率
        var clazzExcellentRate = (data.clazzExcellentRate * 100).toFixed(1);  //班级优秀率
        var gradeExcellentRate = (data.gradeExcellentRate * 100).toFixed(1);  //年级优秀率
        var clazzAve = data.clazzAve.toFixed(1);  //班级平均分
        var gradeAve = data.gradeAve.toFixed(1);  //年级平均分
        var topDiv = <Flex.Item>
            <div className='placeholder'>
                <div className="font_20 color le8">{clazzMax + '/' + gradeMax}</div>
                <div>最高分(班级/年级)</div>
            </div>
        </Flex.Item>;

        var topData = [
            {
                score: clazzOrder,
                scoreBot: clazzCount,
                str: '班级排名',
                strElse: '/班级总数'
            },
            {
                score: clazzAve,
                scoreBot: gradeAve,
                str: '平均分',
                strElse: '(班级/年级)'
            },
            {
                score: clazzExcellentRate,
                scoreBot: gradeExcellentRate,
                str: '优秀率(%)',
                strElse: '(班级/年级)'
            },
            {
                score: clazzPassingRate,
                scoreBot: gradePassingRate,
                str: '及格率(%)',
                strElse: '(班级/年级)'
            },

        ];
        var topDataArr = [];   //顶部四格
        topData.forEach(function (v, i) {
            var flex = <Flex.Item>
                <div className='placeholder'>
                    <div className="color le8"><span className="font_20 top">{v.score}</span><span
                        className="font_16 line">{v.scoreBot}</span></div>
                    <div>{v.str}<br></br>{v.strElse}</div>
                </div>
            </Flex.Item>;
            topDataArr.push(flex);
        });

        if (data.studentList[0].studId == data.studentList[0].studName) {
            this.setState({isNameShow: 'none'})
        }
        if (data.studentList.length != 0) {
            var studentList = []
            data.studentList.forEach(function (v, i) {
                //每个学生
                var stu = <Flex>
                    <Flex.Item>
                        <div className='placeholderBottom'>
                            <span>{v.studId}</span>
                        </div>
                    </Flex.Item>
                    <Flex.Item style={{display: _this.state.isNameShow}}>
                        <div className='placeholderBottom'>
                            <span>{v.studName}</span>
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div className='placeholderBottom'>
                            <span>{v.studScore}</span>
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div className='placeholderBottom'>
                            <span>{v.clazzRank + '/' + v.gradeRank}</span>
                            <span>(班级/年级)</span>
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div className='placeholderBottom'>
                            <span>{v.badTopics.join('，')}</span>
                        </div>
                    </Flex.Item>
                </Flex>
                studentList.push(stu);
            })
        }
        var radarIndicator = [];
        var seriesValue = [];
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
                var nameJson = {name: name, max: max};
                var hit = v.hit;
                radarIndicator.push(nameJson);
                seriesValue.push(hit);
            });
        }
        this.buildRadarOption(radarIndicator, seriesValue);
        this.setState({top5StudentListArr, last5StudentListArr, topDataArr, topDiv, studentList, tableArr});
    }

    renderTabBar(props) {
        return (<Sticky>
            {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }

    buildRadarOption(radarIndicator, seriesValue) {
        var _this = this;
        var radarOption = {
            title: {
                text: '题目得分率统计',
                textStyle: {
                    fontSize: '14px',
                },
            },
            tooltip: {},
            /*legend: {
                data: ['得分率']
            },*/
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
                splitNumber: 5, //让雷达图等分为10份
            },
            series: [{
                name: '得分率',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [
                    {
                        // value : [4300, 10000, 28000, 35000, 50000, 19000],
                        value: seriesValue,
                        name: '得分率'
                    }
                ],
                silent: true
                //label:{show:true}   //在图中的数据点上显示具体的数值
            }]
        };
        this.setState({"radarOption": radarOption});
    }

    render() {

        return (
            <div className='classResult'>
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
                                {this.state.topDiv}
                            </Flex>
                            <Flex className='flexByNoom2'>
                                {this.state.topDataArr}
                            </Flex>

                            <WingBlank size="md">
                                <div className='gradeRank rank'>班级前五名</div>
                                <ul className='ulFirstByNoom'>
                                    {this.state.top5StudentListArr}
                                </ul>
                            </WingBlank>
                            <WingBlank size="md">
                                <div className='classRank rank'>班级后五名</div>
                                <ul className='ulFirstByNoom'>
                                    {this.state.last5StudentListArr}
                                </ul>
                            </WingBlank>
                            <div className="wingblank_list_wrap">
                                <div className="wingblank_list_cont">
                                    <WingBlank size="md" className="wingblank_list2">
                                        <Flex className='flexByNoom3'>
                                            <Flex.Item>
                                                <div className='placeholderBottom'>
                                                    <span>学号</span>
                                                </div>
                                            </Flex.Item>
                                            <Flex.Item style={{display: this.state.isNameShow}}>
                                                <div className='placeholderBottom'>
                                                    <span>姓名</span>
                                                </div>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <div className='placeholderBottom'>
                                                    <span>分数</span>
                                                </div>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <div className='placeholderBottom'>
                                                    <span>排名</span>
                                                    <span>(班级/年级)</span>
                                                </div>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <div className='placeholderBottom'>
                                                    <span>错题号</span>
                                                </div>
                                            </Flex.Item>
                                        </Flex>
                                    </WingBlank>
                                    <WingBlank className="wingblank_list">
                                        {this.state.studentList}
                                    </WingBlank>
                                </div>
                            </div>
                        </div>
                        <div className="class_table" style={{
                            height: document.documentElement.clientHeight - 45, background: '#fff'
                        }}>
                            <ReactEcharts
                                option={this.state.radarOption}
                                style={{Minheight: '340px', width: '100%'}}
                                className='react_for_echarts'/>
                            <table className="class_table_cont">
                                <thead>
                                <td className="first">题号</td>
                                <td className="second">知识点/考点</td>
                                <td className="three">班级得分率</td>
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
