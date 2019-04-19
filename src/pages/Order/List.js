import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card , Table, Tooltip, Divider, Form, Select, Row, Col, Input, Button, Popconfirm, Modal, message, Radio, Icon} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';

import styles from '../GameRole/game.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const statusMap= {'1': '未完成', '2': '已完成'}
const statusColors ={'1': '#ff9500', '2': '#4cd964'}
const typeMap = {"0":'工作室账号',"1":"客户账号", "3": "借用账号"}
const usedMap ={'0': '本周可用','1':'本周已排','3':'本周已完成'}
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@Form.create()

@connect(({ loading, order }) => ({
    order,
    Loading: loading.models.order,
  }))
  class OrderListPage extends PureComponent {
    state = {
 
    };

    formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    

    columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render:item =>(<a href={`#/order/list/detail?oid=${item}`}>{item}</a>)
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="联系电话"
              />
            );
          }
          return text;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 120,
        render: (item, record) => (
          <Fragment>
            <span style={{color:statusColors[item], marginRight: '5px'}}>{statusMap[item]}</span>
            <Popconfirm 
              title={
                <RadioGroup style={{width:"100%", }} defaultValue={item} onChange={e => {this.setState({newStatus: e.target.value})}}>
                  <Radio value="1" style={{display: "block",borderBottom:'1px solid #eee',padding: "0 0 5px"}}>{statusMap["1"]}</Radio>
                  <Radio value="2" style={{display: "block", padding: "5px 0"}}>{statusMap["2"]}</Radio>
                  {/* <Radio value="3" style={{display: "block",borderBottom:'1px solid #eee', padding: "5px 0"}}>代练中</Radio> */}
                  <Divider style={{margin:"0"}} />
                </RadioGroup>
              }
              icon={<span />}
              placement="rightTop"
              onConfirm={e => {this.changeStatus(e,record)}}
            >
              <Icon type="edit" title="修改状态" />
            </Popconfirm>
          </Fragment>
         
          )
      },
     
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 160,
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'finish_time',
        key: 'finish_time',
        width: 160,
        align: 'center',
      },
      {
        title: '角色名',
        dataIndex: 'game_role_name',
        key: 'game_role_name',
        align: 'center',
        width: 200,
        // render: (item,record) => (
        //   <Tooltip 
        //     placement="right" 
        //     title={
        //       <div style={{display:"flex",flexDirection:"column"}}>
        //         <div>账号: {record.account_name}</div>
        //         <div>密码：{record.account_pwd}</div>
        //         <div>账号类型：{typeMap[record.type]}</div>
        //         <div>子账号：{record.child_name}</div>
        //         <div>服务器：{record.region_id}</div>
        //         <div>角色名：{record.game_role_name}</div>
        //         <div>角色等级：{record.level}</div>
        //         <div>阵营：{record.organization ===0 ?"联盟": '部落'}</div>
        //         <div>职业：{record.profession_name}</div>
        //         <div>可用天赋：{record.talent.map((v,i)=>(i===0?<span key={`${i+1}`}>{v}</span>: <span key={`${i+1}`}> <Divider type="vertical" />{v}</span> ))}</div>
        //         <div>装备等级：{record.equip_level}</div>
                
        //       </div>     
        //       }
        //   >
        //     {item}
        //   </Tooltip>
        // )
      },

      {
        title: '淘宝订单ID',
        dataIndex: 'taobaoid',
        key: 'taobaoid',
        align: 'center',
        width: 160,
      },
      
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
        render: (text) => (
          <Ellipsis
            lines={1}
            tooltip={text}
          >
            {text}
          </Ellipsis>

        )
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        align: 'center',
        render: (text, record) => 
        (
          <Fragment>
            <a onClick={e => this.showModal(e, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={(e) => this.remove(e, record)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        )
     
      },
     
    
    ];

    componentWillMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'order/fetch',
        payload: null
      });
     
    }
  
   
  
  
    expandedRowRender = (data) => {
      const columns = [
        data.items.item_id ? { title: '项目号', dataIndex: 'item_id', key: 'item_id', align:'center'  } : { title: '项目号', dataIndex: 'id', key: 'id', align:'center'  },
        { title: '类型', dataIndex: 'instance_or_secret', align:'center',  key: 'instance_or_secret',render:item=>(item==="1"?'地下城':'团本') },
        { title: '副本', dataIndex: 'instance_name', key: 'instance_name',align:'center' },
        { title: '怪物', dataIndex: 'monster_id', key: 'monster_id',align:'center' },
        { title: '难度', dataIndex: 'difficult', key: 'difficult', render: item => {
          switch (item) {
              case 'p':
                  return '普通'
              case 'h':
                  return '英雄' 
              case 'm':
                  return '史诗' 
              default:
                 return `史诗-${item}`
          }
      } },
        { title: '项目数量', dataIndex: 'num', key: 'num', align:'center', render: item=> (item==="-1"?'包版本': item) },
        { title: '完成数量', dataIndex: 'finish_num', key: 'finish_num',align:'center', },
        { title: '账号可用状态', dataIndex: 'week_used', key: 'week_used',align:'center',render: item=> (usedMap[item]) },
        { title: '项目状态', dataIndex: 'item_status', key: 'item_status',align:'center', render:item=>(item==="0"?'未完成': '已完成')},
        { title: '上次完成时间', dataIndex: 'last_finish_time', key: 'last_finish_time',align:'center', },
       
      ];
  
      return (
        <Table
          columns={columns}
          dataSource={data.items}
          pagination={false}
        />
      );
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
        type: 'order/fetch',
        payload: params,
      });
    };
  

    handleSearch = e => {
      e.preventDefault();
  
      const { dispatch, form } = this.props;
      
      form.validateFields((err, fieldsValue) => {
        // if (err) return;
        const values = {
          ...fieldsValue
        };
  
        this.setState({
          formValues: values,
        });
  
        dispatch({
          type: 'order/fetch',
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
        type: 'order/fetch',
        payload: {},
      });
    };

    renderForm = () => {
      const {
        form: { getFieldDecorator },
      } = this.props;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="订单号">
                {getFieldDecorator('id')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="订单状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="1">未完成</Option>
                    <Option value="2">已完成</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="账号">
                {getFieldDecorator('account_name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="角色名">
                {getFieldDecorator('game_role_name')(
                  <Input placeholder="请输入" />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
            <Col lg={6} md={6} sm={24}>
              <FormItem label="手机号">
                {getFieldDecorator('phone', {initialValue: '',})(
                  <Input placeholder="请输入" />)
                }
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <Button type="primary" htmlType="submit">
                  查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </Col>
          </Row>
          
          {/* <div style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
             
            </div>
          </div> */}
        </Form>
      );
    }

    showModal = (e, item) => {
      e.preventDefault()
      this.setState({
        visible: true,
        current: {id: item.id,phone: item.phone, remark: item.remark}
      });
    };

    handleCancel = () => {
      this.setState({
        visible: false,
      });
    };
  
    handleSubmit = e => {
      e.preventDefault();
      const { dispatch, form } = this.props;
      const { current } = this.state;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const {phone, remark} = fieldsValue
        dispatch({
          type: 'order/update',
          payload: {id:current.id, phone, remark},
        }).then(
          () => {
            this.handleCancel()
            const {order:{res}} =this.props;
            if(res.ret ===0 ) {
              dispatch({
                type: 'order/fetch',
              });
              message.success('更新成功！')
            }
            
          }
        );
      });
    };
  
    remove = (e,record) => {
      e.preventDefault()
      const { dispatch } = this.props;
      dispatch({
        type: 'order/remove',
        payload: {id:record.id,}
      }).then(
        () => {
          const {order:{res}} =this.props;
          if(res.ret === 0) {
            dispatch({
              type: 'order/fetch',
            });
            message.success('已删除！')
          }
        }
      );
    } 

    changeStatus = (e, record) => {
      e.preventDefault()
      const { dispatch }=this.props;
      const { newStatus } = this.state;
      dispatch({
        type: 'order/change',
        payload: {id: record.id,new_status: newStatus}
      }).then(
        () => {
          dispatch({
            type: 'order/fetch',
          });
          message.success('修改成功！')
        }
      )
    }

    render() {
      const {
        Loading,
        order: { data },
        form: { getFieldDecorator }
      } = this.props;
     const { list } = data;
      for( let i = 0, l = list.length; i < l; i++) {
        if(list[i].account) {
          list[i].items.item_id= list[i].items.id;
          delete list[i].items.id;
          delete list[i].account.id;
          Object.assign(list[i], list[i].account)
          delete list[i].account;
        }
      }
     
      const {visible, current={}} = this.state
      const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
      const getModalContent = () => (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='联系电话' {...this.formLayout}>
            {getFieldDecorator('phone', {
              initialValue: current.phone,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label='备注' {...this.formLayout}>
            {getFieldDecorator('remark', {
              initialValue: current.remark,
            })(<Input.TextArea placeholder="请输入" autosize />)}
          </FormItem>
          
        </Form>
      )

      return (
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.cardList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <StandardTable
                loading={Loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
                scroll={{ x: 1300 }}
              />
            </div>
          </Card>
          <Modal
            title='修改信息'
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
  
  export default OrderListPage;