import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Modal, message, Form, Input} from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './role.less';

const FormItem = Form.Item;

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class RolePage extends PureComponent {
  state ={
    visible: false,
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = (e, item) => {
    e.preventDefault()
    this.setState({
      visible: true,
      current: item || undefined
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    let param = {}
    let types = 'role/add'
    if(current) {
      param = current
      types = 'role/update'
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: types,
        payload: { ...param,...fieldsValue },
      }).then(
        () => {
          this.handleCancel()
          this.handleCall('操作成功')
        }
      );
    });
  };


  handleCall = (okText, failText) => {
    const {dispatch, role: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
    } else {
      message.error(failText || res.msg);
    }
    dispatch({
      type: 'role/fetch',
    });
  }

  render() {
    const {
      role: {data: { list }},
      loading,
      form: { getFieldDecorator }
    } = this.props;
    const {visible, current={}} = this.state
  
    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const getModalContent = () => 
      (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="角色名字" {...this.formLayout}>
            {getFieldDecorator('role_name', {
              rules: [{ required: true, message: "请输入角色名字" }],
              initialValue: current.role_name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          
          <FormItem label="角色描述" {...this.formLayout}>
            {getFieldDecorator('role_description', {
              rules: [{ required: true, message: '请输入角色描述' }],
              initialValue: current.role_description,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          
        </Form>
      );

    return (
      <PageHeaderWrapper>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[ ...list, '']}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[<a onClick={e => {this.showModal(e, item)}}>修改信息</a>, <a href={`#/rr/rights?roleId=${item.id}`}>权限管理</a>]}>
                    <Card.Meta
                      avatar={<Icon className={styles.cardAvatar} type="smile" theme="twoTone" style={{fontSize: '48px'}} />}
                      title={<a>{item.role_name}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          <div>{item.role_description}</div>
                          <div>{item.role_rule}</div>
                        </Ellipsis>

                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={e => {this.showModal(e)}}>
                    <Icon type="plus" /> 新增角色
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Modal
          title={`角色${current.id ? '修改' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default RolePage;