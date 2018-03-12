import React from 'react';
import {Checkbox} from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;


export default class Stage5 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    onChange = (val) => {
        console.log(val);
    }

    render() {

        const data = [
            {value: 0, label: 'Ph.D.'},
            {value: 1, label: 'Bachelor'},
            {value: 2, label: 'College diploma'},
        ];

        return (
            <div>
                {data.map(i => (
                    <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
                        {i.label}
                    </CheckboxItem>
                ))}
            </div>
        );
    }
}
