import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import Exception from '@/components/Exception';
import { Button } from 'antd';

const toLogin =() => {
  localStorage.removeItem('token')
  localStorage.removeItem('warcraft-admin-authority')
  router.push('/login');
}

const Exception403 = () => (
  <Fragment>
    <Exception
      type="403"
      desc={formatMessage({ id: 'app.exception.description.403' })}
      linkElement={Link}
      backText={formatMessage({ id: 'app.exception.back' })}
    />
    <Button style={{display: 'block',margin: '0 auto'}} type="primary" ghost onClick={toLogin}>重新登录</Button>
  </Fragment>
  
);

export default Exception403;
