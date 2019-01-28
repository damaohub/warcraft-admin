import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Select, Radio, InputNumber, Card, DatePicker } from 'antd';
import router from 'umi/router';

import locale from 'antd/lib/date-picker/locale/zh_CN';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};


function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
  // return current.getTime() < Date.now() - 8.64e7
}

@connect(({ loading, monster, staff }) => ({
  monster,
  staff,
  Loading: loading.models.monster,
  staffLoading: loading.models.staff,
}))
@Form.create()
class Step1 extends React.PureComponent {
  componentDidMount(){
    const{ dispatch, form } =this.props
    const defaultVal = form.getFieldValue('instance_or_secret') || '1'
    dispatch({
      type:'monster/inList',
      payload: {instance_type: defaultVal}
    })
    dispatch({
      type:'staff/fetch',
      payload: {role_id: 2,pageSize: 1000}
    })
  }

  radioChange = (e) => {
    const{ dispatch, form } =this.props
    dispatch({
      type:'monster/inList',
      payload: {instance_type: e.target.value}
    })
    form.setFieldsValue({
      'instance_id': undefined
    });
   
  }

  render() {
    const { monster:{instanceList},staff:{data:{list}}, form, dispatch } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const config = {
      rules: [{ type: 'object', required: true, message: '请选择日期' }],
      
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line
          if(values.difficultLevel) { values.difficult = values.difficultLevel}
          dispatch({
            type: 'team/group',
            payload: values,
          }).then(
            () =>{
              router.push('/team/add/confirm');
            }
          )
          
        }
      });
    };
    return (
      <Card bordered={false}>
        <Fragment>
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark> 
            <Form.Item {...formItemLayout} label="开团时间">
              {getFieldDecorator('reserve_time', {
                ...config
              })(
                <DatePicker locale={locale} disabledDate={disabledDate} showTime format="YYYY-MM-DD HH:mm:ss" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="选择团长">
              {getFieldDecorator('leader_id', {
                rules: [ {required: true, message: '请选择团长'}],
              })(
                <Select placeholder='请选择团长'>
                  {list.map( i => (<Option key={i.id}>{i.real_name}</Option>))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="副本类型">
              {getFieldDecorator('instance_or_secret', {
                rules: [{ required: true, message: '请选择副本类型' }],
                initialValue: "1",
              })(
                <Radio.Group buttonStyle="solid" onChange={e => {this.radioChange(e)}}>
                  <Radio.Button value="1">
                    地下城
                  </Radio.Button>
                  <Radio.Button value="2">
                    团队副本
                  </Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="选择副本">
              {getFieldDecorator('instance_id', {
                rules: [ {required: true, message: '请选择副本'}],
              })(
                <Select placeholder='请选择副本'>
                  {instanceList.map( i => (<Option key={i.id}>{i.name}</Option>))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="选择阵营">
              {getFieldDecorator('organization', {
                rules: [ {required: true, message: '请选择阵营'}],
              })(
                <Select placeholder='请选择阵营'>
                  <Option key="0">联盟</Option>
                  <Option key="1">部落</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="选择难度">
              {getFieldDecorator('difficult', {
                rules: [{ required: true, message: '请选择难度' }],
                validateTrigger: 'onSubmit',
                initialValue: 'p',
              })(
                <Radio.Group>
                  <Radio value="p">
                    普通
                  </Radio>
                  <Radio value="h">
                    英雄
                  </Radio>
                  <Radio value="m">
                    史诗
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {
              getFieldValue('instance_or_secret') ==='1' && getFieldValue('difficult')==="m" &&
              <Form.Item {...formItemLayout} label='史诗等级'>
                {getFieldDecorator('difficultLevel', {
                  rules: [{ required: true, message: '请填写史诗等级'  }],
                  initialValue: 1,
                })(
                  <InputNumber 
                    min={1} 
                    max={30}
                  />
                )}
              </Form.Item>
              }
            { 
              getFieldValue('instance_or_secret') === '2' &&
              <Fragment>
                <Form.Item {...formItemLayout} label="坦克个数">
                  {getFieldDecorator('t', {
                    rules: [
                      { required: true, message: '请输入坦克个数' }
                    ],
                  })(
                    <InputNumber 
                      min={1} 
                      max={5}
                    />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="近战输出个数">
                  {getFieldDecorator('c', {
                    rules: [
                      { required: true, message: '请输入近战输出个数' }
                    ],
                  })(
                    <InputNumber 
                      min={1} 
                      max={25}
                    />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="远战输出个数">
                  {getFieldDecorator('f', {
                    rules: [
                      { required: true, message: '请输入远战输出个数' }
                    ],
                  })(
                    <InputNumber 
                      min={1} 
                      max={25}
                    />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="治疗个数">
                  {getFieldDecorator('n', {
                    rules: [
                      { required: true, message: '请输入治疗个数' }
                    ],
                  })(
                    <InputNumber 
                      min={1} 
                      max={10}
                    />
                  )}
                </Form.Item>
              </Fragment>
              }
            
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={onValidateForm}>
                提交
              </Button>
            </Form.Item>
          </Form>
          {/* <Divider style={{ margin: '40px 0 24px' }} />
          <div className={styles.desc}>
            <h3>说明</h3>
            <p>
              无
            </p>
        
          </div> */}
        </Fragment>
      </Card>
    );
  }
}

export default Step1;
