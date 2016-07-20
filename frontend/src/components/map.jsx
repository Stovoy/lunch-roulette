import React from 'react';
import ReactDOM from 'react-dom';

export var Map = React.createClass({
    getInitialState() {
        return {
            x: 0,
            y: 0,
            width: this.props.width,
            height: this.props.height
        }
    },

    componentDidMount() {
        var canvas = <canvas id="map-canvas"
                             style={{
                                left: this.state.x,
                                top: this.state.y
                             }}
                             width={this.state.width}
                             height={this.state.height}
                             onMouseMove={this.mapMouseMoved}
                             onClick={this.mapClicked}/>;

        ReactDOM.render(canvas, document.getElementById('map-canvas-container'));
    },

    render() {
        var canvas = document.getElementById('map-canvas');
        if (canvas != null) {
            $(canvas).css('left', this.state.x);
            $(canvas).css('top', this.state.y);

            this.clearCanvas();

            this.drawUser(this.props.user.x, this.props.user.y);
            for (var i = 0; i < this.props.otherUsers.length; i++) {
                var otherUser = this.props.otherUsers[i];
                this.drawOtherUser(otherUser.x, otherUser.y);
            }
        }

        return (
            <div id="map-container">
                <div id="map-canvas-container"></div>
                <img id="map-img" src="/map/map.svg"
                     style={{
                        width: this.state.width + 'px',
                        height: this.state.height + 'px'
                     }}
                     onLoad={this.mapLoaded}/>
            </div>
        )
    },

    mapLoaded() {
        var node = document.getElementById('map-img');
        this.setState({
            x: node.offsetLeft,
            y: node.offsetTop
        });
    },

    mapMouseMoved(event) {
        var p = this.getPosition(event);
        var x = p.x;
        var y = p.y;
        if (this.pointOpen(x, y)) {
            this.setGoodCursor();
        } else {
            this.setBadCursor();
        }
    },

    mapClicked(event) {
        var p = this.getPosition(event);
        var x = p.x;
        var y = p.y;
        if (this.pointOpen(x, y)) {
            this.props.move(x, y);
        }
    },

    getPosition(event) {
        var canvas = document.getElementById('map-canvas');
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(event.clientX - rect.left),
            y: Math.round(event.clientY - rect.top)
        }
    },

    setGoodCursor() {
        $('#map-canvas').css('cursor', 'url(images/good-cursor.png) 16 16, pointer');
    },

    setBadCursor() {
        $('#map-canvas').css('cursor', 'url(images/bad-cursor.png) 16 16, pointer');
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
        var open = this.props.open;
        return x in open && y in open[x];
    }
});
