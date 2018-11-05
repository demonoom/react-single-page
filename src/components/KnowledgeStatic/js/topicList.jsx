import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, ActivityIndicator, WhiteSpace,Picker
} from 'antd-mobile';
import '../css/topicList.less'

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
            <div id="topicList" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto',
            }}>
                <div className="list_box">
                    {
                        this.state.ListData.map((value,index)=>{
                            return <div className="list_item">
                                <div dangerouslySetInnerHTML={{__html: value.pushSubject.content}}></div>
                                <div>{value.totalCount+"人提交"}</div>
                                <div>{value.rightCount+"人回答正确"}</div>
                                <div>{value.totalCount - value.rightCount+"回答错误"}</div>
                                <div><span>正确率:</span>{(value.rightCount/value.totalCount)*100+"%"}</div>
                            </div>
                        })
                    }
                    <div style={this.state.ListData.length <=0 ?{display:'block'}:{display:'none'}}>{this.state.text}</div>
                </div>

            </div>
        );
    }

}