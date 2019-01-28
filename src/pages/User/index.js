import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col,  Divider, Avatar} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './Center.less';

@connect(({ loading, user }) => ({
  
    currentUser: user.currentUser,
    currentUserLoading: loading.effects['user/fetchCurrent'],
  }))

  class Center extends PureComponent {
    state = {
    };
  
    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/fetchCurrent',
      });
     
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
        listLoading,
        currentUser,
        currentUserLoading,
        match,
        location,
        children
      } = this.props;
  
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
                        <Col>{currentUser.status}</Col>
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
                  </div>
                ) : (
                  'loading...'
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