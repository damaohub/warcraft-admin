import React, { Component, Fragment } from 'react';
import { Button, Modal, Empty, Input, Form, Divider, Tooltip, Tag, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

// const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const typeMaps = {"0":'工作室账号',"1":"客户账号", "2": "借用账号"}
const typeTag = {"0":'工',"1":"客", "2": "借"}
const typeTagColor = {"0":'blue',"1":"green", "2": "orange"}
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading }) => ({
  Loading: loading.models.team,
}))
@Form.create()
class Addmodal extends Component {
  static defaultProps = {
    handleAdd: () => {},
    handleModalVisible: () => {},
    handleSearch: () => {},
    data: {},
  };

  columns = [
    {
      title:<div style={{textAlign: 'center',margin: '0 auto'}}>账号</div>,
      dataIndex: 'account_name',
      key: 'account_name',
      align: 'left',
      width: 160,
      fixed: 'left',
      render: (item,record) => (
        <Fragment>
          <Tooltip
            placement="topLeft" 
            title={typeMaps[record.type]}
          >
            <Tag style={{display: "inline"}} color={typeTagColor[record.type]}>{typeTag[record.type]}</Tag>
          </Tooltip>
          <Tooltip 
            placement="right" 
            title={
              <div style={{display:"flex",flexDirection:"column"}}>
                <div>密码：{record.account_pwd}</div>
               
                <div>子账号：{record.child_name}</div>
              
              </div>     
              }
          >
            {item}
          </Tooltip>
        </Fragment>
        
      )
    },
    {
      title: '服务器',
      dataIndex: 'region_id',
      key: 'region_id',
      align: 'center',
      width: 120,
    },
  
    {
      title: '游戏角色',
      dataIndex: 'game_role_name',
      key: 'game_role_name',
      align: 'center',
      width: 120,
    },
    {
      title: '所属阵营',
      dataIndex: 'organization',
      key: 'organization',
      align: 'center',
      width: 100,
      render: (item) => (
        item ==='0'? '联盟': '部落'
      )
    },
    {
      title: '角色等级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: 100,
    },
    {
      title: '职业',
      dataIndex: 'profession_name',
      key: 'profession_name',
      align: 'center',
      width: 100,
    },
    {
      title: '可用天赋',
      dataIndex: 'talent',
      key: 'talent',
      align: 'center',
      width: 100,
      render: text => (
        <span>
          {text.map((talent,ids) => 
            <Fragment>
              <span color="blue" key={`${ids+1}`}>{talent}</span> { ids !== text.length-1 && <Divider type="vertical" style={{margin: '0 2px'}} />}
            </Fragment>)
          }
        </span>
      )
    },
    
    {
      title: '装备等级',
      dataIndex: 'equip_level',
      key: 'equip_level',
      align: 'center',
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'account_phone',
      key: 'account_phone',
      align: 'center',
    },
   
  ];

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: []
    };

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

  handleNext = () => {
    const {handleAdd, form} = this.props;
    const {selectedRowKeys, selectedRows } = this.state
    form.resetFields()
    handleAdd(selectedRowKeys, selectedRows)
  };

  handleVisible = () => {
    const {handleModalVisible, form} = this.props;
    this.setState({
      selectedRowKeys: [],
    })
    form.resetFields()
    handleModalVisible(false)
  } 

  renderFooter = () => {
    const { data: {list}} = this.props;
    return [
      <Button key="cancel" onClick={() => this.handleVisible(false)}>
        取消
      </Button>,
      list && list.length !== 0 ? 
      (
        <Button key="submit" type="primary" onClick={() => this.handleNext()}>
          添加
        </Button>
      ):(
        <Button key="cancel" type="primary" onClick={() => this.handleVisible(false)}>
          关闭
        </Button>
      )

    ];
  };

  // selectRow = (record) => {
  //   const { selectedRowKeys, selectedRows } = this.state;
   
  //   if (selectedRowKeys.indexOf(record.aid) >= 0) {
  //     selectedRowKeys.splice(selectedRowKeys.indexOf(record.aid), 1);
     
  //   } else {
  //     selectedRowKeys.push(record.aid);
  //   }
  //   this.setState({ selectedRowKeys, selectedRows });
  
  // }

  onSelectedRowKeysChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows});
  }
  
  goSearch = e => {
    e.preventDefault();
    const { form, handleSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        selectedRowKeys: [],
      })
     handleSearch(fieldsValue, false,)
   
    });
  };

  handleFormReset = () => {
    const { form ,handleSearch} = this.props;
    form.resetFields();
    handleSearch({type:"0", battle_site: 't'})
  };

  changeType = value => {
    const { handleSearch, form } = this.props;
    this.setState({
      selectedRowKeys: [],
    })
    const battle =  form.getFieldValue('f_battle_site')
    handleSearch({type: value, f_battle_site: battle})
  }

  changeBattle = value => {
    const { handleSearch, form } = this.props;
    this.setState({
      selectedRowKeys: [],
    })
    const type =  form.getFieldValue('type')
    handleSearch({f_battle_site: value, type})
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      battleSite,
    } = this.props;
    return (
      
      <Form onSubmit={this.goleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="账户类型">
              {getFieldDecorator('type', { initialValue:"0", rules: [ {required: true, message: '必选类型'}], })(
                <Select placeholder="请选择" style={{ width: '100%' }} onSelect={this.changeType}>
                  <Option value="0">客户账号</Option>
                  <Option value="1">非客户账号</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('f_account_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('f_game_role_name')(<Input placeholder="请输入" />)}
            </FormItem>
        
          </Col>
        </Row>
        { battleSite &&
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="位置">
                {getFieldDecorator('f_battle_site',{ initialValue: 't', rules: [ {required: true, message: '必选类型'}]})(
                  <Select placeholder="请选择" style={{ width: '100%' }} onSelect={this.changeBattle}>
                    <Option value="t">坦克</Option>
                    <Option value="n">治疗</Option>
                    <Option value="d">输出</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        }
        
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" onClick={this.goSearch} htmlType="submit">
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
    const {Loading, modalVisible, handleModalVisible, data } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    }
    return (
      <Modal
        width={1000}
        bodyStyle={{ padding: '10px 15px 0px' }}
        destroyOnClose
        visible={modalVisible}
        title="选择账号"
        footer={this.renderFooter()}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
  
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          {data.list && data.list.length !== 0? 
            <StandardTable
              loading={Loading}
              data={data}
              scroll={{ x: 800 }} 
              columns={this.columns}
              rowKey="aid"
              size="small"
              rowSelection={rowSelection}
              // onRow={(record) => ({
              //   onClick: () => {
              //     this.selectRow(record);
              //   },
              // })}
              onChange={this.handleStandardTableChange}
            />:(<Empty description="已没有合适的账号" />)}
        </div>
          
        
      </Modal>
      );
  }
}


export default Addmodal;