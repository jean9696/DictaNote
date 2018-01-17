import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const notes = ['f', 'g', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
const sharpNotes = ['f', 'g', 'a', 'c', 'd'];

export default class Piano extends React.Component {
  static propTypes = {
    onNotePress: PropTypes.func,
    currentNote: PropTypes.string,
    hint: PropTypes.bool,
  };

  static defaultProps = {
    currentNote: null,
    hint: false,
    onNotePress: () => {},
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      notePressIndex: -1,
      notePressIsFlat: false,
    };
  }


  handleNotePressIn = (note, index, notePressIsFlat) => {
    this.props.onNotePress(note);
    this.setState({ notePressIndex: index, notePressIsFlat });
  }

  handleNotePressOut = (index, notePressIsFlat) => {
    if (this.state.notePressIndex === index && notePressIsFlat === this.state.notePressIsFlat) {
      this.setState({ notePressIndex: -1 });
    }
  }

  render() {
    const { notePressIndex, notePressIsFlat } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.piano}>
          {notes.map((note, i) => (
            <TouchableWithoutFeedback
              onPressIn={() => this.handleNotePressIn(note, i, false)} key={`note${i}`}
              onPressOut={() => this.handleNotePressOut(i, false)}
            >
              <View style={[
                styles.pianoNote,
                notePressIndex === i && !notePressIsFlat && styles.pianoNotePressed,
                note === this.props.currentNote && this.props.hint && styles.hint,
              ]} />
            </TouchableWithoutFeedback>
          ))}
        </View>
        <View style={styles.pianoFlat}>
          {notes.map((note, i) => (
              sharpNotes.includes(note) ?
                <TouchableWithoutFeedback
                  key={`noteFlat${i}`} onPressIn={() => this.handleNotePressIn(note, i, true)}
                  onPressOut={() => this.handleNotePressOut(i, true)}
                >
                  <View style={[
                    styles.pianoNoteFlat,
                    notePressIndex === i && notePressIsFlat && styles.pianoNotePressed,
                  ]} />
                </TouchableWithoutFeedback> : <View style={styles.flatSpace} key={`noteFlat${i}`} />
          ))}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  piano: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  pianoNote: {
    borderWidth: 1,
    borderTopWidth: 4,
    width: 50,
    height: '100%',
    zIndex: 30,
  },
  pianoNotePressed: {
    backgroundColor: '#c1c1c1',
  },
  pianoFlat: {
    flexDirection: 'row',
    width: '100%',
    height: '6%',
    position: 'absolute',
    left: 25,
  },
  pianoNoteFlat: {
    marginLeft: 10,
    marginRight: 10,
    width: 30,
    height: '100%',
    backgroundColor: '#000',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 50,
  },
  flatSpace: {
    width: 50,
  },
  hint: {
    backgroundColor: '#3f6dff',
  },
});