import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import Play from './Play';


export default class Player extends React.Component {
  static propTypes = {
    possibleNotes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      finish: false,
      fails: 0,
      success: 0,
    };
    this.time = 40;
  }

  getMark = () => {
    const mark = Math.floor((this.state.success - this.state.fails) / (this.time) * 100); //eslint-disable-line
    if (mark < 20) return 'F';
    if (mark < 40) return 'E';
    if (mark < 50) return 'D';
    if (mark < 60) return 'C';
    if (mark < 80) return 'B';
    if (mark < 100) return 'A';
    if (mark < 120) return 'S';
    return 'SS';
  }

  render() {
    return (
      <View>
        {this.state.finish ?
          <View style={styles.container}>
            <Text style={styles.mark}>{this.getMark()}</Text>
            <Text style={styles.center}>{this.state.success} success</Text>
            <Text style={styles.center}>{this.state.fails} fails</Text>
            <View style={styles.button}>
              <Button
                title="Restart"
                onPress={() => this.setState({ finish: false, fails: 0, success: 0 })}
              />
            </View>
          </View> :
          <Play
            possibleNotes={this.props.possibleNotes}
            onLoaded={() => setTimeout(() => this.setState({ finish: true }), 1000 * this.time)}
            onSuccess={() => this.setState({ success: this.state.success + 1 })}
            onFail={() => this.setState({ fails: this.state.fails + 1 })}
          />
        }
      </View>
    );
  }
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#191919',
  },
  mark: {
    fontSize: 120,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  center: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    width: 150,
    display: 'flex',
    height: 50,
    marginLeft: (width - 150) / 2,
  },
});
