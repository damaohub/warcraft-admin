import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, message, Divider, Modal, Input, Select, Popconfirm, Tag} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import saltMD5 from '@/utils/saltMD5';
import { getCurrentPage } from '@/utils/utils';
import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const { Option } = Select;


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@Form.create()
/* eslint react/no-multi-comp:0 */
@connect(({ staff, role, loading }) => ({
  staff,
  role,
  loading: loading.models.staff,
}))
class StaffPage extends Component {
  state = {
    visible: false,
    formValues: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
      align: 'center',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      width: 110
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center',
      width: 110
    },
    
    {
      title: '在职状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (text,record) => (
        <Fragment>
          {
            (text ==="在职" || text === 1) ?
              <Popconfirm title="确定该员工离职？" onConfirm={(e) => this.getWay(e, record)}>
                <Tag color="#108ee9">{typeof text === 'string'? <span>{text}</span> : <span>{text===1? '在职': '离职'}</span> }</Tag>
              </Popconfirm> : 
              <Tag>{typeof text === 'string'? <span>{text}</span> : <span>{text===1? '在职': '离职'}</span> }</Tag>
          }
        </Fragment>
      ),
    },
    {
      title: '入职时间',
      dataIndex: 'entry_time',
      key: 'entry_time',
      align: 'center',
      width: 160
    },
    {
      title: '基本工资',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      align: 'center',
      width: 150,
    },
    {
      title: 'QQ号',
      dataIndex: 'qq',
      key: 'qq',
      align: 'center',
      width: 120,
    },
    {
      title: '上次登录',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      align: 'center',
      width: 160
    },
    
    
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href={`#/staff/setting?uid=${record.id}`}>完善信息</a>
          <Divider type="vertical" />
          <a href={`#/staff/center?uid=${record.id}`}>员工考核</a>
          
        </Fragment>
      ),
      align: 'center',
      width: 160
    },
  ];

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'staff/fetch',
    }).then(
      () => {
        const {staff: { data }} = this.props
        this.setState({
          pagination: data.pagination
        })
      }
      
    );
    dispatch({
      type: 'role/fetch',
    });
   
  }



      /**
   * @param okText str 请求成功后提示信息，如果是默认undifined, 会提示接口返回信息
   * @param type 操作类型, 1:增加，-1:删除，0：修改(默认)
   */
  handleCall = (okText = undefined, type ) => {
    const { dispatch, staff: {res} } = this.props;
    const { pagination } = this.state;
    const currentPage = getCurrentPage(pagination, type);
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
      
      dispatch({
        type: 'staff/fetch',
        payload: { currentPage, pageSize: pagination.pageSize},
      }).then(
        ()=> {
          const {staff: { data }} = this.props;
          const paginationProps = data.pagination
          pagination.pageSize = paginationProps.pageSize;
          pagination.total = paginationProps.total
          pagination.current = currentPage
          this.setState({
            pagination
          })
        }
      )
    }
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
      type: 'staff/fetch',
      payload: params,
    });
    this.setState({
      pagination
    });
  };

  showModal = (e, item) => {
    e.preventDefault()
    let newCurrent
    if(item) {
      newCurrent = {pid: item.key}
    }
    this.setState({
      visible: true,
      current: newCurrent
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
    const { current } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(fieldsValue.password) {
        Object.assign (fieldsValue,{password: saltMD5.md5(fieldsValue.password)})
      }
      dispatch({
        type: 'staff/add',
        payload: {...current, ...fieldsValue},
      }).then(
        () => {
          this.handleCancel()
          this.handleCall('操作成功!', 1);
        }
      );
    });
  };

  getWay = (e, record) => {
    e.preventDefault()
    const { dispatch } = this.props;
    dispatch({
      type: 'staff/getway',
      payload: {id: record.id}
    }).then(
      () => {
        this.handleCall('操作成功!');
      }
    )
  }

  render() {
    const {
      role: {data:{list}},
      staff: { data },
      loading,
      form: { getFieldDecorator }
    } = this.props;
    const {visible, current={}} = this.state

    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const getModalContent = () => (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label='手机号' {...this.formLayout}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: `请输入姓名` }],
            initialValue: current.username,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label='密码' {...this.formLayout}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: `请输入密码` }],
            initialValue: current.password,
          })(<Input placeholder="请输入"  />)}
        </FormItem>
        <FormItem label='角色' {...this.formLayout}>
          {getFieldDecorator('role_id', {
            rules: [{ required: true, message: `请选择角色` }],
            initialValue: current.password,
          })(
            <Select placeholder="请选择角色" style={{ width: '100%' }}>
              {list.map( (item) => 
                (<Option key={item.id}>{item.role_name}</Option>)
              )}
            </Select>
          )}
        </FormItem>
      </Form>
    )

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={(e) => this.showModal(e)}>
                新建账号
              </Button>
             
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>
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
      </PageHeaderWrapper>
  
    );
  }
}

export default StaffPage;
