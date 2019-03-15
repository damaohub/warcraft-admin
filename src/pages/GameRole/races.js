import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Input, message, Divider, Popconfirm } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getCurrentPage } from '@/utils/utils';

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
      title="新建种族"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="种族名称">
        {form.getFieldDecorator('race_name', {
          rules: [{ required: true, message: '请输入种族名称！' }],
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
        id: props.values.id,
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
      <FormItem key="race_name" {...this.formLayout} label="种族名称">
        {form.getFieldDecorator('race_name', {
          rules: [{ required: true, message: '请输入种族名称！' }],
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
      <Button key="submit" type="primary" onClick={() => this.handleNext(values)}>
        完成
      </Button>,
    ];
  };

  handleNext = () => {
    const { form, handleUpdate, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...values, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        }
      );
    });
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
@connect(({ races, loading }) => ({
  races,
  loading: loading.models.races,
}))
class RacesPage extends Component {
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
      dataIndex: 'race_name',
      key: 'race_name',
      align: 'center',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>更新</a>
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
      type: 'races/fetch',
    }).then(
      () => {
        const {races: { data }} = this.props
        this.setState({
          pagination: data.pagination
        })
      }
      
    );
   
  }

 /**
 * @param okText str 请求成功后提示信息，如果是默认undifined, 会提示接口返回信息
 * @param type 操作类型, 1:增加，-1:删除，0：修改(默认)
 */

  handleCall = (okText = undefined, type ) => {
    const { dispatch, races: {res} } = this.props;
    const { pagination } = this.state;
    const currentPage = getCurrentPage(pagination, type);

    if(res && res.ret === 0) {
      message.success(okText || res.msg);
      dispatch({
        type: 'races/fetch',
        payload: { currentPage, pageSize: pagination.pageSize},
      }).then(
        ()=> {
          const {races: { data }} = this.props;
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

  handleStandardTableChange = (pagination, filtersArg = {}, sorter) => {
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
      type: 'races/fetch',
      payload: params,
    });
    this.setState({
      pagination
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      formValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'races/add',
      payload: {
        race_name: fields.race_name,
      }
    }).then(
      () => {
        this.handleModalVisible()
        this.handleCall('添加成功！', 1)
      }
    )
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'races/update',
      payload: {...fields, ... pagination }
    }).then(
      () => {
        this.handleUpdateModalVisible()
        this.handleCall('更新成功！')
      }  
    )
    
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'races/remove',
      payload: { id: record.id },
    }).then(
      () => {
        this.handleCall('已删除', -1)
      }  
    )
  };

  render() {
    const {
      races: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, formValues } = this.state;
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
        <UpdateForm
          {...updateMethods}
          values={formValues}
          updateModalVisible={updateModalVisible}
        />
      </PageHeaderWrapper>
  
    );
  }
}

export default RacesPage;
