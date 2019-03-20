import React ,{ Fragment }from 'react';
import { connect } from 'dva';
import { Row, Col, List, Icon, Card, Button, Avatar, Divider, Spin, Popconfirm, message, Tooltip  } from 'antd';
import router from 'umi/router';
// import { digitUppercase } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import FooterToolbar from '@/components/FooterToolbar';
import styles from './style.less';
import AddModal from './Addmodal';


 const addSuffix = (arr) => {
  if(arr.length === 0 ) {
    arr.push(false)
  } else if(arr[arr.length-1]){
    arr.push(false)
  }
 }

const removeSuffix = (arr) => {
  if(arr.length!==0 && arr[arr.length-1] === false){
    arr.pop()
  }
  const tmp = []
  arr.map(item => {  
   tmp.push({aid: item.aid, oid: item.oid, oiid: item.oiid,battle_site: item.battle_site}) 
    return tmp.aid
  })
  return tmp
}

const removeItemFromArr = (arr,itemId) => {
  let idx
   // eslint-disable-next-line
  arr.map((item,index) => {
    if(item.aid === itemId) {
      idx = index
    }
  })
  arr.splice(idx, 1)
  return arr
}
/**
 * 判断数组是否为另一个数组的子集, 是子集返回true,否则false
 * @param {Array} tarArr 目标数组
 * @param {Array} SrcArr  源数组
 */
const includesArr = (tarArr,SrcArr) => (
    tarArr.every(item => (
      SrcArr.includes(item)
    )
  )
)

 const onPrev = () => {
  router.push('/team/add/info');
};
const typeMap = {"0":'工作室账号',"1":"客户账号", "3": "借用账号"}

@connect(({ team, loading }) => ({
  submitting: loading.effects['team/add'],
  addAccountLoading: loading.effects['team/account'],
  team
}))

class Step2 extends React.Component {
  state = { 
    dAccount: [],
    tAccount: [],
    nAccount: [],
    success: true,
    req: {}
  }

  componentDidMount() {
    const {team:{group}} =this.props
    if(group.ret!==0){
      message.error(group.msg||'未检测到数据')
      onPrev()
    } else {
      
      const dataSource = group.data
      this.setState({
        req: group.req,
        dAccount: dataSource.d_account || [],
        tAccount: dataSource.t_account || [],
        nAccount: dataSource.n_account || []
      }, () => {
        const { dAccount, tAccount, nAccount} = this.state
        const AllAcount = [...dAccount,...tAccount,...nAccount]
        const AllAcountIds = [] 
        // eslint-disable-next-line
        AllAcount.map( v => {
          if(v.aid) {
            AllAcountIds.push(v.aid)
          }
        })
          addSuffix(dAccount)
          addSuffix(tAccount)
          addSuffix(nAccount)
         this.setState({
          success: true,
          AllAcountIds
         })
      })
    }
    
  }


  showModal = (e,local,) => {
    e.preventDefault()

    this.setState({
      local
    }, () => {
      this.handleSearch(0, true)
    })
   
    
  }

  handleModalVisible =() => {
    this.setState({
      modalVisible: false
    })
  }

  handleAdd = (selectedItemKeys, selectItems) => {
    const {AllAcountIds ,local, dAccount, tAccount, nAccount} = this.state
    if(!selectItems || selectItems.length === 0 || includesArr(selectedItemKeys,AllAcountIds)) {
      this.handleModalVisible()
      message.warning('未选择任何账号')
      return
    }
    switch(local) {
      case 'd':
        dAccount.splice(-1, 0 , ...selectItems)
      break;
      case 't':
        tAccount.splice(-1, 0, ...selectItems)
      break;
      case 'n':
        nAccount.splice(-1, 0, ...selectItems)
      break;
      default:
    }
    selectItems.map(v => (!AllAcountIds.includes(v) && AllAcountIds.push(v.aid)))
    this.setState({
      AllAcountIds,
      dAccount,
      tAccount,
      nAccount
    },() =>{
      this.handleModalVisible()
      message.success('已添加！')
    })
   
  }

  delItem =(e,item,local) => {
    e.preventDefault()
    const{ AllAcountIds, dAccount, tAccount, nAccount} = this.state
    if(item.aid){
      switch(local) {
        case 'd':
        removeItemFromArr(dAccount,item.aid)
        break;
        case 't':
        removeItemFromArr(tAccount,item.aid)
        break;
        case 'n':
        removeItemFromArr(nAccount,item.aid)
        break;
        default:
      }
      const tarIndex = AllAcountIds.findIndex(v => (v === item.aid))
      AllAcountIds.splice(tarIndex,1)
      this.setState({
        AllAcountIds,
        dAccount,
        tAccount,
        nAccount
      },() =>{
        message.success('已删除！')
      })
    } else{
      message.error('删除失败！')
    }
    
  }

