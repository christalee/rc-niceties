import React from 'react';
import { Table, Form, FormControl, FormGroup, ControlLabel, Button, Col } from 'react-bootstrap';

const Settings = () => {
  return (
    <div className="settings">
    <h3>Niceties close at $TIME</h3>
    <h4>Niceties are open for:</h4>
    <Table striped bordered condensed responsive>
    <thead>
    <tr>
      <th>Name</th>
      <th className="fitwidth">Due Date</th>
      <th className="fitwidth">Total</th>
      <th className="fitwidth">Approved</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>Test User</td>
      <td><FormControl type="date" bsSize="sm"/></td>
      <td>6</td>
      <td>4</td>
    </tr>
    <tr>
      <td>Test User</td>
      <td><FormControl type="date" bsSize="sm"/></td>
      <td>6</td>
      <td>4</td>
    </tr>
    <tr>
      <td>Test User</td>
      <td><FormControl type="date" bsSize="sm"/></td>
      <td>6</td>
      <td>4</td>
    </tr>
    <tr>
      <td>Alicia Thilani Singham Goodwin</td>
      <td><FormControl type="date" bsSize="sm"/></td>
      <td>6</td>
      <td>4</td>
    </tr>
    <tr>
      <td>Test User With a very long name</td>
      <td><FormControl type="date" bsSize="sm"/></td>
      <td>6</td>
      <td>4</td>
    </tr>
    </tbody>
    </Table>


    <Form horizontal>
    <FormGroup controlId="enterById" validationState={'success'}>
      <Col componentClass={ControlLabel} sm={4}>Add users by ID</Col>
      <Col sm={4}>
        <FormControl type="text" placeholder="Enter user ID" />
        <FormControl.Feedback />
      </Col>
      <Col sm={2}>
        <Button type="submit">Add User</Button>
      </Col>
    </FormGroup>
    </Form>


    <h4><a href="niceties-by-sender">View Niceties by Sender</a></h4>
    <h4><a href="print-niceties">Printable Niceties</a></h4>
    </div>
  )
}

export default Settings;
