import React from "react";

export default class chatMsg extends React.Component {
    constructor(props){
        super(props)
        this.state={}
    }

    componentDidMount(){
        document.title = "个人设置";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var chatGroupId = searchArray[0].split('=')[1];
        var ident = searchArray[1].split('=')[1];
        this.getUserByAccount(ident, chatGroupId);
    }

    render(){
        return (
            <div>我是聊天记录页面</div>
        )
    }
}