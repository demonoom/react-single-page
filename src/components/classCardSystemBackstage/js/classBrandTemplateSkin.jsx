import React from 'react';
import {
    ListView,
    List, Radio, Flex, WhiteSpace, Button
} from 'antd-mobile';

const RadioItem = Radio.RadioItem;
var AttenT;

export default class classBrandTemplateSkin extends React.Component {

    constructor(props) {
        super(props);
        AttenT = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            clientHeight: document.body.clientHeight,
            value: 0,
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '皮肤列表页面';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        this.getBraceletBoxSkinBySchoolId(uid);
        //添加对视窗大小的监听,在屏幕转换以及键盘弹起时重设各项高度
        window.addEventListener('resize', AttenT.onWindowResize)
    }

    componentWillUnmount() {
        //解除监听
        window.removeEventListener('resize', AttenT.onWindowResize)
    }

    /**
     * 视窗改变时改变高度
     */
    onWindowResize() {
        setTimeout(function () {
            AttenT.setState({ clientHeight: document.body.clientHeight });
        }, 100)
    }

    /**
     * 根据学校查询当前的皮肤
     * @param schoolId
     */
    getBraceletBoxSkinBySchoolId(uid) {
        var _this = this;
        _this.initData.splice(0);
        _this.state.dataSource = [];
        _this.state.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataBlob = {};
        var param = {
            "method": 'getBraceletBoxSkinBySchoolId',
            "schoolId": uid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    result.response = [
                        { value: 0, label: 'doctor', extra: 'details' },
                        { value: 1, label: 'bachelor', extra: 'details' },
                        { value: 2, label: 'we', extra: 'details' },
                        { value: 3, label: 'er', extra: 'details' },
                        { value: 4, label: 'tr', extra: 'details' },
                        { value: 5, label: 'y', extra: 'details' },
                        { value: 6, label: 'h', extra: 'details' },
                        { value: 7, label: 'b', extra: 'details' },
                    ]
                    var arr = [];
                    result.response.forEach(function (v, i) {
                        console.log(v, "v")
                        arr.push({
                            value: v.value, label: v.label, extra: v.extra
                        })
                    })
                    // var arr = [
                    //     { value: 0, label: 'doctor',extra: 'details'},
                    //     { value: 1, label: 'bachelor',extra: 'details' },
                    //     { value: 2, label: 'we',extra: 'details' },
                    //     { value: 3, label: 'er',extra: 'details' },
                    //     { value: 4, label: 'tr' ,extra: 'details'},
                    //     { value: 5, label: 'y' ,extra: 'details'},
                    //     { value: 6, label: 'h',extra: 'details' },
                    //     { value: 7, label: 'b',extra: 'details' },
                    // ]
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    _this.initData = _this.initData.concat(arr);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: false,
                        refreshing: false
                    })
                }
            },
            onError: function (error) {
            }
        });
    }

    onChange = (value) => {
        console.log(value, 'checkbox');
        this.setState({
            value,
        });
    };


    submitValue = () => {
        console.log(AttenT.state.value)

        /**
	 * 添加班牌皮肤到对应的学校　
	 * @param skinId
	 * @param schoolId
	 * @return
	 * @throws Exception
	 */
        addBraceletBoxSkinToSchoolId=(skinId, schoolId)=>{

        }
    }
    render() {
        const { value } = this.state;
        // var data = AttenT.initData;
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData, "calm")
            return (
                <div className="classInfo line_public attendanceCont">
                    <List>
                        <RadioItem key={rowData.value} checked={value === rowData.value} onChange={() => this.onChange(rowData.value)}>
                            皮肤名称：{rowData.label}
                            <List.Item.Brief>皮肤类名：{rowData.extra}</List.Item.Brief>
                        </RadioItem>
                    </List>
                </div>
            )
        };
        return (
            <div id="classBrandTemplateSkin" style={{ height: AttenT.state.clientHeight }}>
                <div className='tableDiv' style={{ height: AttenT.state.clientHeight }}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{ paddingTop: 5, paddingBottom: 40, textAlign: 'center' }}>
                                {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                            </div>)}
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        //onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: AttenT.state.clientHeight - 50,
                        }}
                    />
                    <Button type="warning" onClick={this.submitValue}>提交</Button>
                    {/* <div onClick={AttenT.}>提交</div> */}
                </div>
            </div>
        );
    }
}
