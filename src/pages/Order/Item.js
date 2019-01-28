import React from 'react';
import { connect } from 'dva';
import {Card, Form, Radio, Select, InputNumber, Input } from 'antd';

const{Option} = Select
@connect(({ loading, monster }) => ({
  monster,
  Loading: loading.models.monster,
}))
@Form.create()
class Item extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isRendering: true
    }
  }

  componentDidMount(){
    const{ dispatch, form } =this.props
    const defaultVal = form.getFieldValue('instance_or_secret') || '1'
    dispatch({
      type:'monster/inList',
      payload: {instance_type: defaultVal}
    })
    // eslint-disable-next-line
    this.props.onRef(this)
  }

  onValidate = () => {
    const {
      id,
      form: { validateFieldsAndScroll },
    } = this.props

    const item = {}
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        item[id] = {...values}
      }
    })
    return item
  }

  delete =(v) => {
    this.setState({
      isRendering: v
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
    const {
      monster:{instanceList},
      id,
      labels,
      elemt,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const {isRendering} =this.state

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
    } 
    return (
      isRendering?
        <Card title='项目信息' extra={id>0? <a onClick={() => this.delete(false)}>删除</a>: null} style={{marginBottom: "15px" }} bordered={false}>
          <Form layout="horizontal" hideRequiredMark> 
            <Form.Item {...formItemLayout} label={labels.instance_or_secret}>
              {getFieldDecorator('instance_or_secret', {
                rules: [{ required: true, message: `请选择${labels.instance_or_secret}` }],
                initialValue: elemt.instance_or_secret,
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
            
            <Form.Item {...formItemLayout} label={labels.instance_id}>
              {getFieldDecorator('instance_id', {
                rules: [{ required: true, message: `请选择${labels.instance_id}` }],
                initialValue: elemt.instance_id,
              })(
                <Select placeholder={`请选择${labels.instance_id}`}>
                  {instanceList.map( i => (<Option key={i.id}>{i.name}</Option>))}
                </Select>
              )}
            </Form.Item>
          
            <Form.Item {...formItemLayout} label={labels.difficult}>
              {getFieldDecorator('difficult', {
                rules: [{ required: true, message: `请选择${labels.difficult}`   }],
                validateTrigger: 'onSubmit',
                initialValue: elemt.difficult,
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
              getFieldValue('instance_or_secret')==='1' && getFieldValue('difficult')==="m" &&
              <Form.Item {...formItemLayout} label='史诗等级'>
                {getFieldDecorator('difficultLevel', {
                  rules: [{ required: true, message: '请填写史诗等级'  }],
                  initialValue: elemt.difficultLevel,
                })(
                  <InputNumber 
                    min={1} 
                    max={30}
                  />
                )}
              </Form.Item>
            }
            

            <Form.Item {...formItemLayout} label={labels.num}>
              {getFieldDecorator('num', {
                rules: [{ required: true, message: `请选择${labels.num}` }],
              })(
                <Input
                  placeholder="请输入"
                />
              )}
            </Form.Item>

          </Form>
        </Card> : null
    )

  }
}



export default Item

