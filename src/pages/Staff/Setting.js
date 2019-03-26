import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Input,Button, Upload, message, Icon, DatePicker} from 'antd';
import moment from 'moment';

import 'moment/locale/zh-cn';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import saltMD5 from '@/utils/saltMD5'
import router from 'umi/router';

import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const {Dragger} = Upload;
moment.locale('zh-cn');

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
@connect(({ staff, loading }) => ({
  staff,
  submitting: loading.effects['staff/update'],
}))
class SettingPage extends Component {
  state = {
    uId: '',
    cardBehind: '',
    cardFront: ''
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  
  componentDidMount() {
    const { dispatch, location: {query: {uid}} } = this.props;
    this.setState({
      uId: uid
    })
    dispatch({
        type: 'staff/current',
        payload: {id: uid}
    })
  }

  normFileF = (e) => {
    const {file:{response}} = e
    if(e.error) {
      message.error(e.error.message)
      return
    }
    if(response) {
      if(response.ret === 0) {
        message.success('上传成功')
          this.setState({
            cardFront:  response.data
          })
         // eslint-disable-next-line
        return response.data
        
      }
     message.error(response.msg)
     
    }
  }

  normFileB = (e) => {
    const {file:{response}} = e
    if(e.error) {
      message.error(e.error.message)
      return
    }
    if(response) {
      if(response.ret === 0) {
        message.success('上传成功')
          this.setState({
            cardBehind:  response.data
          })
         // eslint-disable-next-line
        return response.data
        
      }
     message.error(response.msg)
     
    }
    
  }
 


  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { uId } = this.state
    form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        dispatch({
          type: 'staff/update',
          // eslint-disable-next-line
          payload: {id: uId, ...values, 'entry_time': values['entry_time'].format('YYYY-MM-DD')},
        }).then(
          () => {
            const { staff: {res} } = this.props;
            if(res && res.ret === 0) {
              message.success("提交成功！");
              router.push(`/staff`);
            } else {
              message.error(res.msg);
            }
          }
        );
      }
    });
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator },
      staff: {current}
    } = this.props;
    const { cardFront, cardBehind } = this.state;
    const time = Date.parse(new Date()) / 1000;
    const token = localStorage.getItem('token')? JSON.parse(localStorage.getItem('token')) : null;
    const uploadProps = {
      action: "http://47.100.225.112/user/upload-cardimg",
      showUploadList: false,
      onChange: this.handleChange,
      data: {
        time,
        token,
        sign: createSign({token, time})
      }
    }

    const uploadHolder = (state) => {
      if(state) {
        return (
          <img src={state} alt="" style={{maxHeight: '200px'}} />
        )
      } 
      return <Icon type="idcard" style={{fontSize: '200px'}} theme="twoTone" twoToneColor="#dddddd" />
    }
    const config = {
      rules: [{  type: 'object',required: true, message: '请选择日期' }],
      
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                <FormItem {...formItemLayout} label="手机号">
                  {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                  initialValue: current.username
                })(<Input placeholder="" disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="在职状态">
                  {getFieldDecorator('status', {
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                  initialValue: current.status
                })(<Input placeholder="" disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="角色">
                  {getFieldDecorator('role_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                  initialValue: current.role_name
                })(<Input placeholder="" disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('real_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名',
                    },
                  ],
                  initialValue: current.real_name
                })(<Input placeholder="请输入姓名" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="基本工资">
                  {getFieldDecorator('basic_salary', {
                  rules: [
                    {
                      required: true,
                      message: '请输入基本工资',
                    },
                  ],
                  initialValue: current.basic_salary
                })(<Input placeholder="请输入基本工资" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="QQ号">
                  {getFieldDecorator('qq', {
                  rules: [
                    {
                      required: true,
                      message: 'QQ号',
                    },
                  ],
                  initialValue: current.qq
                })(<Input placeholder="请输入QQ号" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="入职时间">
                  {getFieldDecorator('entry_time', {...config, initialValue: current.entry_time? moment(current.entry_time, 'YYYY-MM-DD'): moment() })(<DatePicker placeholder="请选择入职日期" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="身份证号">
                  {getFieldDecorator('id_card', {
                  rules: [
                    {
                      required: true,
                      len: 18,
                      message: '请输入身份证号',
                    },
                  ],
                  initialValue: current.id_card
                })(<Input placeholder="请输入身份证号" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="上传身份证正面照">
                  {getFieldDecorator('card_img_front', {
                    rules: [
                      {
                        required: true,
                        message: '未获取身份证正面照',
                      },
                    ],
                    initialValue: current.card_img_front,
                    getValueFromEvent:this.normFileF,
                    validateTrigger: 'onSubmit'
                  })(
                    <Dragger {...uploadProps}>
                      {uploadHolder(cardFront||current.card_img_front)}
                    </Dragger>
                  )}
                
                </FormItem>
                <FormItem {...formItemLayout} label="上传身份证背面照">
                  {getFieldDecorator('card_img_behind', {
                    rules: [
                      {
                        required: true,
                        message: '未获取身份证背面照',
                      },
                    ],
                    initialValue: current.card_img_behind,
                    getValueFromEvent: this.normFileB,
                    validateTrigger:'onSubmit'
                  })(
                    <Dragger {...uploadProps}>
                      {uploadHolder(cardBehind||current.card_img_behind)}
                    </Dragger>
                  )}
                
                </FormItem>

                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    提交
                  </Button>
                </FormItem>
              
              </Form>
         
            </div>
            
          </div>
        </Card>
        
      </PageHeaderWrapper>
  
    );
  }
}

export default SettingPage;
