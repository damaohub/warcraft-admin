import React, { Component, Fragment } from 'react';
import { Button, Modal, Avatar, Radio, List, Tag, Empty, Input  } from 'antd';

import styles from './style.less';

const RadioGroup = Radio.Group;
const { Search } = Input;

class Addmodal extends Component {
  static defaultProps = {
    handleAdd: () => {},
    handleModalVisible: () => {},
    list: [],
  };

  constructor(props) {
    super(props);

    this.state = {
    };

  }

  radioChange= (e) => {
    e.preventDefault()
    this.setState({
      selectItem: e.target.value
    })
  }

  handleNext = () => {
    const {handleAdd} = this.props;
    const { selectItem } = this.state
    handleAdd(selectItem)
  };

  handleVisible = () => {
    const {handleModalVisible} = this.props;
    this.setState({
      selectItem: undefined
    })
    handleModalVisible(false)
  }

  renderContent = (data) => (
    data.length !== 0? 
    (
      <RadioGroup onChange={e=>{this.radioChange(e)}} className={styles.modalList}>
        {
          data.map( (item) => (
            
            <Radio value={item} key={item.aid}>
              <List.Item key={item.aid}>
                <List.Item.Meta
                  avatar={<Avatar src={item.profession_img} />}
                  title={item.account_name}
                  description={item.child_name}
                />
                <div style={{margin:"0 30px"}}><div title="角色名">{item.game_role_name}</div><div>{item.far_name}</div></div>
                <div style={{display:"flex", flexWrap:'wrap'}}>{item.ptb.map((i,)=>(<Tag color="blue">{i}</Tag>))}</div>
              </List.Item>  
            </Radio>
          ))
        }  
      </RadioGroup>
    ):(<Empty description="已没有合适的账号" />)
    
  )
    

  renderFooter = () => {
    const { list} = this.props;
    return [
      <Button key="cancel" onClick={() => this.handleVisible(false)}>
        取消
      </Button>,
      list.length !== 0 ? 
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


  render() {
    const { modalVisible, handleModalVisible, list } = this.props;
    return (
      <Modal
        width={680}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={
          <Fragment>
            <span>添加账号</span> 
            <Search
              placeholder="输入查找账号"
              onSearch={value => console.log(value)}
              enterButton
              style={{ width: '340px', marginLeft: '80px' }}
            />
          </Fragment>}
        visible={modalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        {this.renderContent(list)}
      </Modal>
    );
  }
}


export default Addmodal;