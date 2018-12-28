import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Input, message, Divider, Popconfirm, Select, Tag } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RemoteSelect from '@/components/RemoteSelect'

import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, monsterList } = props;

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
      title="添加装备" 
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
   
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="装备名称">
        {form.getFieldDecorator('equip_name', {
          rules: [{ required: true, message: "请输入装备名称" }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

    
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="装备部位">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择装备部位！'}],
        })(
          <Select placeholder="请选择装备部位" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="装备类型">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择装备类型！'}],
        })(
          <Select placeholder="请选择装备类型" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="适用天赋">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择适用天赋！'}],
        })(
          <Select placeholder="请选择适用天赋" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属怪物">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择所属怪物！'}],
        })(
          <Select placeholder="请选择所属怪物" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
          
        )}
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
        equip_name: props.values.equip_name,
        id: props.values.id,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }


  renderContent = formVals => {
    const { form, monsterList} = this.props;
    return [
      <FormItem key="name" {...this.formLayout} label="天赋名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入天赋名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入天赋名称" />)}
      </FormItem>,
      <FormItem key="monster_id" {...this.formLayout} label="装备部位">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择装备部位！'}],
          initialValue: formVals.Monster_name,
        })(
          <Select placeholder="请选择装备部位" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>,
      <FormItem key="monster_id" {...this.formLayout} label="装备类型">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择装备类型！'}],
          initialValue: formVals.Monster_name,
        })(
          <Select placeholder="请选择装备类型" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>,
      <FormItem key="monster_id" {...this.formLayout} label="适用天赋">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择适用天赋！'}],
          initialValue: formVals.Monster_name,
        })(
          <Select placeholder="请选择适用天赋" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>,
      <FormItem key="monster_id" {...this.formLayout} label="所属怪物">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择所属怪物！'}],
          initialValue: formVals.Monster_name,
        })(
          <Select placeholder="请选择所属怪物" style={{ width: '100%' }}>
            {monsterList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
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
@connect(({ equip, monster, talent, loading }) => ({
  equip,
  monster,
  talent,
  loading: loading.models.equip,
}))
class EquipPage extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: {}
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
      dataIndex: 'equip_name',
      key: 'equip_name',
      align: 'center',
    },
    {
      title: '装备部位',
      dataIndex: 'equip_location',
      key: 'equip_location',
      align: 'center',
    },
    {
      title: '装备类型',
      dataIndex: 'equip_type',
      key: 'equip_type',
      align: 'center',
    },
    {
      title: '所属怪物',
      dataIndex: 'monster_name',
      key: 'monster_name',
      align: 'center',
    },
    {
      title: '所属副本',
      dataIndex: 'instance_name',
      key: 'instance_name',
      align: 'center',
    },
    {
      title: '适用天赋',
      dataIndex: 'talents',
      key: 'talents',
      align: 'center',
      render: talents => (
        <span>
          {talents.map(talent => <Tag color="blue" key={talent}>{talent}</Tag>)}
        </span>
      ),
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
      type: 'equip/fetch',
    });
  };

  handleCall = (okText, failText) => {
    const {dispatch, equip: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
    } else {
      message.error(failText || res.msg);
    }
    dispatch({
      type: 'equip/fetch',
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
      type: 'equip/fetch',
      payload: params,
    });
  };

  handleModalVisible = (flag) => {
    if(flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'monster/fetch'
      })
     }
    this.setState({
      modalVisible: !!flag,
    });

  };

  handleUpdateModalVisible = (flag, record) => {
   if(flag) {
    const { dispatch } = this.props;
    dispatch({
      type: 'monster/fetch'
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
      type: 'equip/add',
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
      type: 'equip/update',
      payload: fields
    }).then(
      () => {
        this.handleUpdateModalVisible()
        this.handleCall('更新成功','更新失败')
      }  
    )
    
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'equip/remove',
      payload: { id: record.id },
    }).then(
      () => {
        this.handleCall('已删除','删除失败')
      }  
    )
  };

  render() {
    const {
      equip: { data },
      monster: {data: {list}},
      loading,
    } = this.props;
    const monsterList = list
    console.log(monsterList)
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
        <RemoteSelect value="sw" />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加怪兽
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} monsterList={monsterList} />
        <UpdateForm
          {...updateMethods}
          values={formValues}
          monsterList={monsterList}
          updateModalVisible={updateModalVisible}
        />

       
      </PageHeaderWrapper>
  
    );
  }
}

export default EquipPage;
