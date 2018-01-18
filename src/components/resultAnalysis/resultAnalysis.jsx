import React from 'react';
import fetch from 'dva/fetch'
import {Tabs, Flex, List, WingBlank} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import './reaultAnalysis.less';

// const mobileUrl = 'http://www.maaee.com/Excoord_For_Education/webservice';
const mobileUrl = 'http://192.168.1.230:9006/Excoord_ApiServer/webservice';

const tabs = [
    {title: '成绩分析'},
    {title: '题目分析'},
];

export default class resultAnalysis extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = '成绩分析';
        // var locationHref = window.location.href;
        // var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var searchArray = locationSearch.split("&");
        // this.viewGradeAnalysis()
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

        console.log(param);

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
                console.log(result);
            });
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

    renderTabBar(props) {
        return (<Sticky>
            {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }

    render() {

        const PlaceHolder = ({className = '', ...restProps}) => (
            <div className={`${className} placeholder`} {...restProps}>
                <span>100</span>
                <span>平均分</span>
            </div>
        );

        return (
            <div>
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
                            backgroundColor: '#EFEFEF'
                        }}>
                            <Flex className='flexByNoom'>
                                <Flex.Item><PlaceHolder/></Flex.Item>
                                <Flex.Item><PlaceHolder/></Flex.Item>
                                <Flex.Item><PlaceHolder/></Flex.Item>
                                <Flex.Item><PlaceHolder/></Flex.Item>
                            </Flex>

                            <WingBlank size="md">
                                <div className='gradeRank rank'>年级前五名</div>
                                <ul className='ulFirstByNoom'>
                                    <li><img src={require('./lALPBY0V4uV861ZUVA_84_84.png')} alt=""/>小明
                                        <span>423分</span>
                                    </li>
                                    <li><img src={require('./lALPBY0V4uV861ZUVA_84_84.png')} alt=""/>小为<span>123分</span>
                                    </li>
                                    <li><img src={require('./lALPBY0V4uV861ZUVA_84_84.png')} alt=""/>小我<span>213分</span>
                                    </li>
                                    <li><img src={require('./lALPBY0V4uV861ZUVA_84_84.png')} alt=""/>小风<span>213分</span>
                                    </li>
                                </ul>
                            </WingBlank>
                            <WingBlank size="md">
                                <div className='classRank rank'>班级平均分排名</div>
                                <ul className='ulFirstByNoom'>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
                                    <li>2班</li>
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
