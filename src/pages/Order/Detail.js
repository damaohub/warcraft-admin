import React, { Component,Fragment } from 'react';

import { connect } from 'dva';
import {
  Card, Spin,Divider
} from 'antd';

import styles from './style.less';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;
const typeMap = {"0":'工作室账号',"1":"客户账号", "3": "借用账号"}
const usedMap ={'0': '本周可用','1':'本周已排','3':'本周已完成'}
const difficultMap = (difficult) => {
  switch (difficult) {
    case 'p':
        return '普通'
    case 'h':
        return '英雄' 
    case 'm':
        return '史诗' 
    default:
       return `史诗-${difficult}`
}
}

@connect(({ order, loading }) => ({
    order,
  loading: loading.models['order/info'],
}))
class DetailPage extends Component {
  state = {
  };

  componentWillMount() {
    const { dispatch, location: {query: {oid} }} = this.props

    dispatch({
      type: 'order/info',
      payload: {id: oid}
    }).then(
      () => {
        this.setState({
          loaded: true
        })
      }
    )

    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
  
  }


  render() {
    const { order:{info}, loading } = this.props;
    const {loaded} = this.state
    const data = info
  
    return (
      loaded? 
        <PageHeaderWrapper>
          
          <Card title="订单信息" style={{ marginBottom: 24 }} bordered={false} loading={loading}>
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="订单号">{data.id}</Description>
              <Description term="联系电话">{data.phone}</Description>
              <Description term="订单状态">{data.status==="1"?'未完成': '已完成'}</Description>
              <Description term="创建时间">{data.create_time}</Description>
              <Description term="完成时间">{data.finish_time}</Description>
              <Description term="备注">{data.remark}</Description>
            </DescriptionList>
            <DescriptionList className={styles.accountList} style={{ marginBottom: 24 }} title="账号信息：">
              <Description term="账号">{data.account_name}</Description>
              <Description term="密码">{data.account_pwd}</Description>
              <Description term="类型">{typeMap[data.type]}</Description>
              <Description term="子账号">{data.child_name}</Description>
              <Description term="服务器">{data.region_id}</Description>
              <Description term="角色名">{data.game_role_name}</Description>
              <Description term="角色等级">{data.level}</Description>
              <Description term="阵营">{data.organization ===0 ?"联盟": '部落'}</Description>
              <Description term="职业">{data.profession_name}</Description>
              <Description term="可用天赋">{data.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</Description>
              <Description term="装等">{data.equip_level}</Description>
            </DescriptionList>
            <h4 style={{ marginBottom: 16 }}>项目：</h4>
            {
              data.items.map(v=> (
                <Fragment>
                  <Card style={{marginLeft: '20px'}} type="inner" title={`项目号：${v.item_id}`}>
                    <DescriptionList size="small" style={{ marginBottom: 16 }}>
                      <Description term="类型">{v.instance_or_secret==="1"?'地下城':'团本'}</Description>
                      <Description term="副本">{v.instance_name}</Description>
                      <Description term="怪物">{v.monster_id}</Description>
                      <Description term="难度">{difficultMap(v.difficult)}</Description>
                      <Description term="项目数量">{v.num==="-1"?'包版本':v.num}</Description>
                      <Description term="完成数量">{v.finish_num}</Description>
                      <Description term="账号可用状态">{usedMap[v.week_used]}</Description>
                      <Description term="项目状态">{v.item_status==="0"?'未完成':'已完成'}</Description>
                      <Description term="上次完成时间">{v.last_finish_time}</Description>
                    </DescriptionList>
                  
                  </Card>
                  <div style={{ margin: '16px 0' }} />
                </Fragment>
              ))
            }
          
            
          </Card>
          
        </PageHeaderWrapper>: <Spin size="large" />
    );
  }
}

export default DetailPage;