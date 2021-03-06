// @flow
import React from 'react';
import { StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { FullWidthButton } from './ComponentIndex';
import colors from './styles/colors';
import { getUserLibrary } from './API.js';
import ERROR_CODES from './ErrorCodes.js';
import { GameEntry } from './ViewIndex.js';
// import GLOBAL from './constants';

const maxWidth = Dimensions.get('window').width;
const maxHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.backgroundPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.white,
    fontSize: 36,
    fontFamily: 'Exo'
  },
  scrollView: {
    width: maxWidth,
    height: maxHeight - 160,
    backgroundColor: colors.backgroundPrimary,
    borderColor: 'black',
    borderWidth: 1
  }
});

export default class Library extends React.Component {
  constructor() {
    super();
    this.state = {
      errorCode: ERROR_CODES.LOADING,
      userLibrary: [],
      selectedGame: null
    };
  }

  componentDidMount() {
    getUserLibrary()
      .then(userLibrary => {
        this.setState({ userLibrary });
        this.setState({ errorCode: ERROR_CODES.SUCCESS });
      })
      .catch(error => {
        this.state.setState({ errorCode: error });
        console.error('Error fetching user Library: ', error);
      });
  }

  render() {
    if (this.state.selectedGame) {
      return <GameEntry gameId={this.state.selectedGame} />;
    }
    switch (this.state.errorCode) {
      case ERROR_CODES.SUCCESS:
        return (
          <ScrollView style={styles.scrollView}>
            {this.state.userLibrary.map(game => {
              return (
                <FullWidthButton
                  title={game.title}
                  label={game.title}
                  key={game.title}
                  sublabel={game.developer}
                  info={game.quickFacts.releaseDate}
                  imageSource={require('./img/gow2.png')}
                  onPress={() => {
                    this.setState({ selectedGame: game.title });
                  }}
                />
              );
            })}
          </ScrollView>
        );
      case ERROR_CODES.LOADING:
        return (
          <ScrollView style={styles.scrollView}>
            <Text style={styles.text}> LOADING </Text>
          </ScrollView>
        );
      case ERROR_CODES.UNKNOWN_FAILURE:
        return (
          <ScrollView style={styles.scrollView}>
            <Text style={styles.text}> ERROR: </Text>
          </ScrollView>
        );
      default:
        return (
          <ScrollView style={styles.scrollView}>
            <Text style={styles.text}>???</Text>
          </ScrollView>
        );
    }
  }
}
