import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Expo from 'expo';
import Stave from './Stave';
import Piano from './Piano';
import noteSounds from './assets/notes/notes';

export default class Play extends React.Component {
  static propTypes = {
    possibleNotes: PropTypes.array.isRequired,
    onLoaded: PropTypes.func,
    onSuccess: PropTypes.func,
    onFail: PropTypes.func,
    clef: PropTypes.string,
  }

  static defaultProps = {
    onLoaded: () => {},
    onSuccess: () => {},
    onFail: () => {},
    clef: null,
  }

  constructor(props, context) {
    super(props, context);
    const notes = this.generateStave();
    const nextNotes = this.generateStave();
    this.state = {
      notes,
      nextNotes,
      noteSounds: this.prepareStaveSounds(notes),
      nextNoteSounds: this.prepareStaveSounds(nextNotes),
      currentIndex: 0,
      hint: false,
    };
  }

  componentDidMount() {
    this.props.onLoaded();
  }

  componentWillUnmount() {
    this.state.noteSounds.map(s => () => s.unloadAsync());
    this.state.nextNoteSounds.map(s => s.unloadAsync());
  }

  getNoteToPlayWithOctave = index => this.state.notes[index || this.state.currentIndex].keys[0];
  getNoteToPlay = index => this.getNoteToPlayWithOctave(index).split('/')[0];

  // bass max: e/4
  // treble min: a/4
  generateStave = () => (new Array(4).fill({})).map(() => {
    const generatedNote =
      this.props.possibleNotes[Math.floor(Math.random() * (this.props.possibleNotes.length))];
    const [note, octave] = generatedNote.split('/');
    let clef = 'treble';
    if (octave < 4) {
      if (octave === '3' && (note === 'a' || note === 'b')) {
        const randomBool = Math.floor(Math.random() * 2);
        if (randomBool === 1) {
          clef = 'bass';
        }
      } else {
        clef = 'bass';
      }
    } else if (octave === '4' && note !== 'f' && note !== 'g' && note !== 'a' && note !== 'b') {
      const randomBool = Math.floor(Math.random() * 2);
      if (randomBool === 1) {
        clef = 'bass';
      }
    }
    return ({
      clef: this.props.clef || clef,
      keys: [generatedNote],
    });
  });

  playSound = () => {
    const currentSound = this.state.noteSounds[this.state.currentIndex];
    currentSound.playFromPositionAsync(0).catch(() => {});
  }


  prepareStaveSounds = notes => notes.map((n) => {
    const noteName = n.keys[0].replace('/', '');
    const noteSound = new Expo.Audio.Sound();
    noteSound.loadAsync(noteSounds[noteName]);
    return noteSound;
  });


  handleNotePress = (note) => {
    const noteToPlay = this.getNoteToPlay();
    if (note === noteToPlay) {
      this.props.onSuccess();
      this.playSound();
      // pass to next stave
      if (this.state.currentIndex === 3) {
        const newStave = this.generateStave();
        this.state.noteSounds.map(s => setTimeout(() => {
          s.unloadAsync();
        }, 1000));
        this.setState({
          notes: this.state.nextNotes,
          nextNotes: newStave,
          noteSounds: this.state.nextNoteSounds,
          nextNoteSounds: this.prepareStaveSounds(newStave),
        });
      }
      this.setState({ currentIndex: (this.state.currentIndex + 1) % 4, hint: false });
    } else {
      this.setState({ hint: true });
      this.props.onFail();
    }
  };

  render() {
    return (
      <View>
        <Stave
          notes={this.state.notes} clef={this.props.clef}
          currentIndex={this.state.currentIndex}
        />
        <Piano
          onNotePress={this.handleNotePress}
          currentNote={this.getNoteToPlay()} hint={this.state.hint}
        />
      </View>
    );
  }
}
