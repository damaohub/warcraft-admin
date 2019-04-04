import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, message, Button, Row, Col, Modal, Input, Select, Divider, Spin  } from 'antd';


import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import DescriptionList from '@/components/DescriptionList';
import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@Form.create()
/* eslint react/no-multi-comp:0 */
@connect(({ staff, loading }) => ({
  staff,
  loading: loading.models.staff,
}))
class CenterPage extends Component {
  state = {
    visible: false,
    formValues: {},
    success: false,
   
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  columns = [
    {
      title: '金额',
      dataIndex: 'money',
      key: 'money',
      align: 'center',
      render: (item, row) => {
        if(parseInt(row.type, 10) === 1 || parseInt(row.type, 10) === 3) {
          return (<span style={{color: 'green'}}>{`+${item}`}</span>)
        }
        return (<span style={{color: 'red'}}>{`-${item}`}</span>)
      }
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'exec_name',
      key: 'exec_name',
      align: 'center',
      render: (item, row) => (
        `${item}-${row.exec_role}`
      )
         
    },
    {
      title: '操作时间',
      dataIndex: 'exec_time',
      key: 'exec_time',
      align: 'center',
    }
   
  ];

  componentWillMount() {
    const { dispatch, location: {query: {uid}} } = this.props;
    dispatch({
      type: 'staff/salary',
      payload: {id: uid}
    }).then(
      ()=> {
        this.setState({
          success: true
        })
      }
    )
    dispatch({
      type: 'staff/current',
      payload: {id: uid}
    });
    
  }

 
  handleCall = (okText, failText) => {
    const {dispatch, staff: {res},  location: {query: {uid}} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
    } else {
      message.error(failText || res.msg);
    }
    dispatch({
      type: 'staff/salary',
      payload: {id: uid}
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'staff/salary',
      payload: params,
    });
  };

  showModal = (e) => {
    e.preventDefault()
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, location: {query: {uid} }} = this.props;
    form.validateFields((err, fieldsValue) => {
     
      if (err) return;
      dispatch({
        type: 'staff/rd',
        payload: {id: uid, ...fieldsValue},
      }).then(
        () => {
          this.handleCancel()
          this.handleCall('操作成功')
        }
      );
    });
  };

  render() { 
    const {staff: {salary}, staff:{current}, loading, form: { getFieldDecorator }} = this.props
    const dataSorce = {list:salary.list, pagination: salary.pagination}
    const {visible, success } = this.state
    
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label='奖惩类型' {...this.formLayout}>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: `请选择类型` }],
          })(
            <Select placeholder="请选择类型" style={{ width: '100%' }}>
              <Option key="1">奖励</Option>
              <Option key="2">惩罚</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label='奖惩金额' {...this.formLayout}>
          {getFieldDecorator('money', {
            rules: [{ required: true, message: `请输入金额` }],
           
          })(<Input placeholder="请输入"  />)}
        </FormItem>
        <FormItem label='奖惩原因' {...this.formLayout}>
          {getFieldDecorator('reason', {
            rules: [{ required: true, message: `请输入原因` }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Form>
    )

    return (
      success?
        <PageHeaderWrapper>
          <Divider orientation="left">员工信息</Divider>
          <Card bordered={false}>
            <DescriptionList size="large">
              <Description term="员工姓名">{current.real_name}</Description>
              <Description term="联系电话">{current.username}</Description>
              <Description term="系统角色">{current.role_name}</Description>
              <Description term="在职状态">{current.status}</Description>
              <Description term="基本工资">{current.basic_salary}</Description>
              <Description term="入职时间">{current.entry_time}</Description>
              <Description term="QQ号码">{current.qq}</Description>
            </DescriptionList>
          </Card>
          <Divider orientation="left">本月总结</Divider>
          <Card bordered={false}>
            <Row>
              <Col sm={12} xs={24}>
                <Info title="基本工资" value={salary.basic_money?salary.basic_money: '0'} bordered />
              </Col>
              <Col sm={12} xs={24}>
                <Info title="最终工资" value={salary.current_month_money?salary.current_month_money: '0'} />
              </Col>
            
            </Row>
          </Card>
          <Divider orientation="left">考核记录</Divider>
          <div className={styles.tableList}>
            <Card bordered={false}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={(e) => this.showModal(e)}>
                  新建考核记录
                </Button>
              </div>
              <StandardTable
                loading={loading}
                data={dataSorce}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange} 
              />
            </Card>


          </div>
          <Modal
            title='账户添加'
            className={styles.standardListForm}
            width={640}
            bodyStyle={{ padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            {...modalFooter}
            maskClosable={false}
          >
            {getModalContent()}
          </Modal>  
        </PageHeaderWrapper>:<Spin size="large" />
  
    );
  }
}

export default CenterPage;
