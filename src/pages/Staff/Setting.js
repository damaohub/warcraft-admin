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
@connect(({ staff, role }) => ({
  staff,
  role
}))
class SettingPage extends Component {
  state = {
 
    formValues: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  
  componentDidMount() {
    const { dispatch, location: {query: {uid}} } = this.props;
    dispatch({
        type: 'staff/current',
        payload: {id: uid}
    })
    // if(uid) {
      

    // } else{
    //     message.error('未获取用户')
    // }
  
    
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
              23123
         
            </div>
            
          </div>
        </Card>
        
      </PageHeaderWrapper>
  
    );
  }
}

export default SettingPage;
