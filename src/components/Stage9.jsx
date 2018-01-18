import React from 'react';
import {List, WingBlank, WhiteSpace} from 'antd-mobile';

const Item = List.Item;

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {

        return (
            <div>
                <WingBlank size="md">
                    <List renderHeader={() => '年级前五名'}>
                        <Item
                            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                            onClick={() => {
                            }}
                            extra="extra content"
                        >热污染</Item>
                        <Item
                            thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                            onClick={() => {
                            }}
                            extra="extra content"
                        >
                            热点的
                        </Item>
                    </List>
                </WingBlank>


                <List renderHeader={() => '班级前五名'}>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        onClick={() => {
                        }}
                        extra="extra content"
                    >热污染</Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                        onClick={() => {
                        }}
                        extra="extra content"
                    >
                        热点的
                    </Item>
                </List>
            </div>
        )
    }
}
