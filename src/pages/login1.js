import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Form, Icon, Input, Button, message
  } from 'antd';
  
  @Form.create()
  @connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login1'],
  }))
  class NormalLoginForm extends Component {
    componentWillMount() {
      const {location: {query: {code}} } = this.props
      this.setState({
        code,
      })
    }

    handleSubmit = (e) => {
      e.preventDefault()
      const {form, dispatch } = this.props;
      const {code} =this.state
      
      form.validateFields((err, values) => {
        if (!err) {
          if(code){
            dispatch({
              type: 'login/login1',
              payload: {password: values.password,linkcode: code}
            })
          }else {
            message.error('网址错误！请重新检查')
          }
        }
      });
      }
  
    render() {
      const { form: {getFieldDecorator}, submitting} = this.props;
      return (
        <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto'}}>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="登录密码" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={submitting} htmlType="submit" style={{width: '100%'}}>
             登录
            </Button>
          </Form.Item>
        </Form>
      )
    }
  }
  export default NormalLoginForm;