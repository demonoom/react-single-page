import React from 'react';
import {Modal, Button, WingBlank, WhiteSpace, Toast} from 'antd-mobile';

const prompt = Modal.prompt;

export default class Stage5 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {

        return (
            <div>
                <WingBlank size="lg">

                    <Button onClick={() => prompt('defaultValue', 'defaultValue for prompt', [
                        { text: 'Cancel' },
                        { text: 'Submit', onPress: value => console.log(`输入的内容:${value}`) },
                    ], 'default', '100')}
                    >defaultValue</Button>

                </WingBlank>
            </div>
        );
    }
}
