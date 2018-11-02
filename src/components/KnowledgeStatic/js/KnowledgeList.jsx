import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, ActivityIndicator, WhiteSpace,Picker
} from 'antd-mobile';
import '../css/KnowledgeList.less'

export default class KnowledgeList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clientHeight: document.body.clientHeight,
            ListData:[]
        }
    }

    componentDidMount() {
        document.title = '正确率';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var currentTime = searchArray[1].split('=')[1];
        console.log(userId,'userId');
        console.log(currentTime,'cuurentTime');
        this.setState({
            userId:userId,
            currentTime: currentTime,
        },()=>{
            this.getMasteryOfTagsByCurrentTime();
        })
    }



    getMasteryOfTagsByCurrentTime() {
        var param = {
            "method": 'getMasteryOfTagsByCurrentTime',
            "currentTime": (this.state.currentTime),
            "userId" :this.state.userId
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'列表数据');
                if (result.success) {
                    this.setState({
                        ListData: result.response
                    })
                    console.log(this.state.ListData);
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    onItemClick(id){
        console.log(id);
        window.location.href = WebServiceUtil.mobileServiceURL + "topicList?tagId="+id;
    }

    render() {
        return (
            <div id="KnowledgeStatic" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto',
            }}>
                <div className="list_box">
                    <div className="list_item">
                        <span>课堂</span>
                        <span>知识点</span>
                        <span>正确率</span>
                    </div>
                    {
                        this.state.ListData.map((value,index)=>{
                            return <div onClick={this.onItemClick.bind(this,value.tags.id)} className="list_item">
                                <span>{value.course?value.course.name:'无数据'}</span>
                                <span>{value.tags.tagTitle}</span>
                                <span>{(value.rightCount/value.totalCount)*100+"%"}</span>
                            </div>
                        })
                    }
                </div>

            </div>
        );
    }

}