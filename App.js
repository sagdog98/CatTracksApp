import './App.css'

import React, { Component } from 'react'
import Navbar from './components/Navbar'
import Map from './components/Map'
import BusLineCellContainer from './components/BusLineCellContainer'
import BusLineName from './components/BusLineName'
import MoreInfoWindow from './components/MoreInfoWindow'
import { CalculateTimeLeftOfLineObject } from './components/CalculateTimeLeft'
import Notifications from './components/Notifications'
import Menu from './components/Menu'
import moment from 'moment'
import stops from './stops-data'
import ReactGA from 'react-ga'

export default class App extends Component {
  state = {
    showMoreInfo: false,
    closestStop: stops[0],
    clickedLine: {},
    clickedLineColor: "orange",
    timePassed: 0,
    showShade: false,
    showMenu: false,
    showSpecialThanks: false,
  }
  componentDidMount = () => {
    this.timer = setInterval(this.tick, 61000);
    ReactGA.initialize('UA-119572594-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  componentWillUnmount = () => {
    clearInterval(this.timer)
  }
  tick = () => {
    this.setState({ timePassed: this.state.timePassed + 1 })
  }
  resetTimePassed = () => {
    this.setState({ timePassed: 0 })
  }
  closeMoreInfoWindow = () => {
    this.setState({ showMoreInfo: false });
  }
  showMoreInfoWindow = () => {
    this.setState({ showMoreInfo: true })
  }

  updateNearestStop = (nearestStop) => {
    if (this.state.closestStop.id !== nearestStop.id) {
      this.resetTimePassed();
      this.closeMoreInfoWindow();
      this.setState({ closestStop: nearestStop })
    }
  }
  updateClickedLine = (lineObj, color) => {
    this.setState({ clickedLine: lineObj, clickedLineColor: color })
  }
  showMenu = () => {
    this.setState({ showMenu: true, showShade: true })
  }
  showSpecialThanks = () => {
    this.setState({ showSpecialThanks: true, showShade: true })
  }
  toggleMenu = (e) => {
    this.setState({ showMenu: !this.state.showMenu })
  }
  toggleSpecialThanks = (e) => {
    this.setState({ showSpecialThanks: !this.state.showSpecialThanks })
  }
  toggleShade = (e) => {
    this.setState({ showShade: !this.state.showShade })
  }
  closeModal = (e) => {
    this.toggleShade();
    if (this.state.showMenu) {
      this.toggleMenu();
    } else {
      this.toggleSpecialThanks();
    }
  }

  render() {
    const now = moment();
    const dayNum = now.isoWeekday();
    const lines = this.state.closestStop.lines
      .filter(line => {
        switch (line.lineName) {
          case "AB":
          case "C1G":
          case "C1B":
          case "C2":
          case "FastCat":
          case "G":
          case "HeritageExpressWeekdays":
            // Weekdays
            if (dayNum >= 1 && dayNum <= 5) {
              return true;
            }
            break;
          case "E1":
          case "E2":
          case "HeritageExpressWeekends":
            // Weekends
            if (dayNum >= 6 && dayNum <= 7) {
              return true
            }
            break;
          default:
            return false;
        }
      })
      .map((line) => CalculateTimeLeftOfLineObject(line))
    return (
      <div className="app">
        <Map stops={stops}
          updateNearestStop={this.updateNearestStop} />
        <Navbar toggleMenu={this.showMenu} toggleSpecialThanks={this.showSpecialThanks} />
        <BusLineName stopName={this.state.closestStop.name} />
        <BusLineCellContainer
          show={this.showMoreInfoWindow}
          doShowInfoWindow={this.state.showMoreInfo}
          closestStopToCenter={this.state.closestStop}
          lines={lines}
          updateClickedLine={this.updateClickedLine}
          timePassed={this.state.timePassed}
        />
        <MoreInfoWindow
          doShowInfoWindow={this.state.showMoreInfo}
          close={this.closeMoreInfoWindow}
          closestStopToCenter={this.state.closestStop}
          line={this.state.clickedLine}
          timePassed={this.state.timePassed}
          color={this.state.clickedLineColor}
        />
        <div id="centerPoint">
          <img src={require('./location-point.png')} />
        </div>
        {(this.state.showShade)
          ? <div className="shade" onClick={this.closeModal}></div>
          : null}
        {this.state.showMenu
          ? <Menu />
          : null}
        {this.state.showSpecialThanks
          ? <Notifications />
          : null}
      </div>)
  }
}
