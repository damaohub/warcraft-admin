import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import {
  Card,
  Table,
  Row,
  Col,
  Spin,
  Button,
  Modal,
  Radio,
  List,
  Empty,
  Divider,
  message,
  Popconfirm,
  Tooltip
} from 'antd';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './AdvancedProfile.less';

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;
const typeMap = {"0":'工作室账号',"1":"客户账号", "3": "借用账号"}
const positionMap = {"d":'输出',"t":"坦克", "n": "治疗"}
const getImageSet = (arr) => {
  const tmpArr = []
  arr.map((v,i)=>{
    tmpArr.push ({
      src: v,
      alt: `图片${i}`
    })
    return v
  })
  return tmpArr
}

@connect(({ team, loading }) => ({
    team,
    loading: loading.effects['team/info'],
    staffLaoding: loading.effects['team/staff']
}))
class TeamDetailPage extends Component {
  state = {
    visible: false,
    loaded: false,
    statusMap: {"1": "未完成","2": "待审核", "3": "已完成"}
  };

  colums = [
    
    {
      title: '账号',
      dataIndex: 'account_name',
      key: 'account_name',
      align: 'center',
      render: (item,record) => (
        <Tooltip 
          placement="right" 
          title={
            <div style={{display:"flex",flexDirection:"column"}}>
              <div>密码：{record.account_pwd}</div>
              <div>账号类型：{typeMap[record.type]}</div>
              <div>子账号：{record.child_name}</div>
              <div>服务器：{record.region_id}</div>
              <div>角色名：{record.game_role_name}</div>
              <div>角色等级：{record.level}</div>
              <div>阵营：{record.organization==='0'?'联盟':'部落'}</div>
              <div>职业：{record.profession_name}</div>
              <div>可用天赋：{record.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</div>
              <div>装备等级：{record.equip_level}</div>
              
            </div>     
            }
        >
          {item}
        </Tooltip>
      )
    },
   
    {
      title: '位置',
      dataIndex: 'battle_site',
      key: 'battle_site',
      align: 'center',
      render: item => (positionMap[item])
    },
    {
      title: '截图',
      dataIndex: 'screenshots_arr',
      key: 'screenshots_arr',
      align: 'center',
      render: (item) => (
      item.length === 0? '暂无截图':
      <Zmage
        style={{width: '100px',height: '50px'}}
        src={item[0]}
        alt={`点击查看共${item.length}张截图`}
        set={
          getImageSet(item)
        }
      />
      )
      
    },
    {
      title: '操号团员',
      key: 'play_name',
      dataIndex: 'play_name',
      align: 'center',
      render: (item) => (item===null?<span style={{color:"red"}}>无</span>:<span style={{color:"green"}}>{item}</span>)
    },
    {
      title: '提交状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: item => (item==="0"?<span style={{color: "orange"}}>未提交</span>:<span style={{color: "green"}}>已提交</span>)
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {record.uid !=="0"?
            <Button type="primary" disabled={record.status!=="0"} size="small" ghost onClick={e=>{this.unbind(e,record)}}>解绑团员</Button>:
            <Button type="primary" size="small" ghost onClick={e=>{this.showModal(e,record)}}>团员绑定</Button>
          }
          {/* <Divider type="vertical" style={{margin: '0 2px'}} />
          <a href={`#/account/detail?id=${record.id}`}>详情</a> */}
        </Fragment>
      ),
      align: 'center',
    },
  ]
  
  componentWillMount() {
    const { dispatch, location: {query: {id} }} = this.props
    dispatch({
      type: 'team/info',
      payload: {id}
    }).then(() => {
      const { team: {info}} = this.props
      this.setState({
        accountList:info.account_list,
        loaded: true
      })
    });

    dispatch({
      type: 'team/staff',
      payload: {'tid': id}
    })
    this.setState({
      tid: id
    })
    window.addEventListener('resize', this.setStepDirection, { passive: true });
   
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
  
  }


  handleCheck = () => {
    const {dispatch} =this.props
    const {tid} =this.state
    dispatch({
      type: 'team/check',
      payload: {id: tid}
    }).then(
      () => {
        const{team: {res}} = this.props
        if(res.ret === 0) {
          message.success('审核已通过！')
          dispatch({
            type: 'team/info',
            payload: {id: tid}
          })
        } else{
          message.error(res.msg)
        }
         
      }
    )
  }

