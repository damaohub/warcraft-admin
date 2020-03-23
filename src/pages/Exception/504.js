
import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception504 = () => (
  <Exception
    type="504"
    desc={formatMessage({ id: 'app.exception.description.504' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception504;
