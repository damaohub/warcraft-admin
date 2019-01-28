import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card , Table} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../GameRole/game.less';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, order }) => ({
    order,
    Loading: loading.models.order,
  }))
  class OrderListPage extends PureComponent {
    state = {
    };
  




    columns = [
      {
        title: '账号',
        dataIndex: 'account_name',
        key: 'account_name',
        align: 'center',
      },
      {
        title: '密码',
        dataIndex: 'account_pwd',
        key: 'account_pwd',
        align: 'center',
      },
      {
        title: '子账号',
        dataIndex: 'child_name',
        key: 'child_name',
        align: 'center',
      },
      {
        title: '游戏角色',
        dataIndex: 'game_role_name',
        key: 'game_role_name',
        align: 'center',
      },
      {
        title: '角色等级',
        dataIndex: 'level',
        key: 'level',
        align: 'center',
      },
      {
        title: '职业',
        dataIndex: 'profession_name',
        key: 'profession_name',
        align: 'center',
      },
      {
        title: '天赋',
        dataIndex: 'talent_name',
        key: 'talent_name',
        align: 'center',
      },
      {
        title: '装备等级',
        dataIndex: 'equip_level',
        key: 'equip_level',
        align: 'center',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a href={`#/order/detail?oid=${record.id}`}>订单详情</a>
          </Fragment>
        ),
        align: 'center',
      },
    
    ];

    componentWillMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'order/fetch',
      });
     
    }
  

    expandedRowRender = (data) => {
      const columns = [
        { title: '订单ID', dataIndex: 'oid', key: 'oid' },
        { title: '项目ID', dataIndex: 'item_id', key: 'item_id' },
        { title: '类型', dataIndex: 'instance_or_secret',  key: 'instance_or_secret' },
        { title: '副本', dataIndex: 'instance_id', key: 'instance_id' },
        { title: '难度', dataIndex: 'difficult', key: 'difficult' },
        { title: '完成数量', dataIndex: 'num', key: 'num' },
        { title: '订单状态', dataIndex: 'item_status', key: 'item_status' },
      ];
  
      return (
        <Table
          columns={columns}
          dataSource={data.items}
          pagination={false}
        />
      );
    };

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
        type: 'order/fetch',
        payload: params,
      });
    };
  

  
    render() {
      const {
        loading,
        order: { data },
     
      } = this.props;


      return (
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.cardList}>
              
              <StandardTable
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
              />
            </div>
          </Card>
         
        </PageHeaderWrapper>
      );
    }
  }
  
  export default OrderListPage;