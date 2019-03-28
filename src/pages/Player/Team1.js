import React, { Component, } from 'react';
import { connect } from 'dva';
import {
  Card,
  Spin,
  Button,
  message,
  Upload,
  Icon,
  Divider,
  Modal,
  Popconfirm,
  Empty,
  Alert,
} from 'antd';

import router from 'umi/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import saltMD5 from '@/utils/saltMD5'

import styles from '../Team/AdvancedProfile.less';

const { Description } = DescriptionList;
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

const typeMap = {"0":'工作室账号',"1":"客户账号", "2": "借用账号"}
@connect(({ player, loading }) => ({
    player,
   
    loading: loading.effects['player/loginhtm'],
    submitting: loading.effects['player/screenadd'],
    finishLoading: loading.effects['player/finish']
}))
class TeamDetailPage extends Component {
  state = {
    loaded: false,
    statusMap: {"1": "未完成","2": "待审核", "3": "已完成"},
    fileList: [],
    urlList: [],
    uploading: false,
  };

  componentWillMount() {
    const { dispatch, location: {query: {code}} } = this.props
    dispatch({
      type: 'player/loginhtm',
      payload: {}
    }).then(() => {
      const { player:{team} } =this.props
      const screenshots = team.account_list.screenshots_arr
      const tid = team.team_info.id
      this.setState({
        code,
        tid,
        urlList: [],
        screenList: screenshots,
        loaded: true
      })
    });
  
    window.addEventListener('resize', this.setStepDirection, { passive: true });
   
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
  
  }

  handlePreview = (file,e) => {
    if(e) e.preventDefault();
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }



  handleCancel = () => this.setState({ previewVisible: false })

  handleUpload = e => {
    e.preventDefault();
    const { dispatch, player:{team} } = this.props;
    const {tid, urlList} = this.state
    const {aid, uid} = team.account_list
    dispatch({
      type: 'player/screenadd',
      payload: {aid, uid, tid, images: urlList}
    }).then(
      () => {
        const { player: {res} } = this.props;
        if(res && res.ret === 0) { 
          this.setState({ fileList: [], urlList: [] },() => {
            message.success("提交成功！");
            dispatch({
              type: 'player/loginhtm',
              payload: {id: tid}
            }).then(() => {
              // eslint-disable-next-line
              const {player: {team}} =this.props
              const screenshots = team.account_list.screenshots_arr
              this.setState({
                screenList: screenshots || []
              })
            });
          })
        }
      }
    );
      
  
  };

  delScreen = (e,img) => {
    e.preventDefault();
    const {dispatch, player:{team}} = this.props
    const {tid} = this.state
    const {aid, uid} = team.account_list
    dispatch({
      type: 'player/screendel',
      payload: {tid, aid, uid, images:img}
    }).then(
      () => {
        const { player: {res} } = this.props;
        if(res && res.ret === 0) { 
          message.success('已删除！')
          dispatch({
            type: 'player/loginhtm',
            payload: {id: tid}
          }).then(() => {
            // eslint-disable-next-line
            const {player: {team}} =this.props
            const screenshots = team.account_list.screenshots_arr
            this.setState({
              screenList: screenshots
            })
          });
        }
       
      }
    )
  }

  subFinish = (e) => {
    e.preventDefault();
    const {dispatch, player:{team}} = this.props
    const {tid, code} = this.state
    const {aid, uid} = team.account_list
    dispatch({
      type: 'player/finish',
      payload: {tid,uid,aid}
    }).then(
      () => {
        const { player: {res} } = this.props;
        if(res && res.ret === 0) { 
          message.success('已提交！')
          // dispatch({
          //   type: 'player/loginhtm',
          //   payload: {id: tid}
          // })
          localStorage.clear();
          router.push(`/login1/?code=${code}`);
        }
       
      }
    ) 
  }


