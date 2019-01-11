import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {message, Radio, Card, Tree, Button, Divider } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './rights.less';

const RadioGroup = Radio.Group;
const { TreeNode } = Tree;

@connect(({ role, rule }) => ({
  role,
  rule
}))
class RightsPage extends PureComponent {
  state ={
    autoExpandParent: true,
    checkedKeys: [],
    expandedKeys:[],
    roleId: '2',
    loading: false
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

 
  componentWillMount() {
    const { dispatch, location: {query: {roleId}} } = this.props;
    dispatch({
      type: 'role/fetch',
    });
    dispatch({
      type: 'rule/fetch',
    });
    if(roleId) {
      this.setState({
        roleId
      })
    }
   
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode 
          title={
            <span>
              {item.title} 
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
        </span>
      } 
      key={item.key} 
      dataRef={item} 
    />;
  })

  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }

  onRoleChange = (e) => {
    this.setState({
      roleId: e.target.value,
    });
  }
 
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { checkedKeys, roleId } = this.state;
    if(checkedKeys.length === 0 || !roleId) {
      message.error("请选择角色或权限！");
      return
    }
    this.setState({
      loading: true
    })
    dispatch({
      type: 'role/editRule',
      payload: { id: roleId, role_rule: checkedKeys },
    }).then(
      () => {
        this.handleCall('授权成功！')
        this.setState({
          loading: false,
          checkedKeys: [],
          expandedKeys:[]
        })
      }
    );
   
  };


  handleCall = (okText, failText) => {
    const {role: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
    } else {
      message.error(failText || res.msg);
    }
  }

  render() {
    const {
      role,
      rule,
    } = this.props;
  const { expandedKeys,autoExpandParent, checkedKeys, roleId, loading} = this.state
  const roleList = role.data.list
  const ruleList = rule.data.list

    return (
      <PageHeaderWrapper>
        <div className={styles.cardList}>
          <Card bordered={false}>
            <Divider dashed orientation="left" style={{marginTop:'0'}}>选择角色↓</Divider>
            <RadioGroup name="radiogroup" onChange={this.onRoleChange} defaultValue={roleId}>
              {
                roleList.map( item => (
                  <Radio key={item.id} value={item.id}>{item.role_name}</Radio>
                ))
              }
            </RadioGroup>
            <Divider dashed orientation="left">选择对应权限↓</Divider>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                {ruleList.length
                  ? (
                    <Tree
                      checkable
                      autoExpandParent={autoExpandParent}
                      checkedKeys={checkedKeys}
                      expandedKeys={expandedKeys}
                      onCheck={this.onCheck}
                      onExpand={this.onExpand}
                    >
                      {this.renderTreeNodes(ruleList)}
                    </Tree>)
                  : 'loading...'
                  }
              </div>
            </div>
            <Divider />
            <Button type="primary" size="large" loading={loading} onClick={(e) => {this.handleSubmit(e)}}>提交</Button>
          </Card>

        </div>
       
      </PageHeaderWrapper>
    );
  }
}

export default RightsPage;