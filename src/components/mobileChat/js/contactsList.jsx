import React from 'react';
import {province} from 'antd-mobile-demo-data';
import {StickyContainer, Sticky} from 'react-sticky';
import {ListView, List, Toast} from 'antd-mobile';
import '../css/contactsList.less'

var contactsList;
const {Item} = List;

function genData(ds, provinceData) {
    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    Object.keys(provinceData).forEach((item, index) => {
        sectionIDs.push(item);
        dataBlob[item] = item;
        rowIDs[index] = [];

        provinceData[item].forEach((jj) => {
            rowIDs[index].push(jj.value);
            dataBlob[jj.value] = jj.label;
        });
    });
    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
}

export default class contacts_List extends React.Component {

    constructor(props) {
        super(props);

        //一种方法的写法,定义了两种方法
        // getSectionData(dataBlob, sectionID) {
        //     return dataBlob[sectionID];
        // }
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        console.log(ListView);
        console.log(ListView.DataSource);
        console.log(dataSource);

        contactsList = this;
        this.state = {
            dataSource,
            isLoading: true,
        };
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天";   //设置title
        Toast.info(window.location.href, 10)
    }

    componentDidMount() {
        console.log(province);
        this.setState({
            dataSource: genData(this.state.dataSource, province),
            isLoading: false,
        });
    }

    /**
     * 列表被点击,跳转到聊天内容界面
     * @param data
     */
    rowClick(data) {
        console.log(data);
    }

    render() {
        return (
            <div id='contactsList'
                 style={{
                     position: 'relative',
                     height: document.body.clientHeight,
                     overflow: 'auto'
                 }}>
                <ListView.IndexedList
                    dataSource={this.state.dataSource}
                    className="am-list sticky-list"
                    useBodyScroll
                    renderSectionWrapper={sectionID => (
                        <StickyContainer
                            key={`s_${sectionID}_c`}
                            className="sticky-container"
                            style={{zIndex: 4}}
                        />
                    )}
                    renderSectionHeader={sectionData => (
                        <Sticky>
                            {({
                                  style,
                              }) => (
                                <div
                                    className="sticky"
                                    style={{
                                        ...style,
                                        zIndex: 3,
                                        backgroundColor: sectionData.charCodeAt(0) % 2 ? '#5890ff' : '#F8591A',
                                        color: 'white',
                                    }}
                                >{sectionData}</div>
                            )}
                        </Sticky>
                    )}
                    renderFooter={() => <span>168位联系人</span>}
                    renderRow={rowData => (<Item onClick={this.rowClick.bind(this, rowData)}>{rowData}</Item>)}
                    /*延迟渲染时间设置（用于首屏优化，一开始渲染initialListSize数量的数据，
                    在此时间后、延迟渲染剩余的数据项、即totalRowCount - initialListSize）*/
                    delayTime={10}
                    /*延迟渲染的 loading 指示器*/
                    delayActivityIndicator={<div style={{padding: 25, textAlign: 'center'}}>正在加载...</div>}
                />
            </div>
        );
    }
}
