/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Button from './app/components/button';
import { emitTest, requestBundle, requestGames } from './app/network';
import { BoldenTheme } from './app/styles/theme';

import {
  AppRegistry,
  StyleSheet,
	AsyncStorage,
  Text,
	TextInput,
  View
} from 'react-native';

export default class loader extends Component {
	
	newGame(game) {
		if(!this.state.games.includes(game)) {
			let newGameList = this.state.games;
			newGameList.push(game);

			this.setState({
				games: newGameList
			});
		}
	}
	
	constructor(props) {
		super(props);
		
		this.state = {
			ipAddress: '',
			games: []
		}
		
		AsyncStorage.getItem('server_ip').then(value => this.setState({ipAddress: value}));
	}
	
  render() {
		if(this.state.games.length == 0) {
			return (
				<View style={styles.container}>
					<Text style={styles.welcome}>
						Find games on your network!
					</Text>
					<TextInput style={{height: 60, width: 300, margin: 20, textAlign: 'center', fontSize: 24}} onChangeText={(text) => this.setState({ipAddress: text})} value={this.state.ipAddress}/>
					<Button text="Scan Network" onPress={ requestGames.bind(undefined, this.state.ipAddress, this.newGame.bind(this)) }/>
				</View>
			);
		}
		else {
			var gameButtons = [];
			for(game of this.state.games) {
				gameButtons.push(
					(
						<View key={game} style={{margin:20}}> 
					 		<Button text={game} onPress={ requestBundle.bind(this, game) }/>
					 	</View>
					)
				);
			}
			
			return (
				<View style={{ flex: 1, margin:20, backgroundColor: '#F5FCFF' }}>
					<Text style={styles.welcome}>
						The following games have been found
					</Text>
					{gameButtons}
				</View>
			 );
  	}
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('loader', () => loader);