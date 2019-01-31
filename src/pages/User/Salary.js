import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Divider
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './Salary.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ user }) => ({
  user,
}))
@Form.create()
class SalaryPage extends PureComponent {
  state = { };

  columns = [
    {
      title: '金额',
      dataIndex: 'money',
      key: 'money',
      align: 'center',
      
      render: (item, row) => {
        if(row.type === "1" || row.type === "3") {
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

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/salary',
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
      type: 'user/salary',
      payload: params,
    });
  };

  render() {
    const {
      user: { salary },
    } = this.props;
  const {list, pagination} = salary


    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );


  
    return (
    
      <div className={styles.standardList}>
        <Card bordered={false}>
          <Row>
            <Col sm={12} xs={24}>
              <Info title="基本工资" value={salary.basic_money} bordered />
            </Col>
            <Col sm={12} xs={24}>
              <Info title="最终工资" value={salary.current_month_money} />
            </Col>
          
          </Row>
        </Card>
        <Divider />
        <Card
          className={styles.listCard}
          bordered={false}
          title="考核记录"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
        >
          <StandardTable
            data={{list, pagination}}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
           
          />
        </Card>
      </div>
      

    );
  }
}

export default SalaryPage;