  render() {
    const {player:{team}, finishLoading }=this.props
    
    const {loaded, statusMap, previewImage, previewVisible, screenList, uploading, fileList } =this.state
    const teamInfo= team.team_info
    const account = team.account_list
    const time = Date.parse(new Date()) / 1000;
    const token = localStorage.getItem('token')? JSON.parse(localStorage.getItem('token')) : null;
    const uploadProps = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        r.onload = e => {
          // eslint-disable-next-line
          file.thumbUrl = e.target.result;
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }));
       }
       
        return true;
      },
      onChange: (info) => {
        if(info.file.response ){
          const urlArr = []
          info.fileList.map(item => {
            const { response } = item
            if(response) {
              if(response.ret === 0) {
                urlArr.push(response.data)
              } else {
                message.error(response.msg)
              }
            }
            return item
          })
          this.setState({
            urlList: urlArr,
          })
        }
        this.setState( {fileList: [...fileList]})
      },
      multiple: true,
      listType: 'picture',
      action: "http://47.100.225.112/gamer/upload-screen",
      data: {
        time,
        token,
        sign: createSign({time, token})
      }
    };

    return (loaded? 
      <PageHeaderWrapper
        hiddenBreadcrumb
        title={`团号：${teamInfo.id}`}
        content={
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="团长">{teamInfo.leader_name}</Description>
            <Description term="团员总数">{teamInfo.mem_num}</Description>
            <Description term="创建时间">{teamInfo.create_time}</Description>
            <Description term="团队配比">{teamInfo.battle_array}</Description>
            <Description term="开团时间">{teamInfo.reserve_time}</Description>
            <Description term="订单状态">{statusMap[teamInfo.status]}</Description>
            <Description term="确认人">{teamInfo.check_name}</Description>
            <Description term="完成时间">{teamInfo.finish_time}</Description>
            <Description term="难度">{teamInfo.difficult }</Description>
            <Description term="副本">{teamInfo.instance_name}</Description>
            <Description term="阵营">{teamInfo.organization==="0"? '联盟': '部落'}</Description>
          </DescriptionList>
        }
        extraContent={
          <div>
            
            {/* <Row>
              <Col xs={24} sm={12}>
                <div className={styles.textSecondary}>订单状态：{teamInfo.status==="2"?statusMap[teamInfo.status]: ''}</div>
                <div className={styles.heading}>
                  {
                    statusMap[teamInfo.status]
                  }
                </div>
              </Col>
              <Col xs={24} sm={12}> */}
                
            <div className={styles.heading} style={{textAlign: 'center'}}> {account.status==="0"?<Button type="primary" loading={finishLoading} onClick={e=> {this.subFinish(e)}}>提交完成</Button>:<Button type="primary" disabled>已提交</Button>}</div>
            <Alert style={{fontSize:'12px', textAlign:'left',marginTop: '5px'}} message="提交完成后，上传截图只能增不能删" type="warning" closable />
            {/* </Col>
          </Row> */}
          </div>
          
        }
      >
        
        <Card 
          bordered={false}
        >
          <div className={styles.tableList}>

            <DescriptionList className={styles.headerList} size="small" col="2">
              <Description term="账号"> {account.account_name}</Description>
              <Description term="密码">{account.account_pwd}</Description>
              <Description term="账号类型">{typeMap[account.type]}</Description>
              <Description term="子账号">{account.child_name}</Description>
              <Description term="服务器">{account.region_id}</Description>
              <Description term="角色名">{account.game_role_name}</Description>
              <Description term="角色等级">{account.level}</Description>
              <Description term="阵营">{account.organization==="0"?"联盟":"部落"}</Description>
              <Description term="职业">{account.profession_name}</Description>
              <Description term="可用天赋">{account.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</Description>
              <Description term="装备等级">{account.equip_level}</Description>
              <Description term="联系电话">{account.account_phone}</Description>
              <Description term="备注">{account.account_remark}</Description>
              
            </DescriptionList>
            <Divider />
            <div className={styles.tableListOperator}>
              {screenList.length !== 0 ?
                <div>
                  <Divider orientation="left" dashed>该账号已上传截图</Divider>
                  <div className="ant-upload-list ant-upload-list-picture-card">
                    {
                      screenList.map(item => (
                        <div className="ant-upload-list-item ant-upload-list-item-done">
                          <div className="ant-upload-list-item-info">
                            <span><a><img src={item} alt="已上传图片" /></a></span>
                            <span className="ant-upload-list-item-actions">
                              <a href={item} target="_blank" rel="noopener noreferrer" title="预览">
                                <Icon type="eye" onClick={e =>this.handlePreview({url: item},e)} />
                              </a>
                              <Popconfirm title="是否要删除该截图？" okText="确定" cancelText="取消" onConfirm={e=> this.delScreen(e,item)}>
                                <Icon className="anticon anticon-delete" type="delete" title="删除" />
                              </Popconfirm>
                              
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>:  <Empty description="该账号暂无上传截图" />
              }
              

              
              <Divider orientation="left" dashed style={{paddingTop:"20px"}}>上传截图</Divider>
            
              <Upload fileList={fileList} {...uploadProps}>
                <Button type="primary">
                  <Icon type="upload" />选择文件
                </Button>
              </Upload>
              
              <Button
                type="primary"
                onClick={e=>{this.handleUpload(e)}}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? '上传中...' : '开始上传' }
              </Button>

            </div>
            
          </div>
        </Card>
      
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper> : <Spin size="large" />

    
  
      
    );
  }
}

export default TeamDetailPage;