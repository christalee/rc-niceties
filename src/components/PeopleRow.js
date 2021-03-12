import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Person from './Person';

const PeopleRow = React.createClass({
  render: function() {
    return (<Row>
      {
        this.props.data.map(function(result) {
          return (<Col lg="3" md="6" sm="6" xs="12">
            <Person fromMe={this.props.fromMe} data={result} saveReady={this.props.saveReady} updated_niceties={this.props.updated_niceties}/>
          </Col>);
        }.bind(this))
      }
    </Row>);
  }
});

export default PeopleRow;
