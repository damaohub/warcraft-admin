import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import request from '@/utils/request';


const { Option }= Select;

export default class RemoteSelect extends React.Component {
  constructor(props) {
    super(props);
    this.fetcher = debounce(this.fetcher, 800);
    this.lastFetchId = 0
    this.state = {
      data: [],
      value: props.initialValue,
      fetching: false,
    }
  }

  

 
  fetcher = (searchVal) => {
    const {url} = this.props
    if( searchVal ==='' ) return
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    request(url, {
      method: 'POST',
      body: {searchValue: searchVal}
    })
      
      .then((json) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        
        const data = json.data.list.map(user => ({
          text: `${user.name}`,
          value: user.id,
        }));
        this.setState({ data, fetching: false });
      });
  }


  handleChange = (value) => {
    const { onSelectHandel } = this.props
    this.setState({
      value,
      
      fetching: false,
    });
    onSelectHandel(value)
  }

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        showSearch
        value={value}
        placeholder="请输入查找"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetcher}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
    );
  }


}