  handleSearch = (values, isShow = false) => {
    const{dispatch} = this.props
    const { req, AllAcountIds, local } = this.state
    const types = ['team/account1', 'team/account2'];
    const type = parseInt(values.type, 10)
    const payLoad = {...req, battle_site:local,showed_accounts: AllAcountIds}
    if(values.f_account_name) Object.assign(payLoad, {account_name: values.f_account_name})
    if(values.f_game_role_name) Object.assign(payLoad, {game_role_name: values.f_game_role_name})
    dispatch({
      type: types[type] || types[0],
      payload: payLoad
    }).then(
      () => {
        const{team:{account:{data}}} =this.props
        if(data){
          const showData = data.list.filter(v => (!AllAcountIds.includes(v.aid)))
          
            this.setState({
              accountList: {list: showData, pagination: Object.assign(data.pagination, {showQuickJumper: false}) },
            })
            if(isShow) {
              this.setState({
                modalVisible: true
              })
            }
          
        } else{
          message.error('未获取待选列表！')
        }
        
      }
    ).catch(err=>message.error(err))
  }

  submit = () => {
    const{dispatch} = this.props
    const{req, dAccount, tAccount, nAccount} = this.state
    const accountArr = [
      ...removeSuffix(dAccount),
      ...removeSuffix(tAccount),
      ...removeSuffix(nAccount)
  ]
    const data = {...req, account_arr:accountArr}
    dispatch({
      type:'team/add',
      payload:data
    }).then(
      () => {
        const{team:{res}} = this.props
        if(res.ret===0) {
          message.success('提交成功！')
          router.push({
            pathname: '/team/list/detail',
            query:{
              id: res.data.tid,
              from: 'add'
            }
          })
        }else{
          message.error(res.msg)
        }
      }
    )
  }

