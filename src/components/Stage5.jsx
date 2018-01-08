import React from 'react';
import { createForm } from 'rc-form';
import { district } from 'antd-mobile-demo-data';
import { ImagePicker, WingBlank, SegmentedControl } from 'antd-mobile';

import { Picker, DatePicker, List, Checkbox, InputItem } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

const CheckboxItem = Checkbox.CheckboxItem;


const data = [{
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121',
}, {
    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
    id: '2122',
}];

// 如果不是使用 List.Item 作为 children
const CustomChildren = (props) => {
    return (
        <div
            onClick={props.onClick}
            style={{ backgroundColor: '#fff', height: 45, lineHeight: '45px', padding: '0 15px' }}
        >
            {props.children}
            <span style={{ float: 'right' }}>{props.extra}</span>
        </div>
    );
};

class ImagePickerExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: data,
            multiple: false,
        };
    }

    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files,
        });
    }
    onSegChange = (e) => {
        const index = e.nativeEvent.selectedSegmentIndex;
        this.setState({
            multiple: index === 1,
        });
    }
    componentDidMount() {
        this.props.changeTitle('Stage 3');
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { pickerValue, dpValue } = this.state;
        const { files } = this.state;
        return (
            <WingBlank>
                <SegmentedControl
                    values={['切换到单选', '切换到多选']}
                    selectedIndex={this.state.multiple ? 1 : 0}
                    onChange={this.onSegChange}
                />
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={files.length < 5}
                    multiple={this.state.multiple}
                />
            </WingBlank>);
    }
}

export default createForm()(ImagePickerExample);
