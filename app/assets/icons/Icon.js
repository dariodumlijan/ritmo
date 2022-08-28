// @flow
import React, { useEffect, useRef } from 'react';
import type { Node } from 'react';
import {
  Animated, Easing, StyleSheet, View,
} from 'react-native';
import { secondsToMilliseconds } from 'date-fns';
import { deviceWidth } from '../../utils';
import colors from '../../styles/colors';

type Props = {
  style?: Object,
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  dotBig: {
    backgroundColor: colors.white,
    borderRadius: deviceWidth,
    aspectRatio: 1 / 1,
    width: '75%',
  },
  dotSmall: {
    position: 'absolute',
    top: '-5%',
    right: '-5%',
    backgroundColor: colors.cyan,
    borderRadius: deviceWidth,
    aspectRatio: 1 / 1,
    width: '25%',
  },
});

function Icon(props: Props): Node {
  const dotAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(dotAnimation, {
        toValue: 1,
        duration: secondsToMilliseconds(3),
        useNativeDriver: true,
        // $FlowFixMe
        easing: Easing.inOut(Easing.quad),
      }),
    ).start();
  }, [dotAnimation]);

  const rotation = dotAnimation.interpolate({
    inputRange: [0, 1],
    // $FlowFixMe
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{
      ...props.style,
      ...styles.container,
      ...{
        transform: [
          { rotate: rotation },
        ],
      },
    }}
    >
      <View style={styles.dotSmall} />
      <View style={styles.dotBig} />
    </Animated.View>
  );
}

export default Icon;
