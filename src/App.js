import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Button, Grid, Row, Col, Image, Nav, NavItem } from 'react-bootstrap';
import ReactDOM, { findDOMNode } from 'react-dom';
import React, { Component } from 'react';

import Remarkable from 'remarkable';
import logo from './logo.svg';
import octotie from './octotie.png'

import $ from 'jquery';

var updated_niceties_spinlock = false;
var updated_niceties = new Set();
const components = { People, NicetyDisplay, NicetyPrint}

var People = React.createClass({
    saveAllComments: function() {
        updated_niceties_spinlock = true;
        var data_to_save = [];
        console.log(updated_niceties);
        updated_niceties.forEach(function(e) {
            var split_e = e.split(",");
            data_to_save.push(
                {
                    target_id: parseInt(split_e[0], 10),
                    end_date: split_e[1],
                    anonymous: true,                      // TODO: fix anonymous
                    text: localStorage.getItem("nicety-" + split_e[0]),
                }
            );
        })
        updated_niceties.clear();
        updated_niceties_spinlock = false;
        $.ajax({
            url: this.props.post_nicety_api,
            data: {'niceties': JSON.stringify(data_to_save)},
            dataType: 'json',
            type: 'POST',
            cache: false,
            success: function(data) {
                console.log('sucessful post');
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                for (var i=0; i<data_to_save.length; i++){
                    updated_niceties.add(data_to_save[i].target_id + "," + data_to_save[i].end_date);
                }
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {
            data: []
        };
    },

    generateRows: function() {
        let dataList = [];
        for (let i = 0; i < this.props.people.length; i +=4) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                if ((i + j) < this.props.people.length) {
                    row.push(this.props.people[i + j]);
                }
            }
            dataList.push(row);
        }
        return dataList;
    },

    render: function() {
        let list = this.generateRows();
        return (
            <div className="people">
            <div id="save_button">
              <SaveButton
                 disabled={false}
                 onclick={this.saveAllComments}>
                 Save
                 </SaveButton>
            </div>
              <Grid>
                {list.map(function(row) {
                    return (
                        <PeopleRow data={row}/>
                    );
                })}
            </Grid>
                </div>
        );}
});

var SaveButton = React.createClass({
    render: function() {
        if (this.props.disabled) {
            return (
                <div className="button">
                  <Button
                  bsStyle="primary"
                 bsSize="large"
                 disabled="disabled"
                 >Save</Button>
                </div>
            );
        } else {
            return (
                <div className="button">
                  <Button
                  bsStyle="primary"
                 bsSize="large"
                 onClick={this.props.onclick}>Save</Button>
                </div>
            );
        }
    }
});

var PeopleRow = React.createClass({
    render: function() {
        return (
            <Row>
              {this.props.data
                  .map(function(result) {
                      return (<Col lg ="3" md="4" sm="6" xs="12">
                              <Person data={result}/>
                              </Col>);
                  })}
            </Row>
        );
    }
});

var Person = React.createClass({

    getInitialState: function() {
        return {value: localStorage.getItem("nicety-" + this.props.data.id)};
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
        localStorage.setItem("nicety-" + this.props.data.id, event.target.value);
        while (updated_niceties_spinlock) {}
        updated_niceties.add(this.props.data.id + "," + this.props.data.end_date);
    },

    // TODO: button for each person for anonymous option

    componentDidMount: function() {
        // setInterval(this.autosave, this.props.autosaveInterval);
    },

    // hold a callback in the parent and pass it to the child as a prop that gets called in onChange
    // this callback would have the parent update its own min/max rows and pass this to all children
    // but it seems like for this to work you need child.state.height (to figureo ut the new min rows)

    render: function() {
        return (
            <div className="person">
                <Image responsive={true} src={this.props.data.avatar_url} circle={true} />
                <p>{this.props.data.name}</p>
              <textarea
                defaultValue={this.state.value}
                onChange={this.handleChange}
                rows="6"
                 placeholder={this.props.data.placeholder}
                />
            </div>
        );
    }
});

var NicetyPrint = React.createClass({
    render: function() {
        return (
            <div>
              {
                this.props.data.filter((val, index, arr) => {
                    return arr.indexOf(val) === index;
                }).forEach((recurser) => {

                })
              }
            </div>
        );
    }
});

var NicetyRow = React.createClass({
    render: function() {
        return (
            <Row>
              {this.props.data
                  .map(function(result) {
                      return (<Col lg ="3" md="4" sm="6" xs="12">
                              <Nicety data={result}/>
                              </Col>);
                  })}
            </Row>
        );
    }
});

var NicetyDisplay = React.createClass({

    getInitialState: function() {
        return {
            niceties: []
        };
    },

    // componentDidMount: function() {
    //     this.loadNicetiesFromServer();
    // },

    generateRows: function() {
        let dataList = [];
        for (let i = 0; i < this.props.niceties.length; i +=4) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                if ((i + j) < this.props.niceties.length) {
                    row.push(this.props.niceties[i + j]);
                }
            }
            dataList.push(row);
        }
        return dataList;
    },

    render: function() {
        let list = this.generateRows();
        return (
            <div className="niceties">
              <Grid>
                {list.map(function(row) {
                    return (
                        <NicetyRow data={row}/>
                    );
                })}
            </Grid>
                </div>
        );}
});

var Nicety = React.createClass({
    render: function() {
        return (
            <div className="nicety">
                <Image responsive={true} src={this.props.data.avatar_url} circle={true} />
                <p>{this.props.data.name}</p>
                <textarea
                    defaultValue={this.props.data.text}
                    disable
                />
            </div>
        );
    }
})

var App = React.createClass({
    loadPeopleFromServer: function() {
        $.ajax({
            url: this.props.people_api,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({people: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.people, status, err.toString());
            }.bind(this)
        });
    },
    loadNicetiesFromServer: function() {
        $.ajax({
            url: this.props.get_nicety_api,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({niceties: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.niceties, status, err.toString());
            }.bind(this)
        });
    },
     loadPrintFromServer: function() {
        $.ajax({
            url: this.props.print_nicety_api,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({printNiceties: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.printNiceties, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {
                people: [],
                niceties: [],
                currentview: "write-niceties"};
    },
    componentDidMount: function() {
        this.loadPeopleFromServer();
        this.loadNicetiesFromServer();
    },
    handleSelect: function(eventKey) {
        this.setState({currentview: eventKey});
        console.log(eventKey);
    },
    selectComponent: function(idx) {
        switch(idx) {
        case "print-niceties":
            return <NicetyPrint get_nicety_api={this.props.get_nicety_api} />;
        case "write-niceties":
            return <People people={this.state.people}
                           post_nicety_api={this.props.post_nicety_api} />;
        case "view-niceties":
            return <NicetyDisplay niceties={this.state.niceties}
                                  get_nicety_api={this.props.get_nicety_api} />;
        default:
        };
    },
    render: function() {
        let selectedComponent = this.selectComponent(this.state.currentview);
        //console.log(selectedComponent);
        //console.log(<NavItem eventKey="write-niceties">Write niceties!</NavItem>);
        return (
            <div className="App">
            <div id="logo">
                <img id="octotie" src={octotie} height="175"/>
            </div>
              <Nav bsStyle="tabs" activeKey={this.state.currentview} onSelect={this.handleSelect}>
                <NavItem eventKey="write-niceties">Write niceties!</NavItem>
                <NavItem eventKey="view-niceties">See your niceties!</NavItem>
                <NavItem eventKey="print-niceties">For Rachel! Print our niceties!</NavItem>
              </Nav>

              {selectedComponent}
            </div>
        );
    }
});

export default App;
