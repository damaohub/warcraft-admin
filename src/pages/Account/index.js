import React, { PureComponent ,Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Input, Button, Divider, Popconfirm, message, Select, Row, Col } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, account, profession, talent }) => ({
    account,
    profession,
    talent,
    Loading: loading.models.account,
  }))
  @Form.create()
  class AccountPage extends PureComponent {
    state = {
      visible: false,
    };

    formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    columns = [
    
      {
        title: '账号',
        dataIndex: 'account_name',
        key: 'account_name',
        align: 'center',
        width: 160,
        fixed: 'left',
      },
      {
        title: '账号类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        // eslint-disable-next-line
        render: (item) => {
          switch(item) {
            case '0':
              return '工作室账号'
            case '1' :
              return '客户账号'
            case '2' :  
              return '借用账号'
            default: 
            break;  
          }
        }
      },
      {
        title: '密码',
        dataIndex: 'account_pwd',
        key: 'account_pwd',
        align: 'center',
      },
      {
        title: '服务器',
        dataIndex: 'region_id',
        key: 'region_id',
        align: 'center',
      },
      {
        title: '子账号',
        dataIndex: 'child_name',
        key: 'child_name',
        align: 'center',
      },
      {
        title: '游戏角色',
        dataIndex: 'game_role_name',
        key: 'game_role_name',
        align: 'center',
      },
      {
        title: '所属阵营',
        dataIndex: 'organization',
        key: 'organization',
        align: 'center',
        render: (item) => (
          item ==='0'? '联盟': '部落'
        )
      },
      {
        title: '角色等级',
        dataIndex: 'level',
        key: 'level',
        align: 'center',
      },
      {
        title: '职业',
        dataIndex: 'profession_name',
        key: 'profession_name',
        align: 'center',
      },
      {
        title: '可用天赋',
        dataIndex: 'talents',
        key: 'talents',
        align: 'center',
        render: talents => (
          <span>
            {talents.map((talent,ids) => 
              <Fragment>
                <span color="blue" key={talent.id}>{talent.talent_name}</span> { ids !== talents.length-1 && <Divider type="vertical" style={{margin: '0 2px'}} />}
              </Fragment>)
            }
          </span>
        )
      },
      
      {
        title: '拾取天赋',
        dataIndex: 'need_talent_name',
        key: 'need_talent_name',
        align: 'center',
      },
      {
        title: '装备等级',
        dataIndex: 'equip_level',
        key: 'equip_level',
        align: 'center',
      },
      {
        title: '操作',
       
        render: (text, record) => (
          <Fragment>
            <a onClick={(e)=> this.showEditModal(e, record)}>修改</a>
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
        type: 'account/fetch',
      });
    
      dispatch({
        type: 'profession/fetch',
        payload: {pageSize: 10000}
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
        type: 'account/fetch',
        payload: params,
      });
    };
  
    handleCall = (okText, failText) => {
      const {dispatch, account: {res} } = this.props;
      if(res && res.ret === 0) {
        message.success(okText || res.msg);
      } else {
        message.error(failText || res.msg);
      }
      dispatch({
        type: 'account/fetch',
      });
    }

    showModal = (e) => {
      e.preventDefault()
      this.setState({
        visible: true,
        current: false
      });
    };
  
    showEditModal = (e,item) => {
     this.selectHandel(item.profession_id)
      e.preventDefault()
      this.setState({
        visible: true,
        current: item,
      });
    };
  
   
  
    handleCancel = () => {
      this.setState({
        visible: false,
      });
    };
  

    handleDelete = record => {
      const { dispatch } = this.props;
      dispatch({
        type: 'account/remove',
        payload: { id: record.id },
      }).then(
        () => {
          this.handleCall('已删除','删除失败')
        }  
      )
    };

    handleSubmit = e => {
      e.preventDefault();
      const { dispatch, form } = this.props;
      const { current } = this.state;
      const typeMap = ['account/update', 'account/add']
      const dataMap = [{id: current.id}, {} ]
      const typeIndex = current && current.id ? 0 : 1
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        dispatch({
          type: typeMap[typeIndex],
          payload: Object.assign(dataMap[typeIndex], fieldsValue),
        }).then(
          () => {
            this.handleCancel()
            this.handleCall('操作成功')
          }
        );
      });
    };

    selectHandel = value => {
      const {dispatch, form } = this.props;
      dispatch({
        type: 'talent/fetch',
        payload: { profession_id: value,pageSize: 10000}
      });
      form.setFieldsValue({
        'talent_id': undefined,
        'need_talent_id': undefined
      });
    }

    handleSearch = e => {
      e.preventDefault();
  
      const { dispatch, form } = this.props;
      
      form.validateFields((err, fieldsValue) => {
        // if (err) return;
        const values = {
          account_name: fieldsValue.f_account_name,
          organization: fieldsValue.f_organization,
          game_role_name: fieldsValue.f_game_role_name,
          profession_id: fieldsValue.f_profession_id
        };
  
        this.setState({
          formValues: values,
        });
  
        dispatch({
          type: 'account/fetch',
          payload: values,
        });
      });
    };

    handleFormReset = () => {
      const { form, dispatch } = this.props;
      form.resetFields();
      this.setState({
        formValues: {},
      });
      dispatch({
        type: 'account/fetch',
        payload: {},
      });
    };

    renderForm = (professionList) => {
      const {
        form: { getFieldDecorator },
      } = this.props;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="账号">
                {getFieldDecorator('f_account_name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="阵营">
                {getFieldDecorator('f_organization')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">联盟</Option>
                    <Option value="1">部落</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="角色">
                {getFieldDecorator('f_game_role_name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="职业">
                {getFieldDecorator('f_profession_id')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {professionList.map( (item) => 
                      (<Option key={item.id}>{item.profession_name}</Option>)
                    )}
                  </Select>
                 )}
              </FormItem>
            </Col>
          </Row>
          {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            
          </Row> */}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
             
            </div>
          </div>
        </Form>
      );
    }
    


    render() {
      const {
        Loading,
        account,
        profession,
        talent,
        form: { getFieldDecorator },
      } = this.props;
      const { visible, current = {}} = this.state
      const {data} = account
      const professionList = profession.data.list
      const talentList = talent.data.list
    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    // const labelName = !current.pid || current.pid === "0"? '分组名称' : '接口名称'

    const getModalContent = () => 
      (
        <Form onSubmit={this.handleSubmit}>

          <FormItem label="账号类型" {...this.formLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: `请选择账号类型` }],
              initialValue: current.type,
            })(
              <Select placeholder="请选择账号类型" style={{ width: '100%' }}>
                <Option key='0'>工作室账号</Option>
                <Option key='1'>客户账号</Option>
                <Option key='2'>借用账号</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="账号" {...this.formLayout}>
            {getFieldDecorator('account_name', {
              rules: [{ required: true, message: `请输入账号` }],
              initialValue: current.account_name,
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem label="密码" {...this.formLayout}>
            {getFieldDecorator('account_pwd', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: current.account_pwd,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          
          

          <FormItem label="子账号" {...this.formLayout}>
            {getFieldDecorator('child_name', {
              rules: [{ required: true, message: '请输入子账号' }],
              initialValue: current.child_name,
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem label="服务器" {...this.formLayout}>
            {getFieldDecorator('region_id', {
              rules: [{ required: true, message: `请输入服务器` }],
              initialValue: current.region_id,
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem label="游戏角色" {...this.formLayout}>
            {getFieldDecorator('game_role_name', {
              rules: [{ required: true, message: '请输入游戏角色' }],
              initialValue: current.game_role_name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="所属阵营" {...this.formLayout}>
            {getFieldDecorator('organization', {
              rules: [{ required: true, message: '请选择阵营' }],
              initialValue: current.organization,
            })(
              <Select placeholder="请选择阵营" style={{ width: '100%' }}>
                <Option key='0'>联盟</Option>
                <Option key='1'>部落</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="角色等级" {...this.formLayout}>
            {getFieldDecorator('level', {
              rules: [{ required: true, message: '请输入角色等级' }],
              initialValue: current.level,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="角色职业" {...this.formLayout}>
            {getFieldDecorator('profession_id', {
              rules: [{ required: true, message: '请选择职业' }],
              initialValue: current.profession_id,
            })(
              <Select placeholder="请选择职业" style={{ width: '100%' }} onSelect={(value) => {this.selectHandel(value)}}>
                {professionList.map( (item) => 
                  (<Option key={item.id}>{item.profession_name}</Option>)
                )}
              </Select>
            )}
          </FormItem>
          <FormItem label="可用天赋" {...this.formLayout}>
            {getFieldDecorator('talent_id', {
              rules: [{ required: true, message: '请选择可用天赋' }],
             
            })(
              <Select mode="multiple" autoClearSearchValue placeholder="请选择可用天赋" style={{ width: '100%' }}>
                {talentList.map( (item) => 
                  (<Option key={item.id}>{item.talent_name}</Option>)
                )}
              </Select>
            )}
          </FormItem>
          <FormItem label="拾取天赋" {...this.formLayout}>
            {getFieldDecorator('need_talent_id', {
              rules: [{ required: true, message: '请选择拾取天赋' }],
             
            })(
              <Select placeholder="请选择拾取天赋" style={{ width: '100%' }}>
                {talentList.map( (item) => 
                  (<Option key={item.id}>{item.talent_name}</Option>)
                )}
              </Select>
            )}
          </FormItem>
          <FormItem label="装备等级" {...this.formLayout}>
            {getFieldDecorator('equip_level', {
              rules: [{ required: true, message: '请输入装备等级' }],
              initialValue: current.equip_level,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Form>
      );

      return (
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.cardList}>
              <div className={styles.tableListForm}>{this.renderForm(professionList)}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={(e) => {this.showModal(e, false)}}>
                  添加账号
                </Button>
              </div>
              <StandardTable
                loading={Loading}
                data={data}
                scroll={{ x: 1300 }} 
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <Modal
            title={`账号${(current && current.id) ? '编辑' : '添加'}`}
            className={styles.standardListForm}
            width={640}
            bodyStyle={{ padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            {...modalFooter}
            maskClosable={false}
           
          >
            {getModalContent()}
          </Modal>
        </PageHeaderWrapper>
      );
    }
  }
  
  export default AccountPage;