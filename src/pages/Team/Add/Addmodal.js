import React, { Component } from 'react';
import { Button, Modal, Avatar, Radio, List, Tag, Empty  } from 'antd';

import styles from './style.less';

const RadioGroup = Radio.Group;

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
      selectID: e.target.value
    })
  }

  handleNext = () => {
    const {handleAdd} = this.props;
    const { selectID } = this.state
    handleAdd(selectID)
  };

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
                <div style={{margin:"0 30px"}}><div>{item.game_role_name}</div><div>{item.far_name}</div></div>
                <div>{item.ptb.map((i,)=>(<Tag color="blue">{i}</Tag>))}</div>
              </List.Item>  
            </Radio>
          ))
        }  
      </RadioGroup>
    ):(<Empty description="已没有合适的账号" />)
    
  )
    

  renderFooter = () => {
    const { handleModalVisible, list} = this.props;
    return [
      <Button key="cancel" onClick={() => handleModalVisible(false)}>
        取消
      </Button>,
      list.length !== 0 ? 
      (
        <Button key="submit" type="primary" onClick={() => this.handleNext()}>
          完成
        </Button>
      ):(
        <Button key="cancel" type="primary" onClick={() => handleModalVisible(false)}>
          关闭
        </Button>
      )
       
      
      
    ];
  };


  render() {
    const { modalVisible, handleModalVisible, list } = this.props;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="添加"
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