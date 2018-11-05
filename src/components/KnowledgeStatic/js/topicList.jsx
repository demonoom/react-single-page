import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, ActivityIndicator, WhiteSpace,Picker
} from 'antd-mobile';

export default class topicList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clientHeight: document.body.clientHeight,
            ListData:[],
            text:'正在加载...'
        }
    }

    componentDidMount() {
        document.title = '答案统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var tagId = searchArray[0].split('=')[1];
        this.setState({
            tagId:tagId,
        },()=>{
            this.getDetailMasteryOfTag();
        })
    }



    getDetailMasteryOfTag() {
        var param = {
            "method": 'getDetailMasteryOfTag',
            "tagId" :this.state.tagId
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'答案数据');
                if (result.success) {
                    this.setState({
                        ListData: result.response
                    },()=>{
                        if(result.response.length <= 0){
                            this.setState({
                                text: '暂无数据'
                            })
                        }
                    })
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    render() {
        return (
            <div id="KnowledgeList" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto',
            }}>
                <div className="list_box">
                    {
                        this.state.ListData.map((value,index)=>{
                            return <div className="list_item item line_public">
                                <div className='topCont tagCont my_flex'>
                                    <div className="text_hidden" dangerouslySetInnerHTML={{__html: value.pushSubject.content}}></div>
                                    <span className='rate'>正确率：<span>{(value.rightCount/value.totalCount)*100+"%"}</span></span>
                                </div>
                                <div className='gray_text'>
                                    <span>{value.totalCount+"人提交"}</span>
                                    <span>{value.rightCount+"人回答正确"}</span>
                                    <span>{value.totalCount - value.rightCount+"回答错误"}</span>
                                </div>
                            </div>
                        })
                    }
                    <div style={this.state.ListData.length <=0 ?{display:'block'}:{display:'none'}}>{this.state.text}</div>
                </div>

            </div>
        );
    }

}