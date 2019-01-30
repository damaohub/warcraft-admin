import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


import styles from '../GameRole/game.less';



const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@Form.create()
/* eslint react/no-multi-comp:0 */
@connect(({ group, loading }) => ({
    group,
  Loading: loading.models.group,
}))
class GroupPage extends Component {
  state = {};

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  columns = [
    {
      title: '昵称',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
      align: 'center',
    },
    {
      title: '在职状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '入职时间',
      dataIndex: 'entry_time',
      key: 'entry_time',
      align: 'center',
    },
    {
      title: '基本工资',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      align: 'center',
    },
    {
      title: 'QQ号',
      dataIndex: 'qq',
      key: 'qq',
      align: 'center',
    },
    {
      title: '上次登录',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      align: 'center',
    },
    
    
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href={`#/staff/center?uid=${record.id}`}>员工考核</a>
        </Fragment>
      ),
      align: 'center',
    },
  ];

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetch',
    });
   
   
  }

 


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'group/fetch',
      payload: params,
    });
  };

  



 

  render() {
    const {
      group: { data },
      Loading
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              loading={Loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              
            />
          </div>
        </Card>
      </PageHeaderWrapper>
  
    );
  }
}

export default GroupPage;
