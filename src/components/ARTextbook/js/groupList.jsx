import React from "react"
var teacherV;
export default class ARTextbookList extends React.Component {
    constructor(props){
        super(props);
        teacherV = this;
    }

    componentWillMount() {
        document.title = 'AR教材列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var bId = locationSearch.split("&")[0].split("=")[1];
        var uId = locationSearch.split("&")[1].split("=")[1];
        this.viewARBook(bId);
        this.setState({ "bId": bId,"uId":uId });
       
    }
    /**
       * 查看单独的AR教材
       */
      viewARBook(bId) {

        var param = {
            "method": 'viewARBook',
            "bId": bId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (result)=> {
                console.log(result, "viewARBook")
                if (result.msg == '调用成功' || result.success == true) {
                    teacherV.state.initData = result.response;
                    teacherV.setState({
                        itemList:teacherV.state.initData.itemList
                    })
                    this.buildDOM(teacherV.state.initData.itemList)
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
        // teacherV.setState({
        //     ARTextbookValue: teacherV.state.initData[0].name,
        //     pageNoValue: teacherV.state.initData[0].itemList[0].pageNoValue,
        //     fileNewObj: {
        //         fileExtra: "pdf",
        //         filePath: "123"
        //     },
        //     videoNewObj:teacherV.state.initData[0].itemList[0].video.split(",")
        // })


    }
    toUpdateARTextbook(k){
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "UpdateARTextbook?bId=" + this.state.bId+"&uid="+this.state.uId+"&index="+k);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    buildDOM = (item)=>{
        var domArray = [];
        for(var k in item){
        console.log(item,"item");

            domArray.push(
                <div onClick={this.toUpdateARTextbook.bind(this,k)}>
                    <span>第{Number(k)+1}组</span>
                    <img src={item[k].pic} />
                    <span>第{item[k].page}页</span>
                </div>
            )
        }
        this.setState({
            domArray
        })
    }
    render(){
        var _this = this;
        return (
            <div>{_this.state.domArray}</div>
        )
    }
}