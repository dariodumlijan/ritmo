// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, map } from 'lodash';
import Alert from '../../elements/misc/Alert';
import Play from '../../../assets/icons/Play';
import Pause from '../../../assets/icons/Pause';
import { selectors as globalSelectors } from '../../../store/globalStore';
import { actions as beatActions, selectors as beatSelectors } from '../../../store/beatsStore';
import useLocale from '../../../locales';
import {
  calcBpmInterval,
  calcPulseInterval,
  isBeatEmpty,
} from '../../../utils';
import { useTeleport } from '../../../utils/hooks';
import circleStyle from '../../../styles/circle';
import { checkboxStyle } from '../../../styles/inputs';
import notificationsStyle from '../../../styles/notifications';
import colors from '../../../styles/colors';
import type { UI } from '../../../store/globalStore';
import type { Beat, Beats } from '../../../sound/beats';

function Circle(): Node {
  const { t } = useLocale();
  const { teleport } = useTeleport();
  const dispatch = useDispatch();
  const global: UI = useSelector(globalSelectors.getUI, isEqual);
  const beats: Beats = useSelector(beatSelectors.getBeats, isEqual);
  const [circleRadius, setCircleRadius] = useState({ hihat: 0, snare: 0, kick: 0 });
  const beatlineAnimation = useState(new Animated.Value(0))[0];
  const pulseAnimation = useState(new Animated.Value(1))[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(beatActions.pauseBeat()), []);

  const getDimensions = (e: Object, key: string) => setCircleRadius({ ...circleRadius, ...{ [key]: e.nativeEvent.layout.width / 2 - 2.5 } });

  const beatlineAngle = beatlineAnimation.interpolate({
    inputRange: [0, 1],
    // $FlowFixMe
    outputRange: ['0deg', '360deg'],
  });

  const handleAnimations = () => {
    const bpmInterval = calcBpmInterval(global.useBPM);
    const pulseInterval = calcPulseInterval(bpmInterval);

    const handlePulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 0.9,
            duration: pulseInterval,
            useNativeDriver: true,
            // $FlowFixMe
            easing: Easing.linear,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: pulseInterval,
            useNativeDriver: true,
            // $FlowFixMe
            easing: Easing.linear,
          }),
        ]),
      ).start();
    };

    const handleLineAnimation = () => {
      Animated.loop(
        Animated.timing(beatlineAnimation, {
          toValue: 1,
          duration: bpmInterval,
          useNativeDriver: true,
          // $FlowFixMe
          easing: Easing.linear,
        }),
      ).start();
    };

    handleLineAnimation();
    handlePulseAnimation();
  };

  const handleStart = () => {
    if (isBeatEmpty(beats)) {
      teleport(
        <Alert clearDelayMS={3300}>
          <Text style={notificationsStyle.alertText}>{t('alert.no_beat')}</Text>
        </Alert>,
      );

      return;
    }

    dispatch(beatActions.playBeat({
      useSample: global.useSample,
      bpmInterval: calcBpmInterval(global.useBPM),
    }));

    handleAnimations();
  };

  const handlePause = () => {
    dispatch(beatActions.pauseBeat());

    beatlineAnimation.stopAnimation();
    beatlineAnimation.setValue(0);
    pulseAnimation.stopAnimation();
    pulseAnimation.setValue(1);
  };

  return (
    <View style={circleStyle.wrapper}>
      <Animated.View
        style={[
          circleStyle.beatline,
          {
            transform: [
              { rotate: beatlineAngle },
              { translateY: -circleRadius.hihat / 2 },
            ],
          },
        ]}
      />

      {map(circleRadius, (val, key) => (
        <View
          key={key}
          style={{ ...circleStyle.circle, ...circleStyle[key] }}
          onLayout={(e) => getDimensions(e, key)}
        >
          {map(beats[key], (beat: Beat, beatKey: number) => (
            <React.Fragment key={beatKey}>
              {beat.visible && (
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    checkboxStyle.wrapper,
                    {
                      transform: [{ rotate: beat.angle + 'deg' }, { translateY: -circleRadius[key] }],
                    },
                  ]}
                  onPress={() => dispatch(
                    beatActions.toggleCheckbox({
                      key,
                      index: beatKey,
                      bool: !beat.checked,
                    }),
                  )
                  }
                >
                  <View
                    style={[
                      checkboxStyle.checkbox,
                      beat.checked ? checkboxStyle[key] : checkboxStyle.default,
                    ]}
                  />
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}
        </View>
      ))}

      {global.isPlaying ? (
        <TouchableHighlight
          style={circleStyle.btnWrapper}
          underlayColor={colors.primaryDark}
          onPress={handlePause}
        >
          <Animated.View
            style={[
              circleStyle.btnAnimated,
              {
                transform: [
                  { scale: pulseAnimation },
                ],
              },
            ]}
          >
            <Pause style={circleStyle.btnIcon} />
          </Animated.View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight
          style={[
            circleStyle.btnWrapper,
            {
              backgroundColor: colors.primary,
              padding: 25,
            },
          ]}
          underlayColor={colors.primaryDark}
          onPress={handleStart}
        >
          <Play style={circleStyle.btnIcon} />
        </TouchableHighlight>
      )}
    </View>
  );
}

export default Circle;
