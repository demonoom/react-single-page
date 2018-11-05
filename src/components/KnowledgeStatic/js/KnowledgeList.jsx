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
            ListData:[],
            text:'暂无数据'
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
                    },()=>{
                        if(result.response.length <= 0){
                            this.setState({
                                text:'暂无数据'
                            })
                        }
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
            <div id="KnowledgeList" style={{
                height: this.state.clientHeight + 'px',
            }}>
                <div className="list_box">
                    {
                        this.state.ListData.map((value,index)=>{
                            return <div onClick={this.onItemClick.bind(this,value.tags.id)}  className='list_item item line_public'>
                                        <div className='topCont tagCont'>
                                           <span className="text_hidden">
                                                <span className='course'>{value.course?value.course.name:'无'}</span>
                                                <span className='tag'>{value.tags.tagTitle}</span>
                                           </span>
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

                </div>
                <div className='emptyCont' style={this.state.ListData.length <=0 ?{display:'block'}:{display:'none'}}><img src={require('../img/weixin-empty.png')} alt="" /><br />{this.state.text}</div>
            </div>
        );
    }

}