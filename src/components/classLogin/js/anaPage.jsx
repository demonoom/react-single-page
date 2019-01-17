import React from "react";
var url;
export default class anaPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url:""
        }
    }
    componentDidMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vId = searchArray[0].split('=')[1];
        var userId = searchArray[1].split('=')[1];
        var type = searchArray[2].split('=')[1];
        var name = searchArray[3].split('=')[1];
        var judgeFlag = searchArray[4].split('=')[1];
        url = "https://jiaoxue.maaee.com:9093/#/cloundSchoolDetail?vId=" +vId + "&userId=" + userId + "&type=3&name=" + name + "&judgeFlag=''"
        this.setState({
            url
        })
        
    }

    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }
    render() {
        console.log(url)
        return (
            <div>
                <div>
                    <div><span onClick={this.historyGoBack}>返回</span><span>查看回顾</span></div>
                    <iframe src={this.state.url} frameborder="0"></iframe>
                </div>
            </div>
        )
    }
}