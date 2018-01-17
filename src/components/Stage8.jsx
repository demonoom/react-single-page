import React from 'react';
import {PullToRefresh} from 'antd-mobile';

function genData() {
    const dataArr = [];
    for (let i = 0; i < 40; i++) {
        dataArr.push(i);
    }
    return dataArr;
}

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            down: true,
            height: document.documentElement.clientHeight,
            data: [],
        };
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei,
            data: genData(),
        }), 0);
    }

    render() {

        return (
            <div>
                <PullToRefresh
                    ref={el => this.ptr = el}
                    style={{
                        height: document.documentElement.clientHeight,
                        overflow: 'auto',
                    }}
                    distanceToRefresh={50}
                    direction={'down'}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({refreshing: true});
                        setTimeout(() => {
                            this.setState({refreshing: false});
                        }, 1000);
                    }}
                >
                    {this.state.data.map(i => (
                        <div key={i} style={{textAlign: 'center', padding: 20}}>
                            {this.state.down ? 'pull down' : 'pull up'} {i}
                        </div>
                    ))}
                </PullToRefresh>
            </div>
        )
    }
}
