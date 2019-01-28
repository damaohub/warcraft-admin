import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../GameRole/game.less';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, player }) => ({
    player,
    Loading: loading.models.player,
  }))
  class PlayerPage extends PureComponent {
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
     
    
    ];

    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'player/fetch',
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
        type: 'player/fetch',
        payload: params,
      });
    };
  

  
    render() {
      const {
        loading,
        player: { data },
     
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
              />
            </div>
          </Card>
         
        </PageHeaderWrapper>
      );
    }
  }
  
  export default PlayerPage;