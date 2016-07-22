import React from 'react';
import ReactDOM from 'react-dom';

var State = {
    Open: 0,
    Walking: 1,
    Boundary: 2
};

export var Map = React.createClass({
    getInitialState() {
        var maxWidth = 800;
        var maxHeight = 600;
        // Get as close to max as possible.
        var widthRatio = this.props.width / maxWidth;
        var heightRatio = this.props.height / maxHeight;
        var width = 0;
        var height = 0;
        if (widthRatio > heightRatio) {
            width = maxWidth;
            height = this.props.height / widthRatio;
        } else {
            height = maxHeight;
            width = this.props.width / heightRatio;
        }
        return {
            width: this.props.width,
            height: this.props.height,
            stretchedWidth: width,
            stretchedHeight: height,
            user: this.props.user
        }
    },

    componentDidMount() {
        var canvas = <canvas id="map-canvas"
                             style={{
                                width: this.state.stretchedWidth,
                                height: this.state.stretchedHeight
                             }}
                             width={this.state.width}
                             height={this.state.height}
                             onMouseMove={this.mapMouseMoved}
                             onClick={this.mapClicked}/>;

        ReactDOM.render(canvas, document.getElementById('map-canvas-container'));
        this.renderCanvas();
    },

    render() {
        this.renderCanvas();

        return (
            <div id="map-container" style={{
                width: this.state.stretchedWidth + 10 + 'px',
                height: this.state.stretchedHeight + 10 + 'px'
            }}>
                <div id="map-title">{this.props.teamName} Office</div>
                <div id="map-canvas-container"/>
                <img id="map-img" src="/map/map.svg"
                     style={{
                        width: this.state.stretchedWidth + 'px',
                        height: this.state.stretchedHeight + 'px'
                     }}/>
            </div>
        )
    },

    renderCanvas() {
        var canvas = document.getElementById('map-canvas');
        if (canvas != null) {
            this.clearCanvas();

            this.drawUser(this.state.user.x, this.state.user.y);
            for (var i = 0; i < this.props.otherUsers.length; i++) {
                var otherUser = this.props.otherUsers[i];
                this.drawOtherUser(otherUser.x, otherUser.y);
            }
        }
    },

    mapMouseMoved(event) {
        var p = this.getPosition(event);
        var x = p.x;
        var y = p.y;
        var occupyingUser = this.getNearestOccupyingUser(x, y);
        if (occupyingUser) {
            this.selected = true;
            this.props.selectUser(occupyingUser);
            this.setBadCursor();
        } else {
            if (this.selected) {
                this.props.deselectUser();
                this.selected = false;
            }
            if (this.pointOpen(x, y)) {
                this.setGoodCursor();
            } else if (this.pointWalking(x, y)) {
                this.setBadCursor();
            } else {
                this.setNoCursor();
            }
        }
    },

    mapClicked(event) {
        var p = this.getPosition(event);
        var x = p.x;
        var y = p.y;
        if (this.pointOpen(x, y) && this.getNearestOccupyingUser(x, y) == null) {
            this.props.move(x, y, function() {
                // Function to execute if move is valid.
                this.setState({user: {
                    x: x,
                    y: y
                }});
            }.bind(this));
        }
    },

    getPosition(event) {
        var canvas = document.getElementById('map-canvas');
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        // Unstretch
        x = Math.round((this.state.width / this.state.stretchedWidth) * x);
        y = Math.round((this.state.height / this.state.stretchedHeight) * y);
        return {x: x, y: y }
    },

    setGoodCursor() {
        $('#map-canvas').css('cursor', 'url(images/good-cursor.png) 16 16, pointer');
    },

    setBadCursor() {
        $('#map-canvas').css('cursor', 'url(images/bad-cursor.png) 16 16, pointer');
    },

    setNoCursor() {
        $('#map-canvas').css('cursor', 'default');
    },

    clearCanvas() {
        var canvas = document.getElementById('map-canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    },

    drawUser(x, y) {
        var canvas = document.getElementById('map-canvas');
        var context = canvas.getContext('2d');
        context.fillStyle = '#FF3D00';
        context.fillRect(x - 2, y - 2, 4, 4);
    },

    drawOtherUser(x, y) {
        var canvas = document.getElementById('map-canvas');
        var context = canvas.getContext('2d');
        context.fillStyle = '#1E9E5E';
        context.fillRect(x - 2, y - 2, 4, 4);
    },

    pointOpen(x, y) {
        return this.props.points[x][y] == State.Open;
    },

    pointWalking(x, y) {
        return this.props.points[x][y] == State.Walking;
    },

    getNearestOccupyingUser(x, y) {
        var minDistance = 4;
        var occupyingUsers = [];
        for (var i = 0; i < this.props.otherUsers.length; i++) {
            var user = this.props.otherUsers[i];
            if (Math.abs(x - user.x) < minDistance &&
                Math.abs(y - user.y) < minDistance) {
                occupyingUsers.push(user);
            }
        }
        var nearestUser = null;
        var nearestDistance = Number.MAX_VALUE;
        for (var i = 0; i < occupyingUsers.length; i++) {
            var user = occupyingUsers[i];
            var dX = user.x - x;
            var dY = user.y - y;
            var d = Math.sqrt(dX * dX + dY * dY);
            if (d < nearestDistance) {
                nearestDistance = d;
                nearestUser = user;
            }
        }
        return nearestUser;
    }
});
