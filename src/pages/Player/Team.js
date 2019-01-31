import React, { Component, } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Spin,
  Button,
  Form,
  message,
  Upload,
  Icon,
  Tooltip,
  Divider,
  Avatar,
  Modal,
  Popconfirm,
  Empty
} from 'antd';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../Team/AdvancedProfile.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;

const typeMap = {"0":'工作室账号',"1":"客户账号", "3": "借用账号"}
@connect(({ player, loading }) => ({
    player,
    loading: loading.effects['player/team'],
    submitting: loading.effects['player/screenadd'],
    finishLoading: loading.effects['player/finish']
}))
@Form.create()
class TeamDetailPage extends Component {
  state = {
    loaded: false,
    statusMap: {"1": "未完成","2": "待审核", "3": "已完成"},
    urlList: [],
    uploadList: []
  };

  componentWillMount() {
    const { dispatch, location: {query: {id} }} = this.props
    
    dispatch({
      type: 'player/team',
      payload: {id}
    }).then(() => {
      const { player:{team} } =this.props
      const screenshots = team.account_list.screenshots_arr
      this.setState({
        urlList: screenshots,
        loaded: true
      })
    });
    this.setState({
      tid: id,
      uploadList: []
    })
  
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

  handleRemove = (file) => {
    const {uploadList} =this.state
    const index = uploadList.findIndex(v=>(v === file.response.data))
    uploadList.splice(index,1)
    this.setState({uploadList})
  }

  handleCancel = () => this.setState({ previewVisible: false })

  normFileF = (e) => {
    const {file,file:{status}, fileList,file:{response}} = e
    this.setState({fileList})
    if(status==="error") {
      message.error("图片读取失败！")
      const index = fileList.findIndex(v=>(v.uid===file.uid))
      fileList.splice(index,1)
      return
    }
    if(status ==="done") {
      if(response.ret === 0) {
        const {uploadList} =this.state
       
        uploadList.push(response.data)
        this.setState({uploadList},
          ()=>{
            message.success('图片读取成功！')
          }
        )
        // eslint-disable-next-line
        return uploadList
      } 
      message.error(response.msg)
    }
   
  }
 

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, player:{team} } = this.props;
    const {tid, uploadList} = this.state
    const {aid, uid} = team.account_list
    form.setFieldsValue({'images': uploadList})
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'player/screenadd',
          payload: {aid, uid, tid, ...values}
        }).then(
          () => {
            const { player: {res} } = this.props;
            if(res && res.ret === 0) { 
              this.setState({uploadList: [], fileList: []},() => {
                message.success("提交成功！");
                form.resetFields()
                dispatch({
                  type: 'player/team',
                  payload: {id: tid}
                }).then(() => {
                  // eslint-disable-next-line
                  const {player: {team}} =this.props
                  const screenshots = team.account_list.screenshots_arr
                  this.setState({
                    urlList: screenshots
                  })
                });
              })
            } else {
              message.error(res.msg);
            }
          }
        );
      }
    });
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
            type: 'player/team',
            payload: {id: tid}
          }).then(() => {
            // eslint-disable-next-line
            const {player: {team}} =this.props
            const screenshots = team.account_list.screenshots_arr
            this.setState({
              urlList: screenshots
            })
          });
        } else {
          message.error(res.msg)
        }
       
      }
    )
  }

  subFinish = (e) => {
    e.preventDefault();
    const {dispatch, player:{team}} = this.props
    const {tid} = this.state
    const {aid, uid} = team.account_list
    dispatch({
      type: 'player/finish',
      payload: {tid,uid,aid}
    }).then(
      () => {
        const { player: {res} } = this.props;
        if(res && res.ret === 0) { 
          message.success('已提交！')
          dispatch({
            type: 'player/team',
            payload: {id: tid}
          })
        } else {
          message.error(res.msg)
        }
       
      }
    ) 
  }


  render() {
    const {player:{team},  form: { getFieldDecorator }, submitting, finishLoading }=this.props
    
    const {loaded, statusMap, previewImage, previewVisible, urlList, uploadList, fileList } =this.state
    const teamInfo= team.team_info
    const account = team.account_list
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 16 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };


    const uploadProps = {
      action: "http://192.168.0.128/gamer/upload-screen",
      listType: "picture-card",
      onPreview: this.handlePreview,
      onRemove:this.handleRemove,
      onChange: this.handleChange,
      data: {
        time: Date.parse(new Date()) / 1000,
        token: localStorage.getItem('token')? JSON.parse(localStorage.getItem('token')) : null,
      }
    }

    const uploadButton = (
      <div>
        <Icon type="plus" style={{fontSize:'50px', color:'#999'}} />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

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
            <Description term="订单状态">{statusMap[teamInfo.status]}</Description>
            <Description term="确认人">{teamInfo.check_name}</Description>
            <Description term="完成时间">{teamInfo.finish_time}</Description>
            <Description term="难度">{teamInfo.difficult }</Description>
            <Description term="副本">{teamInfo.instance_name}</Description>
            <Description term="阵营">{teamInfo.organization==="0"? '联盟': '部落'}</Description>
          </DescriptionList>
        }
        extraContent={
          <Row>
            {/* <Col xs={24} sm={12}>
              <div className={styles.textSecondary}>订单状态：{teamInfo.status==="2"?statusMap[teamInfo.status]: ''}</div>
              <div className={styles.heading}>
                {
                  statusMap[teamInfo.status]
                }
              </div>
            </Col> */}
            <Col xs={24} sm={12}>
              {/* <div className={styles.textSecondary}>提交状态</div> */}
              <div className={styles.heading}>{account.status==="0"?<Button type="primary" loading={finishLoading} onClick={e=> {this.subFinish(e)}}>提交完成</Button>:<Button type="primary" disabled>已提交</Button>}</div>
            </Col>
          </Row>
        }
      >
        
        <Card 
          title={
            <Tooltip 
              placement="rightTop" 
              title={
                <div style={{display:"flex",flexDirection:"column"}}>
                  <div>密码：{account.account_pwd}</div>
                  <div>账号类型：{typeMap[account.type]}</div>
                  <div>子账号：{account.child_name}</div>
                  <div>服务器：{account.region_id}</div>
                  <div>角色名：{account.game_role_name}</div>
                  <div>角色等级：{account.level}</div>
                  <div>阵营：{account.organization==="0"?"联盟":"部落"}</div>
                  <div>职业：{account.profession_name}</div>
                  <div>可用天赋：{account.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</div>
                  <div>装备等级：{account.equip_level}</div>
                  
                </div>     
                }
            >
              {<Avatar style={{marginRight:'5px'}} size="small" src={account.profession_img} />  }{account.account_name}
            </Tooltip>
          }
          bordered={false}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {urlList.length !== 0 ?
                <div>
                  <Divider orientation="left" dashed>该账号已上传截图</Divider>
                  <div className="ant-upload-list ant-upload-list-picture-card">
                    {
                      urlList.map(item => (
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
              <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              
                <FormItem {...formItemLayout} label="上传">
                  {getFieldDecorator('images', {
                    rules: [
                      {
                        required: true,
                        message: '未获取截图',
                      },
                    ],
                    initialValue: uploadList,
                    getValueFromEvent:this.normFileF,
                    validateTrigger: 'onSubmit'
                  })(
                    <Upload fileList={fileList} {...uploadProps}>
                      {uploadButton}
                    </Upload>
                  )}
              
                </FormItem>
              

                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    提交截图
                  </Button>
                </FormItem>
            
              </Form>
              
            </div>
            
          </div>
        </Card>
       
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>: <Spin size="large" />
    );
  }
}

export default TeamDetailPage;