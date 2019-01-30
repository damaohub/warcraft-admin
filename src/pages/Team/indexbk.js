import React, { PureComponent, Fragment } from 'react';


export default class TeamPage extends PureComponent {
    render() {
      const { chilren } = this.props
      return (
        <Fragment> 
          {chilren}
        </Fragment>  
      )
    }
}