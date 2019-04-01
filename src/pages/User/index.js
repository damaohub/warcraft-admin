import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col,  Divider, Avatar, Spin, Collapse, Icon, Form, Input, Button,message} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import saltMD5 from '@/utils/saltMD5';

import styles from './Center.less';

const {Panel} = Collapse

const customPanelStyle = {
  border: 0,
  overflow: 'hidden',
};

@connect(({ loading, user }) => ({
    user,
    currentUser: user.currentUser,
    currentUserLoading: loading.effects['user/fetchCurrent'],
    passwordLoading: loading.effects['user/password']
  }))
  @Form.create()
  class Center extends PureComponent {
    state = {
      confirmDirty: false,
    };
  
    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/fetchCurrent',
      })
     
    }
  


    handleSubmit = (e) => {
      e.preventDefault();
      const {dispatch ,form} = this.props;
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'user/password',
            payload: {password: saltMD5.md5(values.password),new_password: saltMD5.md5(values.new_password), renew_password:saltMD5.md5(values.renew_password)}
          }).then (
            () => {
              form.resetFields()
              const{user:{res}}=this.props
              if(res.ret === 0) {
                message.success('密码已重置！')
              } else {
                message.error(res.msg)
              }
            }
          )
        }
      });
    }
  
    handleConfirmBlur = (e) => {
      const {value} = e.target;
      const {confirmDirty} =this.state
      this.setState({ confirmDirty: confirmDirty || !!value });
    }
  
    compareToFirstPassword = (rule, value, callback) => {
      const {form} = this.props;
      if (value && value !== form.getFieldValue('new_password')) {
        callback('输入的密码不一致');
      } else {
        callback();
      }
    }
  
    validateToNextPassword = (rule, value, callback) => {
      const {form} = this.props;
      const {confirmDirty} =this.state
      if (value && confirmDirty) {
        form.validateFields(['renew_password'], { force: true });
      }
      callback();
    }


    onTabChange = key => {
      const { match } = this.props;
      switch (key) {
        case 'articles':
          router.push(`${match.url}/salary`);
          break;
        default:
          break;
      }
    };
  

  
    render() {

      const {
        passwordLoading,
        listLoading,
        currentUser,
        currentUserLoading,
        match,
        location,
        children,
        form: {getFieldDecorator}
      } = this.props;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };

      const operationTabList = [
        {
          key: 'salary',
          tab: (
            <span>
              工资考核
            </span>
          ),
        },
       
      ];
  
      return (
        <GridContent className={styles.userCenter}>
          <Row gutter={24}>
            <Col lg={7} md={24}>
              <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
                {currentUser && Object.keys(currentUser).length ? (
                  <div>
                    <div className={styles.avatarHolder}>
                      <Avatar size={100} icon="user" style={{marginBottom: '15px'}} />  
                      <div className={styles.name}>{currentUser.real_name}</div>
                      <div>{currentUser.role_name}</div>
                    </div>
                    <div className={styles.detail}>
                    
                      <Row type="flex" justify="space-between" align="middle">
                        <Col>手机号：</Col>
                        <Col>{currentUser.username}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" align="middle">
                        <Col> QQ：</Col>
                        <Col>{currentUser.qq}</Col>
                      </Row>
                     
                      <Row type="flex" justify="space-between" align="middle">
                        <Col>在职状态：</Col>
                        <Col>
                          {
                            <span>
                              <span>{typeof (currentUser.status) === 'string' && currentUser.status}</span>
                              <span>{typeof (currentUser.status) === 'number' && currentUser.status === 1 ? '在职' : '离职'}</span>
                            </span>
                          }
                        </Col>
                      </Row>
                      <Row type="flex" justify="space-between" align="middle">
                        <Col style={{textAlign:'left'}}>基本工资：</Col>
                        <Col>{currentUser.basic_salary}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" align="middle">
                        <Col style={{textAlign:'left'}}>入职时间：</Col>
                        <Col>{currentUser.entry_time}</Col>
                      </Row>
                      <Row type="flex" justify="space-between" align="middle">
                        <Col style={{textAlign:'left'}}>身份证号：</Col>
                        <Col>{currentUser.id_card}</Col>
                      </Row>

                    </div>
                    <Divider dashed />
                    <Collapse
                      bordered={false}
                      expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                      className={styles.collapse}
                    >
                      <Panel header="重置密码" key="1" style={customPanelStyle}>
                        <Form onSubmit={this.handleSubmit}>
                          <Form.Item
                            {...formItemLayout}
                            label="旧密码"
                          >
                            {getFieldDecorator('password', {
                              rules: [{
                                required: true, message: '输入旧密码!',
                              }],
                            })(
                              <Input type="password" />
                            )}
                          </Form.Item>
                          <Form.Item
                            {...formItemLayout}
                            label="新密码"
                          >
                            {getFieldDecorator('new_password', {
                              rules: [{
                                required: true, message: '输入密码!',
                              }, {
                                validator: this.validateToNextPassword,
                              }],
                            })(
                              <Input type="password" />
                            )}
                          </Form.Item>
                          <Form.Item
                            {...formItemLayout}
                            label="确认密码"
                          >
                            {getFieldDecorator('renew_password', {
                              rules: [{
                                required: true, message: '请再次输入新密码!',
                              }, {
                                validator: this.compareToFirstPassword,
                              }],
                            })(
                              <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                          </Form.Item>
                          <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" loading={passwordLoading} htmlType="submit">重置</Button>
                          </Form.Item>
                        </Form>
                      </Panel>
                    </Collapse>

                  </div>
                ) : (
                  <Spin size="large" />
                )}
              </Card>
            </Col>
            <Col lg={17} md={24}>
              <Card
                className={styles.tabsCard}
                bordered={false}
                tabList={operationTabList}
                activeTabKey={location.pathname.replace(`${match.path}/`, '')}
                onTabChange={this.onTabChange}
                loading={listLoading}
              >
                {children}
              </Card>
            </Col>
          </Row>
        </GridContent>
      );
    }
  }
  
  export default Center;