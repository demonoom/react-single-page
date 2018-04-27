import React from "react";

export default class chatMsg extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        document.title = "查找聊天内容";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var uid = searchArray[0].split('=')[1];
        var tid = searchArray[1].split('=')[1];
        var type = searchArray[2].split('=')[1];
        console.log(uid);
        console.log(tid);
        console.log(type);
    }

    render() {
        return (
            <div>我是聊天记录页面</div>
        )
    }
}