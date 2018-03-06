import React from 'react';
import {Accordion, List} from 'antd-mobile';

export default class Stage5 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {
        var a = <div>
            <img src={require('./userInfo/icon_del_n.png')} alt=""/>
            <span onClick={this.bvsvss}>牛顿</span>
        </div>
        this.setState({a});
    }

    bvsvss(event) {
        event.stopPropagation();
        console.log(1111);
    }

    onChange = (key) => {
        console.log(key);
    }

    render() {

        return (
            <div>
                <div style={{marginTop: 10, marginBottom: 10}}>
                    <Accordion accordion defaultActiveKey="0" className="my-accordion">
                        <Accordion.Panel header={this.state.a}>
                            <List className="my-list">
                                <List.Item onclick={this.bvsvss}>content 1</List.Item>
                                <List.Item>content 2</List.Item>
                                <List.Item>content 3</List.Item>
                            </List>
                        </Accordion.Panel>
                        <Accordion.Panel header="Title 2" className="pad">this is panel content2 or
                            other</Accordion.Panel>
                        <Accordion.Panel header="Title 3" className="pad">
                            text text text text text text text text text text text text text text text
                        </Accordion.Panel>
                    </Accordion>
                </div>
            </div>
        );
    }
}
