import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, message, Divider, Popconfirm,} from 'antd';


import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import saltMD5 from '@/utils/saltMD5';

import styles from '../GameRole/game.less';



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
class SettingPage extends Component {
  state = {
 
    formValues: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  columns = [
    {
      title: '昵称',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
      align: 'center',
    },
    {
      title: '在职状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '入职时间',
      dataIndex: 'entry_time',
      key: 'entry_time',
      align: 'center',
    },
    {
      title: '基本工资',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      align: 'center',
    },
    {
      title: 'QQ号',
      dataIndex: 'qq',
      key: 'qq',
      align: 'center',
    },
    {
      title: '上次登录',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      align: 'center',
    },
    
    
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href={`#/staff/setting?uid=${record.id}`}>完善信息</a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          
        </Fragment>
      ),
      align: 'center',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'staff/fetch',
    });
    dispatch({
      type: 'role/fetch',
    });
   
  }

 
  handleCall = (okText, failText) => {
    const {dispatch, staff: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
    } else {
      message.error(failText || res.msg);
    }
    dispatch({
      type: 'staff/fetch',
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
      type: 'staff/fetch',
      payload: params,
    });
  };

  showModal = (e, item) => {
    e.preventDefault()
    let newCurrent
    if(item) {
      newCurrent = {pid: item.key}
    }
    this.setState({
 
      current: newCurrent
    });
  };

  handleCancel = () => {
    this.setState({
 
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
          this.handleCall('操作成功')
        }
      );
    });
  };

  render() {
    
  





    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              12312321
             
            </div>
            
          </div>
        </Card>
        
      </PageHeaderWrapper>
  
    );
  }
}

export default SettingPage;
