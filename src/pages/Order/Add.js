import React, { Component } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  message
} from 'antd';

import { connect } from 'dva';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Item from './Item';
import styles from './style.less';



const { Option } = Select;
const { TextArea } = Input;
const itemsMap = [];

const fieldLabels = {
  account_name: '账号',
  account_pwd: '密码',
  child_name: '子账号',
  region_id: '服务器',
  game_role_name: '游戏角色',
  organization: '所属阵营',
  level: '角色等级',
  profession_id: '职业',
  talent_id: '可用天赋',
  need_talent_id: '拾取天赋',
  equip_level: '当前装等',
  remark: '备注',
  phone:'联系电话'
};

const itemLabels = {
  instance_or_secret: '项目类型',
  instance_id: '副本',
  difficult: '难度',
  num: '项目次数'
}
const item = {
  instance_or_secret: '1',
  instance_id: '',
  difficult: 'p',
  num: ''
}

@connect(({ loading, order, profession, talent }) => ({
  order,
  profession,
  talent,
  submitting: loading.effects['order/add'],
}))
@Form.create()
class AdvancedForm extends Component {
  state = {
    width: '100%',
    items: [{...item}],
  
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profession/fetch',
      payload: {pageSize: 10000}
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const 
    { 
      form: { validateFieldsAndScroll, resetFields },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const prjs = []
        // eslint-disable-next-line
        itemsMap.map((ele) => {
          const prj = Object.values(ele.onValidate())[0]
          if(prj.instance_or_secret) prjs.push(prj)
          if(prj.difficultLevel) {
            prj.difficult = prj.difficultLevel
          }
        })
        dispatch({
          type: 'order/add',
          payload: { account: values, proj: prjs }
        }).then(
          () => {
            this.setState({items: [{...item}]})
            const {order: {res}} =this.props
            if(res && res.ret === 0){
              message.success('操作成功' || res.msg);
              resetFields()
              router.push(`/order/list/detail?oid=${res.data}?from=add`);
            } else{
              message.error(res.msg)
            }
            
          }
        )
      }
    });
  };

 

  onRef = (ref) => {
    itemsMap.push(ref)
  }

  addItem = (e) => {
    e.preventDefault()
    const { items } = this.state
    items.push(item)
    this.setState({
      items
    })
  }


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

  render() {
    const {
      profession,
      talent,
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width, items } = this.state;
    const parentMethods = {
      onDel: this.deleItem,
      onChange: this.onItemChange
    }
    const professionList = profession.data.list
    const talentList = talent.data.list
    return (
      <PageHeaderWrapper
        wrapperClassName={styles.advancedForm}
      > 
        <Card title="账号信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.account_name}>
                  {getFieldDecorator('account_name', {
                    rules: [{ required: true, message: `请选择${fieldLabels.account_name}` }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
               
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.account_pwd}>
                  {getFieldDecorator('account_pwd', {
                    rules: [{ required: true, message: `请选择${fieldLabels.account_pwd}`  }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.child_name}>
                  {getFieldDecorator('child_name', {
                    rules: [{ required: true, message: `请选择${fieldLabels.child_name}`  }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.region_id}>
                  {getFieldDecorator('region_id', {
                    rules: [{ required: true, message: `请选择${fieldLabels.region_id}`  }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.game_role_name}>
                  {getFieldDecorator('game_role_name', {
                    rules: [{ required: true, message: `请选择${fieldLabels.game_role_name}`  }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.organization}>
                  {getFieldDecorator('organization', {
                    rules: [{ required: true, message: '请选择阵营' }],
                  })(
                    <Select placeholder="请选择阵营">
                      <Option value="0">联盟</Option>
                      <Option value="1">部落</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.level}>
                  {getFieldDecorator('level', {
                    rules: [{ required: true, message: `请选择${fieldLabels.level}`  }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
             
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.profession_id}>
                  {getFieldDecorator('profession_id', {
                    rules: [{ required: true, message: `请选择${fieldLabels.profession_id}` }],
                  })(
                    <Select placeholder={`请选择${fieldLabels.profession_id}`} style={{ width: '100%' }} onSelect={(value) => {this.selectHandel(value)}}>
                      {professionList.map( i => (<Option key={i.id}>{i.profession_name}</Option>))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.talent_id}>
                  {getFieldDecorator('talent_id', {
                    rules: [{ required: true, message: `请选择${fieldLabels.talent_id}` }],
                  })(
                    <Select mode="multiple" placeholder={`请选择${fieldLabels.talent_id}`}>
                      {talentList.map( i => (<Option key={i.id}>{i.talent_name}</Option>))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.need_talent_id}>
                  {getFieldDecorator('need_talent_id', {
                    rules: [{ required: true, message: `请选择${fieldLabels.need_talent_id}` }],
                  })(
                    <Select placeholder={`请选择${fieldLabels.need_talent_id}`} style={{ width: '100%' }}>
                      {talentList.map( i => (<Option key={i.id}>{i.talent_name}</Option>))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.equip_level}>
                  {getFieldDecorator('equip_level', {
                    rules: [{ required: true, message: `请输入${fieldLabels.equip_level}` }],
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
                
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.phone}>
                  {getFieldDecorator('phone', {
                    
                  })(
                    <Input
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
                
              </Col>
            </Row>
            <Row gutter={16}>
              <Col sm={24}>
                <Form.Item label={fieldLabels.remark}>
                  {getFieldDecorator('remark', {
                      rules: [{ required: false, message: `请输入${fieldLabels.remark}` }],
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder={`请输入${fieldLabels.remark}`}
                        rows={4}
                      />
                    )}
                </Form.Item>
              </Col>  
            </Row>
          </Form>
        </Card>
        {
          items.map((ele,index) => (
            <Item onRef={this.onRef} key={`${index+1}`} elemt={ele} id={index} labels={itemLabels} {...parentMethods} />
          )
          )
        }
        <Button
          type="dashed"
          style={{ width: '100%', height: 50, marginBottom: 8,  marginTop: -5 }}
          icon="plus"
          onClick={this.addItem}
        >
          添加项目
        </Button>

        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" size="large" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
