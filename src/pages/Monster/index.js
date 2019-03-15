import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Input, message, Divider, Popconfirm, Select } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class CreateForm extends Component {
  static defaultProps = {
    handleAdd: () => {},
    handleModalVisible: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }



  onSelectHandel = (value) => {
    const { form } = this.props
    form.setFieldsValue({
      monster_id: value
    })
  }


  renderContent = (IM) => {
    const { form, instanceList} = this.props;
  
    return [
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={IM === 0 ? "请输入副本" : "请输入怪兽"}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: IM === 0 ? "请输入副本" : "请输入怪兽"}],
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副本类型">
        {form.getFieldDecorator('instance_type', {
          rules: [{ required: true, message: '请选择副本类型！'}],
        })(
          <Select placeholder="请选择副本类型" style={{ width: '100%' }}>
            <Option key='1'>地下城</Option>
            <Option key='2'>团队副本</Option>
          </Select>
        )}
      </FormItem>,
      (
        IM === 1 && 
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属副本">
          {form.getFieldDecorator('instance_id', {
            rules: [{ required: true, message: '请选择副本！'}],
          })(
            <Select placeholder="请选择副本" style={{ width: '100%' }}>
              {instanceList.map( (item) => 
                (<Option key={item.id}>{item.name}</Option>)
              )}
            </Select>
          )}
        </FormItem>
      )
    ];
  };

  renderFooter = () => {
    const { handleModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext(values)}>
        完成
      </Button>,
    ];
  };

  handleNext = () => {
    const { form, handleAdd, IM } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd({instance_or_monster: IM, ...fieldsValue});
    });
  };

  render() {
    const { modalVisible, handleModalVisible, values, IM } = this.props;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={IM === 0 ? "新建副本" : "添加怪兽"}
        visible={modalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        {this.renderContent(IM)}
      </Modal>
    );
  }
}


@Form.create()
class UpdateForm extends Component {
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
        instance_name: props.values.instance_name
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }


  renderContent = formVals => {
    const { form, instanceList} = this.props;
    return [
      <FormItem key="name" {...this.formLayout} label="怪物名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入天赋名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="instance_id" {...this.formLayout} label="所属副本">
        {form.getFieldDecorator('instance_id', {
          rules: [{ required: true, message: '请选择职业！'}],
          initialValue: formVals.instance_name,
        })(
          <Select placeholder="请选择副本" style={{ width: '100%' }}>
            {instanceList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>,
      <FormItem key="sort" {...this.formLayout} label="编号">
        {form.getFieldDecorator('sort', {
          rules: [{ required: true, message: '请输入所在副本中的排序！' }],
          initialValue: formVals.sort,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
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
@connect(({ monster, loading }) => ({
  monster,
  loading: loading.models.monster,
}))
class MonsterPage extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    isIM: 0
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
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '编号',
      dataIndex: 'sort',
      key: 'sort',
      align: 'center',
    },
    {
      title: '副本名称',
      dataIndex: 'instance_name',
      key: 'instance_name',
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
    this.handleFetch(dispatch);
   
  }

  handleFetch = dispatch => {
    dispatch({
      type: 'monster/fetch',
    });
  };

  handleCall = (okText) => {
    const {dispatch, monster: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
      dispatch({
        type: 'monster/fetch',
      });
    } 
    
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
      type: 'monster/fetch',
      payload: params,
    });
  };

  handleModalVisible = (flag, is) => {
    if(flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'monster/inList'
      })
     }
    this.setState({
      modalVisible: !!flag,
      isIM: is
    });

  };

  handleUpdateModalVisible = (flag, record) => {
   if(flag) {
    const { dispatch } = this.props;
    dispatch({
      type: 'monster/inList'
    })
   }
    
    this.setState({
      updateModalVisible: !!flag,
      formValues: record || {},
    });
   
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monster/add',
      payload: fields
    }).then(
      () => {
        this.handleModalVisible()
        this.handleCall('添加成功')
      }
    )
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monster/update',
      payload: fields
    }).then(
      () => {
        this.handleUpdateModalVisible()
        this.handleCall('更新成功')
      }  
    )
    
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monster/remove',
      payload: { id: record.id },
    }).then(
      () => {
        this.handleCall('已删除')
      }  
    )
  };

  render() {
    const {
      monster: { data },
      monster: {instanceList},
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, formValues, isIM } = this.state;
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 1)}>
                添加怪兽
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 0)}>
                新建副本
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} instanceList={instanceList} IM={isIM} />
        <UpdateForm
          {...updateMethods}
          values={formValues}
          instanceList={instanceList}
          updateModalVisible={updateModalVisible}
        />
      </PageHeaderWrapper>
  
    );
  }
}

export default MonsterPage;