  render() {
    const {addAccountLoading } = this.props
    const { dAccount, tAccount, nAccount, success, modalVisible, accountList, submitting} = this.state
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleSearch: this.handleSearch
    };
    return (
      <div>
        {
        success ?
          <Row gutter={{xs:1,sm: 4, md: 16, lg:32 }}>
            <Col span={8} className={styles.cardList}>
              <Divider>坦克(T)</Divider>
              <List
                itemLayout="vertical"
                size="small"
                split={false}
                dataSource={tAccount}
                renderItem={item => (
                  item ? (
                    <List.Item
                      key={item.id}
                    >
                      <Card 
                        hoverable 
                        className={styles.card}
                        actions={[
                          <Popconfirm title="是否要删除此账号？" okText="确定" cancelText="取消" onConfirm={e => {this.delItem(e, item,'t')}}>
                            <a>删除</a>
                          </Popconfirm>, 
                          ]}
                      >
                        <Card.Meta
                          avatar={<Avatar size="large" src={item.profession_img} style={{margin: "68% 0"}} />}
                          title={item.game_role_name}
                          description={
                            <Ellipsis className={styles.item} lines={9}>
                              {item.talent.map(((v, i)=>(
                                <Fragment>
                                  <span color="blue" key={`${i+1}`}>{v}</span> { i !== item.talent.length-1 && <Divider type="vertical" style={{margin: '0 3px'}} />}
                                </Fragment>
                              )))}
                             
                              <div>
                                <Tooltip
                                  placement="right" 
                                  title={
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                      <div>密码：{item.account_pwd}</div>
                                      <div>账号类型：{typeMap[item.type]}</div>
                                      <div>子账号：{item.child_name}</div>
                                      <div>服务器：{item.region_id}</div>
                                      <div>角色名：{item.game_role_name}</div>
                                      <div>角色等级：{item.level}</div>
                                      <div>阵营：{item.organization ===0 ?"联盟": '部落'}</div>
                                      <div>职业：{item.profession_name}</div>
                                      <div>可用天赋：{item.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</div>
                                      <div>装备等级：{item.equip_level}</div>
                                      <div>购买项目：{item.instance_name}<span style={{margin: '0 2px'}} />{item.difficult}<span style={{margin: '0 2px'}} /> {item.monsters}</div>
                                    </div>     
                                    }
                                >
                                  {item.account_name}
                                </Tooltip> 
                                
                              </div>
                            </Ellipsis>
                          }
                        />
                      </Card>
                    </List.Item>
                  ): (
                    <List.Item>
                      <Button type="dashed" className={styles.newButton} loading={addAccountLoading} onClick={e => {this.showModal(e,"t")}}>
                        <Icon type="plus" /> 补充账号
                      </Button>
                    </List.Item>
                  )
                  
                  )}
              />
            </Col>
            <Col span={8} className={styles.cardList}>
              <Divider>治疗(N)</Divider>
              <List
                itemLayout="vertical"
                size="small"
                split={false}
                dataSource={nAccount}
                renderItem={item => (
                  item ?(
                    <List.Item
                      key={item.title}
                    >
                      <Card 
                        hoverable 
                        className={styles.card}
                        actions={[
                          <Popconfirm title="是否要删除此账号？" okText="确定" cancelText="取消" onConfirm={e => {this.delItem(e, item,'n')}}>
                            <a>删除</a>
                          </Popconfirm>, 
                          ]}
                      >
                        <Card.Meta
                          avatar={<Avatar size="large" src={item.profession_img} style={{margin: "68% 0"}} />}
                          title={item.game_role_name}
                          description={
                            <Ellipsis className={styles.item} lines={3}>
                              <div>{item.talent.map(((v, i)=>(
                                <Fragment>
                                  <span color="blue" key={`${i+1}`}>{v}</span> { i !== item.talent.length-1 && <Divider type="vertical" style={{margin: '0 3px'}} />}
                                </Fragment>
                              )))}
                              </div>
                              <div>
                                <Tooltip
                                  placement="right" 
                                  title={
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                      <div>密码：{item.account_pwd}</div>
                                      <div>账号类型：{typeMap[item.type]}</div>
                                      <div>子账号：{item.child_name}</div>
                                      <div>服务器：{item.region_id}</div>
                                      <div>角色名：{item.game_role_name}</div>
                                      <div>角色等级：{item.level}</div>
                                      <div>阵营：{item.organization ===0 ?"联盟": '部落'}</div>
                                      <div>职业：{item.profession_name}</div>
                                      <div>可用天赋：{item.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</div>
                                      <div>装备等级：{item.equip_level}</div>
                                      <div>购买项目：{item.instance_name}<span style={{margin: '0 2px'}} />{item.difficult}<span style={{margin: '0 2px'}} /> {item.monsters}</div>
                                    </div>     
                                    }
                                >
                                  {item.account_name}
                                </Tooltip> 
                                
                              </div>
                              
                            </Ellipsis>
                          }
                        />
                      </Card>
                    
                    </List.Item> 
                  ): (
                    <List.Item>
                      <Button type="dashed" className={styles.newButton} loading={addAccountLoading} onClick={e=> {this.showModal(e,"n")}}>
                        <Icon type="plus" /> 补充账号
                      </Button>
                    </List.Item>
                  )
                  )}
              />
            </Col>
            <Col span={8} className={styles.cardList}>
              <Divider>输出(D)</Divider>
              <List
                itemLayout="vertical"
                size="small"
                split={false}
                dataSource={dAccount}
                renderItem={item => (
                  item ? (
                    <List.Item
                      key={item.id}
                    >
                      <Card 
                        hoverable 
                        className={styles.card}
                        actions={[
                          <Popconfirm title="是否要删除此账号？" okText="确定" cancelText="取消" onConfirm={e => {this.delItem(e, item,"d")}}>
                            <a>删除</a>
                          </Popconfirm>, 
                          ]}
                      >
                        <Card.Meta
                          avatar={<Avatar size="large" src={item.profession_img} style={{margin: "68% 0"}} />}
                          title={item.game_role_name}
                          description={
                            <Ellipsis className={styles.item} lines={3}>
                              <div>{item.talent.map(((v, i)=>(
                                <Fragment>
                                  <span color="blue" key={`${i+1}`}>{v}</span> { i !== item.talent.length-1 && <Divider type="vertical" style={{margin: '0 3px'}} />}
                                </Fragment>
                              )))}
                              </div>
                              <div>
                                <Tooltip
                                  placement="right" 
                                  title={
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                      <div>密码：{item.account_pwd}</div>
                                      <div>账号类型：{typeMap[item.type]}</div>
                                      <div>子账号：{item.child_name}</div>
                                      <div>服务器：{item.region_id}</div>
                                      <div>角色名：{item.game_role_name}</div>
                                      <div>角色等级：{item.level}</div>
                                      <div>阵营：{item.organization ===0 ?"联盟": '部落'}</div>
                                      <div>职业：{item.profession_name}</div>
                                      <div>可用天赋：{item.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</div>
                                      <div>装备等级：{item.equip_level}</div>
                                      <div>购买项目：{item.instance_name}<span style={{margin: '0 2px'}} />{item.difficult}<span style={{margin: '0 2px'}} /> {item.monsters}</div>
                                    </div>     
                                    }
                                >
                                  {item.account_name}
                                </Tooltip> 
                                
                              </div>
                              
                            </Ellipsis>
                          }
                        />
                      </Card>
                    </List.Item>
                  ): (
                    <List.Item>
                      <Button type="dashed" className={styles.newButton} loading={addAccountLoading} onClick={e => {this.showModal(e,'d')}}>
                        <Icon type="plus" /> 补充账号
                      </Button>
                    </List.Item>
                  )
                  )}
              />
            </Col> 
          </Row> :  <Spin size="large" />
        }
        <AddModal modalVisible={modalVisible} data={accountList} {...parentMethods} />
        <FooterToolbar style={{width: '100%'}}>
          <span>{tAccount.length}T-{nAccount.length}N-{dAccount.length}D，共计{tAccount.length + nAccount.length + dAccount.length}个</span>
          <Button type="primary" size="large" onClick={this.submit} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </div>
    );
  }
}

export default Step2;
