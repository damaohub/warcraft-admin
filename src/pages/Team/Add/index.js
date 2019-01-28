import React, { PureComponent, Fragment } from 'react';
import { } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';

// const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper
       
        tabActiveKey={location.pathname}
      
      >
      
        <Fragment>
          {/* <Steps current={this.getCurrentStep()} className={styles.steps}>
            <Step title="获取账号组合" />
            <Step title="22" />
            <Step title="333" />
          </Steps> */}
          {children}
        </Fragment>
      
      </PageHeaderWrapper>
    );
  }
}
