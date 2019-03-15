import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Input, message, Divider, Popconfirm, Select } from 'antd';

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



  @Form.create()
  class CreateForm extends Component {
    static defaultProps = {
      handleAdd: () => {},
      handleModalVisible: () => {},
      values: {},
    };
  
    constructor(props) {
      super(props);
      this.state = {
        formVals: {
          equip_name: props.values.equip_name,
          id: props.values.id,
          equip_type: '0'
        },
        isShow: false
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
  
    showType =(value) => {
      const { parentData: {needTypeList} } = this.props
      this.setState({
        isShow: !! needTypeList.includes(value)
      })
    }

    renderContent = formVals => {
      const { form, parentData} = this.props;
      const { isShow } = this.state
      return [
        <FormItem key="equip_name" {...this.formLayout} label="装备名称">
          {form.getFieldDecorator('equip_name', {
            rules: [{ required: true, message: '请输入装备名称！' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入天赋名称" />)}
        </FormItem>,
        <FormItem key="equip_location" {...this.formLayout} label="装备部位">
          {form.getFieldDecorator('equip_location', {
            rules: [{ required: true, message: '请选择装备部位！'}],
            initialValue: formVals.Monster_name,
          })(
            <Select placeholder="请选择装备部位" style={{ width: '100%' }} onSelect={(value) => {this.showType(value)}}>
              {parentData.equipLocationList.map( (item) => 
                (<Option key={item.id}>{item.name}</Option>)
              )}
            </Select>
          )}
        </FormItem>,
        
        (isShow && 
          <FormItem key="equip_type" {...this.formLayout} label="装备类型">
            {form.getFieldDecorator('equip_type', {
              rules: [{ required: true, message: '请选择装备类型！'}],
              initialValue: formVals.Monster_name,
            })(
              <Select placeholder="请选择装备类型" style={{ width: '100%' }}>
                {parentData.equipTypeList.map( (item) => 
                  (<Option key={item.id}>{item.name}</Option>)
                )}
              </Select>
            )}
          </FormItem>
        ),

        <FormItem key="talent_ids" {...this.formLayout} label="适用天赋">
          {form.getFieldDecorator('talent_ids', {
            rules: [{ required: true, message: '请选择适用天赋！'}],
            initialValue: formVals.Monster_name,
          })(
            <Select placeholder="请选择适用天赋" mode="multiple" style={{ width: '100%' }}>
              {parentData.talentList.map( (item) => 
                (<Option key={item.id}>{item.talent_name}</Option>)
              )}
            </Select>
          )}
        </FormItem>,
        <FormItem key="monster_id" {...this.formLayout} label="所属怪物">
          {form.getFieldDecorator('monster_id', {
            rules: [{ required: true, message: '请选择所属怪物！'}],
            initialValue: formVals.Monster_name,
          })(
            <RemoteSelect url="/api/monster/searchlist" onSelectHandel={this.onSelectHandel} initialValue="" />
          )}
        </FormItem>,
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
      const { form, handleAdd, values} = this.props;
      const  defaultValues = {
        equip_type: '0'
      }
      form.validateFields((err, fieldsValue) => {
      
        if (err) return;
        const formVals = {...defaultValues, ...values, ...fieldsValue };
        this.setState(
          {
            formVals,
          },
          () => {
            handleAdd(formVals);
          }
        );
      });
    };
  
    render() {
      const { modalVisible, handleModalVisible, values } = this.props;
      const { formVals } = this.state;
  
      return (
        <Modal
          width={640}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title="添加"
          visible={modalVisible}
          footer={this.renderFooter()}
          onCancel={() => handleModalVisible(false, values)}
          afterClose={() => handleModalVisible()}
        >
          {this.renderContent(formVals)}
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
        equip_name: props.values.equip_name,
        id: props.values.id,
        equip_type: '0'
      }
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

 

  getId = (name, objArr) => {
    let locationId = ""
    // eslint-disable-next-line
    objArr.map(item => {
      if( item.name === name ) {
        locationId = item.id
      }
    })
    return locationId
  }
 
  onSelectHandel = (value) => {
    const { form } = this.props
    form.setFieldsValue({
      monster_id: value
    })
  }



  renderContent = () => {
    const { form, parentData, values} = this.props;
    return [
      <FormItem key="equip_name" {...this.formLayout} label="装备名称">
        {form.getFieldDecorator('equip_name', {
          rules: [{ required: true, message: '请输入装备名称！' }],
          initialValue: values.equip_name,
        })(<Input placeholder="请输入装备名称" />)}
      </FormItem>,
      <FormItem key="equip_location" {...this.formLayout} label="装备部位">
        {form.getFieldDecorator('equip_location', {
          rules: [{ required: true, message: '请选择装备部位！'}],
          initialValue: this.getId(values.equip_location, parentData.equipLocationList),
        })(
          <Select placeholder="请选择装备部位" style={{ width: '100%' }} onSelect={(value) => { if(!parentData.needTypeList.includes(value)) { form.setFieldsValue({equip_type: '0'})} }}>
            {parentData.equipLocationList.map( (item) => 
              (<Option key={item.id}>{item.name}</Option>)
            )}
          </Select>
        )}
      </FormItem>,
      (parentData.needTypeList.includes(form.getFieldValue('equip_location')) &&
        <FormItem key="equip_type" {...this.formLayout} label="装备类型">
          {form.getFieldDecorator('equip_type', {
            rules: [{ required: true, message: '请选择装备类型！'}],
            // initialValue: values.equip_type,
          })(
            <Select placeholder="请选择装备类型" style={{ width: '100%' }}>
              {parentData.equipTypeList.map( (item) => 
                (<Option key={item.id}>{item.name}</Option>)
              )}
            </Select>
          )}
        </FormItem>
      ),
      <FormItem key="talent_ids" {...this.formLayout} label="适用天赋">
        {form.getFieldDecorator('talent_ids', {
          rules: [{ required: true, message: '请选择适用天赋！'}],
          // initialValue: values.ids,
        })(
          <Select placeholder="请选择适用天赋" mode="multiple" style={{ width: '100%' }}>
            {parentData.talentList.map( (item) => 
              (<Option key={item.id}>{item.talent_name}</Option>)
            )}
          </Select>
        )}
      </FormItem>,
      <FormItem key="monster_id" {...this.formLayout} label="所属怪物">
        {form.getFieldDecorator('monster_id', {
          rules: [{ required: true, message: '请选择所属怪物！'}],
          // initialValue: values.monster_name,
        })(
          <RemoteSelect url="/api/monster/searchlist" onSelectHandel={this.onSelectHandel} initialValue title={values.monster_name} />
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
    const  defaultValues = {
      equip_type: '0'
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...values,...defaultValues, ...fieldsValue };
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
      render: (value) => ( value === '0'? '无' : value)  
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
          {talents.map((talent,ids) => 
            <Fragment>
              <span color="blue" key={talent}>{talent}</span> { ids !== talents.length-1 && <Divider type="vertical" style={{margin: '0 2px'}} />}
            </Fragment>)
          }
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
     dispatch({
        type: 'talent/fetchAll'
      })
      dispatch({
        type: 'monster/fetch'
      })
      dispatch({
        type: 'equip/fetchData1'
      })
  }

  handleFetch = dispatch => {
    dispatch({
      type: 'equip/fetch',
    });
  };

  handleCall = (okText) => {
    const {dispatch, equip: {res} } = this.props;
    if(res && res.ret === 0) {
      message.success(okText || res.msg);
      dispatch({
        type: 'equip/fetch',
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
      dispatch({
        type: 'talent/fetchAll'
      })
      dispatch({
        type: 'equip/fetchData1'
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
    dispatch({
      type: 'talent/fetchAll'
    })
    dispatch({
      type: 'equip/fetchData1'
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
        this.handleCall('更新成功')
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
        this.handleCall('已删除')
      }  
    )
  };

  render() {
    const {
      equip: { data },
      equip: { data1 },
      talent,
      loading,
    } = this.props;
    const needTypeList = []
    const needType1 = data1.needType || []
    needType1.map( item => 
        needTypeList.push(item.id)
    )
    const { modalVisible, updateModalVisible, formValues } = this.state;
    const parentData = {
      equipLocationList: data1.equipLocation || [],
      equipTypeList: data1.equipType || [],
      needTypeList: needTypeList || [],
      talentList: talent.all || [],
      monsterList: [] 
    } 
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
                添加
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} parentData={parentData} />
        <UpdateForm
          {...updateMethods}
          values={formValues}
          parentData={parentData}
          updateModalVisible={updateModalVisible}
        />

       
      </PageHeaderWrapper>
  
    );
  }
}

export default EquipPage;
