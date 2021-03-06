/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
  Tooltip,
  Avatar,
  Input,
  Form,
  Icon,
  Tag,
  Popover,
  Upload
} from 'antd';

import saltMD5 from '@/utils/saltMD5'
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddModal from './Add/Addmodal';

import styles from './AdvancedProfile.less';

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;
const typeMap = {"0":'工作室账号',"1":"客户账号", "3": "借用账号"}
const positionMap = {"d":'输出',"t":"坦克", "n": "治疗"}
const typeTag = {"0":'工',"1":"客", "2": "借"}
const typeTagColor = {"0":'blue',"1":"green", "2": "orange"}
const subStatusMap= {'0': '未提交', '1': '已提交'}
const subStatusColors ={'0': '#ff9500', '1': '#4cd964'}

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

const createSign = (obj) => {
  let str = ''
  const sortedKeys = Object.keys(obj).sort()
  let tmp
  // eslint-disable-next-line
  for (let elem of sortedKeys.values()) {
    tmp = obj[elem]
   if(typeof  obj[elem] !== "string") {
      // eslint-disable-next-line
     tmp =JSON.stringify(obj[elem])
   }

  if(obj[elem]) {
    str += (elem.toString() + tmp)
   }
  }

  return saltMD5.md5(str)
}


@Form.create()
@connect(({ team, loading }) => ({
    team,
    loading: loading.effects['team/info'],
    staffLaoding: loading.effects['team/staff'],
    downLoadPathLoading: loading.effects['team/download']
}))
class TeamDetailPage extends Component {
  state = {
    visible: false,
    loaded: false,
    delModal: false,
    statusMap: {"1": "未完成","2": "待审核", "3": "已完成"}
  };

