import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
// import Link from 'umi/link';
import { Row, Col, Card, List, Avatar, Empty  } from 'antd';

import { Radar } from '@/components/Charts';
// import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';

// const links = [
//   {
//     title: '操作一',
//     href: '',
//   },
//   {
//     title: '操作二',
//     href: '',
//   },
//   {
//     title: '操作三',
//     href: '',
//   },
//   {
//     title: '操作四',
//     href: '',
//   },
//   {
//     title: '操作五',
//     href: '',
//   },
//   {
//     title: '操作六',
//     href: '',
//   },
// ];

@connect(({ user, player, activities, chart, loading }) => ({
  currentUser: user.currentUser,
  player,
  activities,
  chart,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  taskLoading: loading.effects['player/task'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'player/task',
    });
  

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const {
      activities: { list },
    } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  render() {
    const {
      currentUser,
      currentUserLoading,
      player: { task },
      taskLoading,
    } = this.props;
    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              您好，
              {currentUser.real_name}
              ，祝你开心每一天！
            </div>
            <div>
              {currentUser.role_name} |{currentUser.status}
            </div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>项目数</p>
          <p>{task.my_team && task.my_team.length}</p>
        </div>
        {/* <div className={styles.statItem}>
          <p>排名</p>
          <p>
            
            8<span> / 24</span>
          </p>
        </div> */}
        {/* <div className={styles.statItem}>
          <p>项目访问</p>
          <p>2,223</p>
        </div> */}
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="我的任务"
              bordered={false}
              // extra={<Link to="/">全部项目</Link>}
              loading={taskLoading}
              bodyStyle={{ padding: 0 }}
            >
              {task.my_team && task.my_team.length !== 0 ? task.my_team.map(item => (
                item? 
                  <Card.Grid className={styles.projectGrid} key={item.id}>
                    <Card bordered={false} title={`团号：${item.tid}`} extra={<a href={`#/dashboard/player-team?id=${item.tid}`}>操作</a>}>
                      <Card.Meta />
                      <div>人数：{item.mem_num}</div>
                      <div>副本： {item.instance_name}</div>
                      <div>开团时间： {item.reserve_time}</div>         
                      <div className={styles.projectItemContent}>
                        {/* <a title={`创建人:${item.create_id}`}>{item.create_id}</a> */}
                        {item.reserve_time && (
                          <span className={styles.datetime} title={`创建时间:${item.create_time}`}>
                            {moment(item.create_time).fromNow()}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Card.Grid>: <Empty />
              )):  <Empty />
            }
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="动态"
              loading={{}}
            >
              <List loading={{}} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            {/* <Card
              style={{ marginBottom: 24 }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
            </Card> */}
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="XX 指数"
              // loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={{}} />
              </div>
            </Card>
            {/* <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="团队"
              loading={taskLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {notice.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card> */}
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
