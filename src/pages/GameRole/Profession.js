import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Input, message, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './game.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建职业"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="职业名称">
        {form.getFieldDecorator('profession_name', {
          rules: [{ required: true, message: '请输入职业名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  renderContent = formVals => {
    const { form } = this.props;
    return [
      <FormItem key="name" {...this.formLayout} label="职业名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入职业名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      // <FormItem key="desc" {...this.formLayout} label="规则描述">
      //   {form.getFieldDecorator('desc', {
      //     rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
      //     initialValue: formVals.desc,
      //   })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      // </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext()}>
        完成
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ profession, loading }) => ({
  profession,
  loading: loading.models.profession,
}))
class ProfessionPage extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'profession_name',
      key: 'profession_name',
      align: 'center',
    },
    {
      title: '操作',
      render: () => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true)}>更新</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
      ),
      align: 'center',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.handleFetch(dispatch);
  }

  handleFetch = dispatch => {
    dispatch({
      type: 'profession/fetch',
    });
  };

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
      type: 'profession/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'profession/add',
      payload: {
        profession_name: fields.profession_name,
      },
    });
    this.handleFetch(dispatch);
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'profession/update',
      payload: {
        profession_name: fields.name,
      },
    });

    message.success('更新成功');
    this.handleUpdateModalVisible();
  };

  render() {
    const {
      profession: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <UpdateForm {...updateMethods} updateModalVisible={updateModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default ProfessionPage;