  showModal = (e, record) => {
    e.preventDefault()
    const { dispatch} = this.props
    const {tid} =this.state
    dispatch({
      type: 'team/staff',
      payload: {tid}
    })
    this.setState({
      visible: true,
      currentRow: record
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  radioChange= (e) => {
    e.preventDefault()
    this.setState({
      selectItem: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch} = this.props
    const { selectItem, currentRow, accountList, tid } = this.state;
   
    this.handleCancel()
    dispatch({
      type: 'team/bind',
      payload: {tid, aid: currentRow.aid, uid:selectItem.id }
    }).then(
      () => {
        const{team: {res}} = this.props
        if(res.ret === 0) {
          currentRow.uid = selectItem.id
          currentRow.play_name = selectItem.real_name
          // eslint-disable-next-line
          accountList.map( v => {
            if(v.aid === currentRow.aid) {
              // eslint-disable-next-line
              v = currentRow
            }
          })
          this.setState({
            accountList
          },() => {
            message.success('绑定成功！')
          })
          
        } else{
          message.error(res.msg)
        }
         
      }
    )
    
  };

  unbind= (e, item) => {
    e.preventDefault();
    const {dispatch} = this.props
    this.setState({
      currentRow: item
    },()=> {
      const{currentRow, tid, accountList} =this.state
      dispatch({
        type: 'team/unbind',
        payload: {tid, aid: currentRow.aid, uid:currentRow.uid }
      }).then( 
        () => {
          const{team: {res}} = this.props
          if(res.ret ===0) {
            // eslint-disable-next-line
            accountList.map( v => {
              if(v.aid === currentRow.aid) {
                // eslint-disable-next-line
                v.play_name =null
                // eslint-disable-next-line
                v.uid = "0"
              }
            })
            this.setState({
              accountList
            },() => {
              message.success('已解除绑定！')
            })
          } else {
            message.error(res.msg)
          }
          
        }
      )
    });
    
  }



  render() {
    const {team: {info}, loading, team:{staff} } = this.props;
    const {loaded, statusMap, visible, accountList} =this.state
    const teamInfo= info.team_info

    const modalFooter = { okText: '保存', onOk: this.handleSubmit, cancelText:'取消', onCancel: this.handleCancel };
    
    const getModalContent = (data) => (
      data.length !== 0? 
      (
        <RadioGroup onChange={e=>{this.radioChange(e)}} className={styles.modalList}>
          {
            data.map( (item) => (
              
              <Radio value={item} key={item.id}>
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={item.real_name?item.real_name:'未录入'}
                    description={item.username}
                  />
                  {/* <div style={{margin:"0 30px"}}><div>{item.role_id}</div><div>{item.status}</div></div> */}
          
                </List.Item>  
              </Radio>
            ))
          }  
        </RadioGroup>
      ):(<Empty description="已没有团员" />)
      
    )


    return (loaded? 
      <PageHeaderWrapper
        title={`团号：${teamInfo.id}`}
        content={
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="团长">{teamInfo.leader_name}</Description>
            <Description term="团员总数">{teamInfo.mem_num}</Description>
            <Description term="创建时间">{teamInfo.create_time}</Description>
            <Description term="团队配比">{teamInfo.battle_array}</Description>
            <Description term="开团时间">{teamInfo.reserve_time}</Description>
            <Description term="确认人">{teamInfo.check_name}</Description>
            <Description term="完成时间">{teamInfo.finish_time}</Description>
            <Description term="难度">{teamInfo.difficult }</Description>
            <Description term="副本">{teamInfo.instance_name}</Description>
            <Description term="阵营">{teamInfo.organization==="0"? '联盟': '部落'}</Description>
          </DescriptionList>
        }
        extraContent={
          <Row>
            <Col xs={24} sm={12}>
              <div className={styles.textSecondary}>订单状态：{teamInfo.status==="2"?statusMap[teamInfo.status]: ''}</div>
              <div className={styles.heading}>
                {
                  teamInfo.status==="2"?
                    <Popconfirm title="是否要通过审核？" okText="确定" cancelText="取消" onConfirm={() => this.handleCheck()}>
                      <Button type="primary">审核通过</Button>
                    </Popconfirm>:
                    statusMap[teamInfo.status]
                }
              </div>
            </Col>
            {/* <Col xs={24} sm={12}>
              <div className={styles.textSecondary}>订单金额</div>
              <div className={styles.heading}>¥ 0.00</div>
            </Col> */}
          </Row>
        }
      >
        
        <Card title="团队账号" style={{ marginBottom: 24 }} bordered={false}>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={accountList}
            columns={this.colums}
            rowKey="id"
          />
        </Card>
        <Modal
          title='账户添加'
          centered
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
          maskClosable={false}
        >
          {getModalContent(staff)}
        </Modal>
      </PageHeaderWrapper>: <Spin size="large" />
    );
  }
}

export default TeamDetailPage;