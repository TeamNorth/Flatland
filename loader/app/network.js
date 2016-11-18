import io from 'socket.io-client/socket.io';
import { ToastAndroid, AsyncStorage } from 'react-native';

import GameLoader from './native-modules/gameloader';

var socket;

export function emitTest() { 
	socket.emit('msg', {app: 'loader'});
}

export function requestGames(ip, callback) {
	//'192.168.0.197:3000/player'
	socket = io('http://' + ip);
	socket.on('connect', function() {
		AsyncStorage.setItem('server_ip', ip);
		socket.emit('bundle_name');
			socket.on('bundle_name_resp', function(s) {
			//ToastAndroid.show(s, ToastAndroid.SHORT);
			callback(s);
		});
	});
	socket.on('error', function(err) {
		ToastAndroid.show("An error occured.", ToastAndroid.SHORT);
	});
}

export function requestBundle(game) {
	socket.emit('bundle_request');
	socket.on('bundle_resp', function(jsFile) {
		//Call native module
		//ToastAndroid.show("calling native module", ToastAndroid.SHORT);
		//GameLoader.downloadBundle(game, jsFile);
		GameLoader.bootGame(game);
	});
}