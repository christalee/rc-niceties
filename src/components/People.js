import React from 'react';
import { Modal, Grid } from 'react-bootstrap';
import $ from 'jquery';
import store from 'store2';

import PeopleRow from './PeopleRow';
import SaveButton from './SaveButton';


const People = React.createClass({
  saveAllComments: function() {
    this.state.updated_niceties_spinlock = true;
    let data_to_save = [];
    const dateUpdated = new Date(Date.now());
    const dateUpdatedStr = dateUpdated.toUTCString();
    this.state.updated_niceties.forEach(function(e) {
      let [user_id, end_date] = e.split(",")
      let anonymous;
      if (store.get("anonymous-" + user_id) === "undefined" || store.get("anonymous-" + user_id) === null) {
        anonymous = false;
      } else {
        anonymous = store.get("anonymous-" + user_id);
      }
      let text;
      if (store.get("nicety-" + user_id) === "undefined" || store.get("nicety-" + user_id) === null) {
        text = '';
      } else {
        text = store.get("nicety-" + user_id);
      }
      let noRead;
      if (store.get("no_read-" + user_id) === "undefined" || store.get("no_read-" + user_id) === null) {
        noRead = false;
      } else {
        noRead = store.get("no_read-" + user_id);
      }
      data_to_save.push({
        target_id: parseInt(user_id, 10),
        end_date: end_date,
        anonymous: anonymous,
        text: text,
        no_read: noRead,
        date_updated: dateUpdatedStr
      });
    });
    this.state.updated_niceties_spinlock = false;
    $.ajax({
      url: this.props.save_nicety_api,
      data: {
        'niceties': JSON.stringify(data_to_save)
      },
      dataType: 'json',
      type: 'POST',
      cache: false,
      success: function() {
        this.setState({noSave: true});
        this.setState({justSaved: true});
        store.set("saved", true);
        this.state.updated_niceties.forEach(function(e) {
          store.set("date_updated-" + e[0], dateUpdatedStr);
        });
        this.state.updated_niceties.clear();
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err)
      }
    });
  },

  getInitialState: function() {
    if (store.get("saved") === true) {
      return {data: [], noSave: true, justSaved: false, updated_niceties: new Set(), updated_niceties_spinlock: false}
    } else if (store.get("saved") === false) {
      return {data: [], noSave: false, justSaved: false, updated_niceties: new Set(), updated_niceties_spinlock: false}
    }
  },

  generateRows: function(inputArray) {
    let dataList = [];
    if (inputArray !== undefined) {
      for (let i = 0; i < inputArray.length; i += 4) {
        let row = [];
        for (let j = 0; j < 4; j++) {
          if ((i + j) < inputArray.length) {
            row.push(inputArray[i + j]);
          }
        }
        dataList.push(row);
      }
    }
    return dataList;
  },

  saveReady: function() {
    this.setState({noSave: false});
  },

  alertTimer: function() {
    setTimeout(function() {
      this.setState({justSaved: false});
    }.bind(this), 3000);
  },

  render: function() {
    let leaving = this.generateRows(this.props.people.leaving);
    let staying = this.generateRows(this.props.people.staying);
    // let special = this.generateRows(this.props.people.special);
    let faculty = this.generateRows(this.props.people.faculty);
    const savePass = this.saveReady.bind(this);

    let maybeHeader = '';
    let maybeHR = '';
    if (staying.length > 0) {
      maybeHeader = (<h3>In-Batch</h3>);
      maybeHR = (<hr/>);
    }
    if (this.state.justSaved) {
      this.alertTimer();
    }

    let staffHeader;
    let staffRows;
    // staffRows = special.map(function(row) {
    //     return (
    //         <PeopleRow fromMe={this.props.fromMe} data={row} saveReady={savePass}/>
    //     );
    // }.bind(this))
    staffRows = faculty.map(function(row) {
      return (<PeopleRow fromMe={this.props.fromMe} data={row} saveReady={savePass} updated_niceties={this.state.updated_niceties} spinlock={this.state.updated_niceties_spinlock}/>);
    }.bind(this))

    staffHeader = (<h3>Staff</h3>);
    return (<div className="people">
      <Modal show={this.state.justSaved}>
        <Modal.Body>
          Niceties Saved!
        </Modal.Body>
      </Modal>
      <div className="save_button">
        <SaveButton noSave={this.state.noSave} onClick={this.saveAllComments}>
          Save
        </SaveButton>
      </div>
      <Grid>
        <hr/>
        <h3>Leaving Soon</h3>
        {
          leaving.map(function(row) {
            return (<PeopleRow fromMe={this.props.fromMe} data={row} saveReady={savePass} updated_niceties={this.state.updated_niceties} spinlock={this.state.updated_niceties_spinlock}/>);
          }.bind(this))
        }
        <hr/> {maybeHeader}
        {
          staying.map(function(row) {
            return (<PeopleRow fromMe={this.props.fromMe} data={row} saveReady={savePass} updated_niceties={this.state.updated_niceties} spinlock={this.state.updated_niceties_spinlock}/>);
          }.bind(this))
        }
        {maybeHR}
        {staffHeader}
        {staffRows}
        <hr/>
      </Grid>
      <div className="save_button">
        <SaveButton noSave={this.state.noSave} onClick={this.saveAllComments}>
          Save
        </SaveButton>
      </div>
    </div>);
  }
});

export default People;