  colums1 = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render:(text,record,index)=>`${index+1}`,
    },
  
    {
      title: <div style={{textAlign: 'center',margin: '0 auto'}}>账号</div>,
      dataIndex: 'game_role_name',
      key: 'game_role_name',
      align: 'justify',
      width: 300,
      render: (item,record) => (
        <Fragment>
          <Tag style={{display: "inline",marginRight: '10px'}} color={typeTagColor[record.type]}>{typeTag[record.type]}</Tag>
          <Tooltip title={record.profession_name}>
            <Avatar src={record.profession_img} />
          </Tooltip>
          
          <Tooltip 
            placement="right" 
            title={
              <div style={{display:"flex",flexDirection:"column"}}>
                <div>账号：{record.account_name}</div>
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
                <div>联系方式：{record.account_phone}</div>
                {record.account_remark? <div>备注：{record.account_remark}</div>: null}
                
              </div>     
              }
          >
            <div style={{display: "inline-block"}}>{item}</div>
          </Tooltip>
        </Fragment>
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
      render: (item, record) => (
        item.length === 0? '暂无截图':
        <Fragment>
          <Zmage
            style={{width: '100px',height: '50px'}}
            src={item[0]}
            alt={`点击查看共${item.length}张截图`}
            set={
              getImageSet(item)
            }
          />
          <Icon type="cloud-download" onClick={e => {this.goDownItem(e, record)}} title="下载打包截图" style={{color: "#1890FF", fontSize: '20px', cursor: 'pointer', marginLeft: '5px'}} />
        </Fragment>
      )
      
    },
    {
      title: '安全令',
      key: 'checkfile',
      dataIndex: 'checkfile',
      align: 'center',
      render: (item, record) => (<Fragment>{item===null?<span>未上传</span>:<span style={{color:"#4cd964"}}>已上传</span>}<Icon onClick={e => {this.showCheckModal(e, record)}} type="upload" style={{color: '#1890FF', fontSize: '20px'}} title='上传安全令' /></Fragment>)
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
      // render: item => (item==="0"?<span style={{color: "orange"}}>未提交</span>:<span style={{color: "green"}}>已提交</span>)
      render: (item, record) => (
        <Fragment>
          {<span style={{color: subStatusColors[item]}}>{subStatusMap[item]}</span>}
          <Popconfirm 
            title={<span><span>确定要更改状态为:</span>{item === '0'? <span style={{color:'#ff4d4f'}}>提交</span>: <span style={{color:'#ff4d4f'}}>未提交</span>}</span>}
            okText="确定"
            cancelText="取消"
            onConfirm={e => {this.changeSubStatus(e,record)}}
          >
            <Icon type="edit" title="修改状态" />
          </Popconfirm>
        </Fragment>
      )
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {record.uid !== "0" && <Button type="primary" disabled={record.status!=="0"} size="small" ghost onClick={e=>{this.unbind(e,record)}}>解绑</Button> }
          { record.uid === '-1' && 
            <Fragment> 
              <Divider type="vertical" style={{margin: '0 4px'}} />
              <Popover 
                title={this.state.linkCode? 
                  <div> 
                    <span style={{marginRight: '5px', textDecoration: record.status!=="0"? 'line-through': ''}}>
                      {`http://${ window.location.host}/#/login1?code=${this.state.linkCode}`}
                    </span>
                    <CopyToClipboard
                      onCopy={this.copy}
                      text={`http://${ window.location.host}/#/login1?code=${this.state.linkCode}`}
                    >
                      <Button type="primary" ghost size="small">复制</Button>
                    </CopyToClipboard>
                    
                  </div>:
                  <Spin size="small" />
                }
                content={this.state.password? `密码: ${this.state.password}`: <Spin size="small" />}
                trigger="click"
              >
                <Button type={record.status!=="0"? 'danger' :"primary"} size="small" ghost onClick={e => {this.seeMjLink(e, record)}}>链接</Button>
              </Popover>
              
            </Fragment>
          }
          {
            record.uid ==="0" &&
            <Fragment>
              <Button type="primary" size="small" ghost onClick={e=>{this.showModal(e,record)}}>团员</Button>
              <Divider type="vertical" style={{margin: '0 4px'}} />
              <Button type="primary" size="small" onClick={e=> {this.showMjModal(e, record)}} ghost>马甲</Button>
            </Fragment>
          }

          <Divider type="vertical" style={{margin: '0 4px'}} />
          <a onClick={e=> {this.showDel(e,record)}}>删除</a>
        </Fragment>
      ),
      align: 'center',
      width: 200
    },
  ]


  colums2 = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render:(text,record,index)=>`${index+1}`,
    },

    {
      title: <div style={{textAlign: 'center',margin: '0 auto'}}>账号</div>,
      dataIndex: 'game_role_name',
      key: 'game_role_name',
      align: 'justify',
      width: 300,
      render: (item,record) => (
        <Fragment>
          <Tag style={{display: "inline",marginRight: '10px'}} color={typeTagColor[record.type]}>{typeTag[record.type]}</Tag>
          <Tooltip title={record.profession_name}>
            <Avatar src={record.profession_img} />
          </Tooltip>
          <Tooltip 
            placement="right" 
            title={
              <div style={{display:"flex",flexDirection:"column"}}>
                <div>账号：{record.account_name}</div>
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
                <div>联系方式：{record.account_phone}</div>
                {record.account_remark? <div>备注：{record.account_remark}</div>: null}
                
              </div>     
              }
          >
            <div style={{display: "inline-block"}}>{item}</div>
          </Tooltip>
        </Fragment>
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
      render: (item,record) => (
      item.length === 0? '暂无截图':
      <Fragment>
        <Zmage
          style={{width: '100px',height: '50px'}}
          src={item[0]}
          alt={`点击查看共${item.length}张截图`}
          set={
            getImageSet(item)
          }
        />
        <Icon type="cloud-download" onClick={e => {this.goDownItem(e,record)}} title="下载打包截图" style={{color: "#1890FF", fontSize: '20px', cursor: 'pointer', marginLeft: '5px'}} />
      </Fragment>
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
      title: '删除原因',
      dataIndex: 'del_msg',
      key: 'del_msg',
      align: 'center'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Popconfirm title="是否要移除该账号？" okText="确定" cancelText="取消" onConfirm={() => this.handleRemove(record)}>
          <a>删除</a>
        </Popconfirm>
      )
    }
  ]

  componentWillMount() {
    const { dispatch, location: {query: {id} }} = this.props
    dispatch({
      type: 'team/staff',
      payload: {'tid': id}
    });
    dispatch({
      type: 'team/info',
      payload: {id}
    }).then(() => {
      const { team: {info}} = this.props
      this.setState({
        accountList:info.account_list,
        delList: info.account_del_list,
        tid: id,
        loaded: true
      }, () => {
        const {accountList}=this.state;
        this.checkImg(accountList)
      })
    });

  
  
    window.addEventListener('resize', this.setStepDirection, { passive: true });
   
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
  
  }

  checkImg = (list) => {
    const flag = list.every(item => (item.screenshots_arr && item.screenshots_arr.length === 0))
    this.setState({
      noDownLoad: flag
    })
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

  showDel = (e, record) => {
    e.preventDefault()
    this.setState({
      delModal: true,
      delCurrent: record
    })
  }

  handleDelCancel = () => {
    this.setState({
      delModal: false
    })
  }

  showAddModal = (e) => {
    e.preventDefault()
    this.handleSearch(0, true)
  }

  handleModalVisible =() => {
    this.setState({
      modalVisible: false
    })
  }

  handleSearch = (values, isShow = false) => {
    const{dispatch} = this.props
    const { tid } = this.state
    const types = ['team/account3', 'team/account4'];
    const type = parseInt(values.type, 10)
    const payLoad = {tid}
    if(values.f_battle_site) { 
      Object.assign(payLoad, {battle_site: values.f_battle_site})
    } else {
      Object.assign(payLoad, {battle_site: 't'})
    }
    if(values.f_account_name) Object.assign(payLoad, {account_name: values.f_account_name})
    if(values.f_game_role_name) Object.assign(payLoad, {game_role_name: values.f_game_role_name})
    dispatch({
      type: types[type] || types[0],
      payload: payLoad
    }).then(
      () => {
        const{team:{account:{data}}} =this.props
        if(data){ 
          this.setState({
            accountAddList: {list: data.list, pagination: Object.assign(data.pagination, {showQuickJumper: false}) },
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

  handleAdd = (selectedItemKeys, selectItems) => {
    if(!selectItems || selectItems.length === 0 ) {
      this.handleModalVisible()
      message.warning('未选择任何账号')
      return
    }

    const { dispatch } = this.props
    const {tid} = this.state
    const items = selectItems.map(item => (
      {aid: item.aid, oid: item.oid, oiid: item.oiid, battle_site: item.battle_site}
    ))
    dispatch({
      type:'team/addaccount',
      payload: {tid, account_arr: items}
    }).then(
      () => {
        const{team: {res}} = this.props
        if(res.ret === 0) {
          this.setState({modalVisible: false})
          dispatch({
            type: 'team/info',
            payload: {id: tid}
          }).then(
            () => {
              const { team: {info}} = this.props
              this.setState({
                accountList:info.account_list,
              }, ()=> {
                const {accountList} =this.state
                this.checkImg(accountList)
              })
            }
          )
          message.success('添加成功！')
        }
      }
    )
  }

  handleDelete = record => {
    const { dispatch, form} = this.props
    const {tid} =this.state
    form.validateFields(['del_msg'], (err, values) => {
      if (!err) {
        // eslint-disable-next-line camelcase
        const { del_msg } =values
        dispatch({
          type: 'team/delaccount',
          payload: { tid, aid: record.aid, del_msg}
        }).then(
          () =>{
            const{team: {res}} = this.props
            if(res.ret === 0) {
              dispatch({
                type: 'team/info',
                payload: {id: tid}
              }).then(
                () => {
                  const { team: {info}} = this.props
                  this.setState({
                    accountList:info.account_list,
                  },()=> {
                    const {accountList} =this.state
                    this.checkImg(accountList)
                  })
                }
              )
              message.success('已删除')
            }
            this.setState({
              delModal: false
            })
          }
        )
      }
    })
   
  }

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

  handleRemove = record => {
    const {dispatch} =this.props;
    const {tid} =this.state
    dispatch({
      type:'team/removeproblem',
      payload: { tid, aid: record.aid, oiid: record.oiid}
    }).then(
      () => {
        
        const{team: {res}} = this.props
        if(res.ret === 0) {
          dispatch({
            type: 'team/info',
            payload: {id: tid}
          }).then(
            () => {
              const { team: {info}} = this.props
              this.setState({
                delList: info.account_del_list
              })
             
            }
          )
          message.success('已移除！')
        }

      }
    )
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch} = this.props
    const { selectItem, currentRow, accountList, tid} = this.state;
   
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

  goDown = () => {
    const { dispatch } = this.props
    const { tid } =this.state;
    dispatch({
      type: 'team/download',
      payload: {tid}
    }).then(
      ()=>{
        const {team: {downLoadLink}} = this.props;
        if(downLoadLink && downLoadLink.ret === 0) {
          const {data} = downLoadLink
          window.location.href = data.download_path
        }
      }
    );
  }

  goDownItem = (e, record) => {
    e.preventDefault();
    const { dispatch } = this.props
    const { tid } =this.state;
    dispatch({
      type: 'team/downloaditem',
      payload: {tid, aid: record.aid}
    }).then(
      ()=>{
        const {team: {downLoadLink}} = this.props;
        if(downLoadLink && downLoadLink.ret === 0) {
          const {data} = downLoadLink
          window.location.href = data.download_path
        }
      }
    );
  }

  showMjModal = (e, record) => {
    e.preventDefault();
    this.setState({
      mjVisible: true,
      curMj: record
    })
  }

  handleMjCancel = () => {
    this.setState({
      mjVisible: false
    })
  }

  getMjLink = record => {
    const { dispatch, form } = this.props
    const { tid } =this.state;
    form.validateFields(['password'], (err, values) => {
     if(!err) {
      dispatch({
        type: 'team/getmjlink',
        payload: {tid, aid: record.aid, password: values.password}
      }).then(
        () => {
          const{team: {res}} = this.props
          if(res.ret === 0) {
            dispatch({
              type: 'team/info',
              payload: {id: tid}
            }).then(
              () => {
                const { team: {info}} = this.props
                this.setState({
                  accountList:info.account_list,
                },()=> {
                  const {accountList} =this.state
                  this.checkImg(accountList)
                })
              }
            )
            message.success('链接已生成！');
          }
          this.handleMjCancel();
        }
      )
     }  
    })
  }

  seeMjLink = (e, record) => {
    e.preventDefault();
    const { dispatch } = this.props
    const { tid } =this.state;
    dispatch({
      type: 'team/seemjlink',
      payload: {tid, aid: record.aid}
    }).then(
      () => {
        const {team: {mjLink}} = this.props;
       if(mjLink && mjLink.ret ===0) {
         this.setState({
          linkCode:mjLink.data.linkcode,
          password: mjLink.data.password
         })
       }
      }
    )
  }

  copy = (text, result) => {
    if(result) {
      message.success('已经复制到剪切板')
    } else {
      message.error('操作失败')
    }
  
  };

  changeSubStatus = (e, record) => {
    e.preventDefault()
    const { dispatch }=this.props;
    const { tid } = this.state;
    dispatch({
      type: 'team/change',
      payload: {tid, aid: record.aid}
    }).then(
      () => {
        const {team: {res}} =this.props;
        if(res.ret === 0) {
          dispatch({
            type: 'team/info',
            payload: {id: tid}
          }).then(
            () => {
              const { team: {info}} = this.props
              this.setState({
                accountList:info.account_list,
              })
            }
          )
          message.success('状态已修改！')
        }
        
      }
    )
  }

  showCheckModal = (e, record) => {
    e.preventDefault();
    this.setState({
      checkVisible: true,
      curCheck: record
    })
  }

  handleCheckCancel = () => {
    this.setState({
      checkVisible: false
    })
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.file;
  }

  subCheckFile =(record) => {
    const { dispatch, form } = this.props
    const { tid } =this.state;
    form.validateFields(['file'], (err, values) => {
      
      if(!err) {
        dispatch({
          type: 'team/checkfileadd',
          payload: {checkfile: values.file.response.data, aid: record.aid}
        }).then(
          () => {
            const {team: {res}} = this.props;
            if(res.ret ===0 ) {
              dispatch({
                type: 'team/info',
                payload: {id: tid}
              }).then(
                () => {
                  const { team: {info}} = this.props
                  this.setState({
                    accountList:info.account_list,
                  })
                }
              )
              message.success("已上传！");
            }
            this.handleCheckCancel()
          }
        )
      }
    })
  }

  render() {
    const {team: {info}, loading, team:{staff}, downLoadPathLoading } = this.props;
    const {loaded, statusMap, visible, accountList, accountAddList, delList, modalVisible, delModal, delCurrent, noDownLoad, mjVisible, curMj, checkVisible, curCheck={} } =this.state
    const teamInfo= info.team_info
    const time = Date.parse(new Date()) / 1000;
    const token = localStorage.getItem('token')? JSON.parse(localStorage.getItem('token')) : null;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleSearch: this.handleSearch
    };
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
              <div> <Button type='primary' loading={downLoadPathLoading} disabled={noDownLoad} icon="download" onClick={this.goDown}>{noDownLoad?'暂无截图': '下载团队打包截图'}</Button></div>
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
        
        <Card title="团队账号" style={{ marginBottom: 24 }} bordered={false} extra={<Button type="primary" onClick={e => this.showAddModal(e)}>添加账号</Button>}>

          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={accountList}
            columns={this.colums1}
            rowKey="id"
          />
        </Card>
        <Card title="问题单" style={{ marginBottom: 24 }} bordered={false}>

          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={delList}
            columns={this.colums2}
            rowKey="id"
          />
        </Card>
        <Modal
          title="马甲验证密码"
          centered
          width={640}
          destroyOnClose
          visible={mjVisible}
          onOk={() => this.getMjLink(curMj)}
          onCancel={this.handleMjCancel}
          maskClosable={false}
        >
          <Form>
            <Form.Item>
              {this.props.form.getFieldDecorator('password', {
                rules: [{ required: true, message: '输入马甲验证密码' }],
              })(
                <Input placeholder="输入马甲验证密码" /> 
              )}
              
            </Form.Item>
          </Form>
        </Modal>
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

        <AddModal modalVisible={modalVisible} data={accountAddList} battleSite {...parentMethods} />
        <Modal
          title="确认删除"
          visible={delModal}
          onOk={() => this.handleDelete(delCurrent)}
          destroyOnClose
          onCancel={this.handleDelCancel}
        >
          <Form>
            <Form.Item>
              {this.props.form.getFieldDecorator('del_msg', {
                rules: [{ required: true, message: '输入删除的原因' }],
              })(
                <Input placeholder="输入原因" /> 
              )}
              
            </Form.Item>
          </Form> 
        </Modal>
        <Modal
          title="上传安全令"
          visible={checkVisible}
          onOk={() => this.subCheckFile(curCheck)}
          destroyOnClose
          onCancel={this.handleCheckCancel}
        >
          <Form>
            <Form.Item>
              {this.props.form.getFieldDecorator('file', {
                  valuePropName: 'file',
                  getValueFromEvent: this.normFile,
                  rules: [{ required: true, message: '未上传文件' }],
                })(
                  <Upload 
                    action={`http://${window.location.host}/api/team/updatecheckfile`} 
                    data={{time, token, sign: createSign({time, token, aid: curCheck.aid || null}), aid: curCheck.aid || null }}
                    listType="picture"
                  >
                    <Button>
                      <Icon type="upload" />点击上传
                    </Button>
                  </Upload>
              )}
              
            </Form.Item>
          </Form> 
        </Modal>
      </PageHeaderWrapper>: <Spin size="large" />
    );
  }
}

export default TeamDetailPage;