import React from 'react';
import {PullToRefresh, ListView, Carousel, SwipeAction, Button} from 'antd-mobile';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';
// import requestUtil from '../helpers/requestUtil'
import fetch from 'dva/fetch'

let pageIndex = 1;

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];
        // for (let i = 0; i < 20; i++) {
        //   this.initData.push(`r${i}`);
        // }
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            refreshing: false,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.props.changeTitle('蚁巢');
        this.getTopics(pageIndex, 0);
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
     * 获取话题列表
     * @param type 0:全部  1：只看老师
     * @param pageNo
     */
    getTopics(pageNo, type) {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getTopicsByType',
            "ident": '23836',
            "type": type,
            "pageNo": pageNo
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch("https://www.maaee.com/Excoord_For_Education/webservice", obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
            console.log(result);
            var response = result.data.response;
            for (let i = 0; i < response.length; i++) {
                var topic = response[i];
                dataBlob[`${i}`] = topic;
            }
            _this.initData = _this.initData.concat(response);
            _this.setState({
                dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                isLoading: false,
            })
            // console.log(dataBlob);
            // return dataBlob;
        });
    }

    onEndReached = (event) => {
        console.log('到底触发');
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        var _this = this;
        if (_this.state.isLoading && !_this.state.hasMore) {
            return;
        }
        console.log('reach end', event, _this.state.dataSource);
        _this.setState({isLoading: true});
        setTimeout(() => {
            // _this.initData = _this.initData.concat();
            _this.getTopics(++pageIndex, 0)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.initData),
                isLoading: false,
            });
        }, 1000);
    }

    onRefresh = () => {
        console.log('onRefresh');
        var _this = this;
        _this.initData.splice(0);
        pageIndex = 0;
        _this.getTopics(pageIndex, 0);
        _this.setState({
            dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
            refreshing: false,
        });
    }

    render() {
        console.log(this.state.dataSource);
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            console.log(22);
            var fromUser = rowData.fromUser;
            return (
                <div key={rowID} style={{padding: '0 15px'}}>
                    <div
                        style={{
                            lineHeight: '50px',
                            color: '#888',
                            fontSize: 18,
                            borderBottom: '1px solid #F6F6F6',
                        }}
                    >{fromUser.userName}</div>
                    <div style={{display: '-webkit-box', display: 'flex', padding: '15px 0'}}>
                        <img style={{height: '64px', marginRight: '15px'}} src={fromUser.avatar} alt=""/>
                        <div style={{lineHeight: 1}}>
                            <div style={{marginBottom: '8px', fontWeight: 'bold'}}>{rowData.content}</div>
                            {/*<div><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span>¥</div>*/}
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div>
                <ListView
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                        {this.state.isLoading ? 'Loading...' : 'Loaded'}
                    </div>)}
                    renderRow={row}
                    renderSeparator={(sectionID, rowID) => (
                        <div key={`${sectionID}-${rowID}`} style={{backgroundColor: '#F5F5F9', height: 8}}/>
                    )}
                    initialListSize={10}
                    pageSize={5}
                    scrollRenderAheadDistance={200}
                    scrollEventThrottle={20}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    style={{
                        height: document.body.clientHeight,
                        // height:'100%'
                        // height: '400px',
                    }}
                    contentContainerStyle={{position: 'relative'}}
                    scrollerOptions={{scrollbars: true}}
                    pullToRefresh={<PullToRefresh
                        refreshing={_this.state.refreshing}
                        onRefresh={_this.onRefresh}
                    />}
                />
            </div>
        );
    }
}


