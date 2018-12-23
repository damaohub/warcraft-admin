import React, { Component } from 'react';
import { connect } from 'dva';
import Login from '@/components/Login';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert } from 'antd';
import saltMD5 from '@/utils/saltMD5';

import styles from './index.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  handleSubmit = err => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          username: '13733893092',
          password: saltMD5.md5('ylms666'),
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {/* {this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))} */}
          <UserName
            name="userName"
            placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.userName.required' }),
              },
            ]}
          />

          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'app.login.password' })}: ant.design`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.password.required' }),
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
