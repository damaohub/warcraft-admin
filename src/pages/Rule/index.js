import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, message, Tree, Icon, Modal, Form, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../GameRole/game.less';

const { TreeNode } = Tree;
const FormItem = Form.Item;


@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.monster,
}))
@Form.create()
class RulePage extends Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    visible: false,
    typeIndex: 0
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  showModal = (e, item) => {
    e.preventDefault()
    let newCurrent
    let newTypeIndex = 3
    if(item) {
      newCurrent = {pid: item.key}
      newTypeIndex = 1
    }
    this.setState({
      typeIndex: newTypeIndex,
      visible: true,
      current: newCurrent
    });
  };

  showEditModal = (e,item) => {
    e.preventDefault()
    const newTypeIndex = item.pid === '0' ? 4 : 2
    this.setState({
      typeIndex: newTypeIndex,
      visible: true,
      current: item,
    });
  };

 

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current, typeIndex } = this.state;
    const typeMap = ['rule/fetch', 'rule/add', 'rule/update', 'rule/addGroup', 'rule/editGroup']
    const id = current ? current.key : '';
    const pid = current && current.pid ? current.pid : '';
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: typeMap[typeIndex],
        payload: { id, pid, ...current,...fieldsValue },
      }).then(
        () => {
          this.handleCancel()
          this.handleCall('操作成功')
        }
      );
    });
  };


  handleCall = (okText) => {
    const {dispatch, rule: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
      dispatch({
        type: 'rule/fetch',
      });
    }
    
  }

  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onSelect = (selectedKeys) => {
    this.setState({ selectedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode 
          title={
            <span>
              {item.title} 
              <Icon title="修改组名" type="edit" style={{color: '#40a9ff', marginLeft: '25px' }} onClick={(e) => {this.showEditModal(e, item)}} />
              <Icon title="增加权限" type="plus" style={{color: '#40a9ff', marginLeft: '25px' }} onClick={(e) => {this.showModal(e, item)}} />
            </span>
          } 
          key={item.key} 
          dataRef={item}
        >
        
          {
            item.children.map((child) => (
              <TreeNode 
                title={
                  <span>
                    {child.title}： 
                    {child.rule_api}
                    <Icon title="修改权限" type="form" style={{color: '#40a9ff', marginLeft: '25px' }} onClick={(e) => {this.showEditModal(e, child)}} />
                  </span>
                } 
                key={child.key} 
                dataRef={child} 
              />
            ))
            // this.renderTreeNodes(item.children)
          }

        </TreeNode>
      );
    }
    return <TreeNode 
      title={ 
        <span>
          {item.title} 
          <Icon title="修改组名" type="edit" style={{color: '#40a9ff', marginLeft: '25px' }} onClick={(e) => {this.showEditModal(e, item)}} />
          <Icon title="增加权限" type="plus" style={{color: '#40a9ff', marginLeft: '25px' }} onClick={(e) => {this.showModal(e, item)}} />
        </span>
      } 
      key={item.key} 
      dataRef={item} 
    />;
  })

  handleCall = (okText) => {
    const {dispatch, rule: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
      dispatch({
        type: 'rule/fetch',
      });
    }
    
  }

  render() {
    const {
      rule: { data },
      form: { getFieldDecorator },
    } = this.props;
    const {checkedKeys, expandedKeys, autoExpandParent, selectedKeys, visible, current = {} } = this.state
    const treeData = data.list

    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const labelName = !current.pid || current.pid === "0"? '分组名称' : '接口名称'

    const getModalContent = () => 
      (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label={labelName} {...this.formLayout}>
            {getFieldDecorator('rule_name', {
              rules: [{ required: true, message: `请输入${labelName}` }],
              initialValue: current.title,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          {current.pid && current.rule_api !== '0' && 
          <FormItem label="接口URL" {...this.formLayout}>
            {getFieldDecorator('rule_api', {
              rules: [{ required: true, message: '请输入接口URL' }],
              initialValue: current.rule_api,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          }
          <FormItem label="排序号" {...this.formLayout}>
            {getFieldDecorator('sort', {
              rules: [{ required: true, message: '请输入序号' }],
              initialValue: current.sort,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          
        </Form>
      );
    
   

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={(e) => {this.showModal(e, false)}}>
                新建分组
              </Button>
              {treeData.length
                ? (
                  <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={selectedKeys}
                  >
                    {this.renderTreeNodes(treeData)}
                  </Tree>)
                : 'loading...'
                }
              
              
            </div>
            
          </div>
        </Card>
       
        <Modal
          title={`权限${current.key && current.key !== '0' ? '编辑' : '添加'}`}
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

export default RulePage;
