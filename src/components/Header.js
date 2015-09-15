import React from "react";
import Dashboard from "../lib/Dashboard";
import cx from "classnames";

export default React.createClass({
    displayName: "Header",
    propTypes: {
        branding: React.PropTypes.object.isRequired,
        boards: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Dashboard)).isRequired,
        current: React.PropTypes.number.isRequired,
        onChangeBoard: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return { dropdownOpen: false };
    },
    toggleDropdown() {
        if (!this.state.dropdownOpen) {
            this.setState({ dropdownOpen: true }, () => {
                //bind the window to close.
                console.log("dropdownOpen");
                const toggle = () => {
                    console.log("dropdownClose");
                    window.removeEventListener("click", toggle);
                    this.setState({ dropdownOpen: false });
                };
                process.nextTick(() => window.addEventListener("click", toggle));
            });
        }
    },
    render() {
        const allDashboards = this.props.boards
            //map to an object with the original index and title, if data exists
            .map((board, index) => board.boardData.when({
                ok: data => ({index: index, title: data.Title }),
                error: err => ({ index: index, title: <span className="text-danger"><span className="glyphicon glyphicon-exclamation-sign" />{` Failed to load board ${index+1}`}</span> })
            }))

        //remove the current from the list of all
        const currentDashBoard = allDashboards.splice(this.props.current, 1)[0];

        //others is this list filtered for loading items.
        const otherDashboards = allDashboards.filter(data => data);

        let currentTitleAndOtherDropdown;
        if (otherDashboards.length) {
            currentTitleAndOtherDropdown = <li className={cx({ "btn-group": true, "open": this.state.dropdownOpen })}>
                <button className="btn btn-default navbar-btn dropdown-toggle" onClick={this.toggleDropdown} role="button" aria-haspopup="true" aria-expanded="true">
                    {currentDashBoard.title}
                    {" "}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" style={{ marginTop: -10 }}>
                    {otherDashboards.map(data => <li key={`dash-${data.index}`}>
                        <a href="#" onClick={ev => {
                            console.log(ev);
                            this.props.onChangeBoard(data.index);
                        }}>{data.title}</a>
                    </li>)}
                </ul>
            </li>;
        } else {
            currentTitleAndOtherDropdown = <li className="navbar-text">{currentDashboard.title}</li>;
        }

        let logo;
        if (this.props.branding.Logo) {
            //funky inline styles match the correct height image, works best if square-ish and 32px high.
            logo = <img style={{ marginTop: -5, marginRight: 10, display: "inline-block", height: 32 }} src={this.props.branding.Logo} />;
        }

        return <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href={this.props.branding.Url}>
                        {logo}
                        {this.props.branding.Text}
                    </a>
                    <div className="navbar-text"><small>powered by <a href="https://github.com/thechriswalker/walkerboard">WalkerBoard</a></small></div>
                </div>
                <ul className="nav navbar-nav navbar-right">
                    {currentTitleAndOtherDropdown}
                    <li className="btn-group" style={{ marginLeft: 16, marginRight: 16 }}>
                        <button className="btn btn-primary navbar-btn">
                            <span className="glyphicon glyphicon-folder-open" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>;
    }
});
