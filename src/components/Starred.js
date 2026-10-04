import React from 'react';
import { PanelGroup, Panel } from 'react-bootstrap';

const PersonPanel = (props) => {
  return (
    <Panel eventKey={props.person.to_name}>
      <Panel.Heading>
        <Panel.Title toggle>{props.person.to_name}</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible>
      <ListGroup>
        {props.person.niceties.map(nicety => <ListGroupItem>nicety.text</ListGroupItem>)}
        </ListGroup>
      </Panel.Body>
    </Panel>
  )
}

class Starred extends React.Component {
  state = {
    niceties: []
  }

 loadAllNiceties = (callback) => {
    fetch(this.props.admin_edit_api, {
      headers: {
        'Content-Type': "application/json"
      },
      cache: 'no-cache',
    })
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((err) => console.log(err))
  }

  componentDidMount = () => {
    this.loadAllNiceties(data => this.setState({niceties: data}))
  }

  render() {
    return (
    <PanelGroup accordion id="starred-niceties">
      {this.state.niceties.map(person => <PersonPanel person={person} />)}
    </PanelGroup>
  )
}
}

export default Starred;
