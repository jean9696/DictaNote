import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Expo from 'expo';
import Vex from 'vexflow';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';

export default class Stave extends React.Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentIndex: PropTypes.number.isRequired,
    clef: PropTypes.string,
    // todo: add length checking
  };

  static defaultProps = {
    clef: null,
  }

  componentWillMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const screenWidth = width < height ? height : width;
    const marginLeft = (screenWidth - 400) / 2;
    const context = new ReactNativeSVGContext(NotoFontPack, { width: screenWidth, height: 220 });
    const stave = new Vex.Flow.Stave(marginLeft, 0, 400);
    const stave2 = new Vex.Flow.Stave(marginLeft, 100, 400);

    const trebleNotes = [];
    const bassNotes = [];

    this.props.notes.map((n) => {
      switch (n.clef) {
        case 'treble':
          trebleNotes.push(new Vex.Flow.StaveNote({ keys: ['c/4'], duration: 'q', ...n }));
          bassNotes.push(new Vex.Flow.StaveNote({ ...n, keys: ['b/4'], duration: 'qr' }));
          return n;
        case 'bass':
          trebleNotes.push(new Vex.Flow.StaveNote({ ...n, keys: ['d/3'], duration: 'qr' }));
          bassNotes.push(new Vex.Flow.StaveNote({ keys: ['c/4'], duration: 'q', ...n }));
          return n;
        default:
          throw new Error(`Invalid clef in Stave: ${n.clef} given`);
      }
    });

    trebleNotes.map((note, index) => {
      const color =
        index === this.props.currentIndex && this.props.notes[this.props.currentIndex].clef === 'treble' ?
          'blue' : 'black';
      note.setStyle({ strokeStyle: color, fillStyle: color });
      return note;
    });
    bassNotes.map((note, index) => {
      const color =
        index === this.props.currentIndex && this.props.notes[this.props.currentIndex].clef === 'bass' ?
          'blue' : 'black';
      note.setStyle({ strokeStyle: color, fillStyle: color });
      return note;
    });


    const voice = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(trebleNotes);

    new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400);

    const bass = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 });
    bass.addTickables(bassNotes);

    new Vex.Flow.Formatter().joinVoices([bass]).format([bass], 400);

    stave.addClef('treble');
    stave.setContext(context);
    stave2.addClef('bass');
    stave2.setContext(context);


    stave.draw();
    stave2.draw();
    voice.draw(context, stave);
    bass.draw(context, stave2);

    return (
      <View style={{ backgroundColor: '#bdbec5' }}>
        <View style={[styles.side, { left: 0, width: marginLeft - 20 }]} />
        <View style={[styles.side, { right: 0, width: marginLeft - 20 }]} />
        { context.render() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  side: {
    position: 'absolute',
    backgroundColor: '#191919',
    height: '100%',
    top: 0,
  },
});
