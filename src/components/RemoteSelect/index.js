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
  
  }

  state = {
    data: [],
    value: undefined,
    fetching: false,
  }

 
  fetcher = (searchVal) => {
    console.log('fetching...', searchVal);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    request('/api/monster/searchlist', {
      method: 'POST',
      body: {searchValue: searchVal}
    })
      
      .then((json) => {
        console.log(json)
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
    console.log(value)
    this.setState({
      value,
      
      fetching: false,
    });
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

