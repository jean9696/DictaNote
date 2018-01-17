import React from 'react';
import { View, Picker, Button, TouchableHighlight, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlayLoop from './src/Player';

const possibleNotes = [
  'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4',
  'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5', 'b/5',
  'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2',
  'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3',
];

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      level: 1,
      run: false,
    };
  }

  getPossibleNotes = () => possibleNotes.slice(0, 7 * this.state.level);

  render() {
    return this.state.run ?
      <View>
        <PlayLoop possibleNotes={this.getPossibleNotes()} />
        <TouchableHighlight
          style={{ position: 'absolute', zIndex: 100, top: 10, left: 20 }}
          onPress={() => this.setState({ run: false })}
        >
          <Ionicons name="md-arrow-round-back" size={35} color="white" />
        </TouchableHighlight>
      </View> :
      <View style={{ paddingHorizontal: 200, paddingVertical: 50, backgroundColor: '#191919', height: '100%' }}>
        <Text style={{ textAlign: 'center', fontSize: 34, color: '#fff' }}>Dictanote</Text>
        <Picker
          selectedValue={this.state.level} style={{ marginVertical: 20, color: '#fff' }}
          onValueChange={level => this.setState({ level })}
        >
          <Picker.Item label="Easy" value={1} />
          <Picker.Item label="Normal" value={2} />
          <Picker.Item label="Hard" value={3} />
          <Picker.Item label="Pro" value={4} />
        </Picker>
        <Button title="Play" onPress={() => this.setState({ run: true })} />
      </View>;
  }
}
