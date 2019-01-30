import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../GameRole/game.less';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, team }) => ({
    team,
    Loading: loading.models.team,
  }))
  class TeamListPage extends PureComponent {
    state = {
    };

    columns = [
      {
        title: '团长',
        dataIndex: 'leader_name',
        key: 'leader_name',
        align: 'center',
      },
      {
        title: '人数',
        dataIndex: 'mem_num',
        key: 'mem_num',
        align: 'center',
      },
      {
        title: '难度',
        dataIndex: 'difficult',
        key: 'difficult',
        align: 'center',
        render: item => {
            switch (item) {
                case 'p':
                    return '普通'
                case 'h':
                    return '英雄' 
                case 'm':
                    return '史诗' 
                default:
                   return `史诗'-${item}`
            }
        }
      },
      {
        title: '副本',
        dataIndex: 'instance_name',
        key: 'instance_name',
        align: 'center',
      },
      {
        title: '阵营',
        dataIndex: 'organization',
        key: 'organization',
        align: 'center',
        render: item=> (
            item==="1"? '联盟': '部落'
        )
      },
      {
        title: '配比',
        dataIndex: 'battle_array_name',
        key: 'battle_array_name',
        align: 'center',
        
      },
      {
        title: '开团时间',
        dataIndex: 'reserve_time',
        key: 'reserve_time',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'finish_time',
        key: 'finish_time',
        align: 'center',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a href={`#/team/list/detail?id=${record.id}`}>排团详情</a>
          </Fragment>
        ),
        align: 'center',
      },
    
    ];

    componentWillMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'team/fetch',
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
        type: 'team/fetch',
        payload: params,
      });
    };
  

  
    render() {
      const {
        Loading,
        team: { data },
     
      } = this.props;


      return (
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.cardList}>
              
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
  
  export default TeamListPage;