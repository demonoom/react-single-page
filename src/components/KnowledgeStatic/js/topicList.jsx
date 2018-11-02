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
            ListData:[]
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
                    <div className="list_item">
                        <span>题目</span>
                        <span>正确/错误</span>
                    </div>
                    {
                        this.state.ListData.map((value,index)=>{
                            return <div className="list_item">
                                <span dangerouslySetInnerHTML={{__html: value.pushSubject.content}}></span>
                                <span>{"一共有"+value.totalCount+"人做了,正确率为"+((value.rightCount/value.totalCount)*100)+"%"}</span>
                            </div>
                        })
                    }
                </div>

            </div>
        );
    }

}