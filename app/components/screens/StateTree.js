// @flow
import React from 'react';
import type { Node } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-native';
import JSONTree from 'react-native-json-tree';
import { includes } from 'lodash';
import Exit from '../../assets/icons/Exit';
import * as utils from '../../utils';
import mainStyle from '../../styles/main';
import colors from '../../styles/colors';
// $FlowFixMe[cannot-resolve-module] (Git Ignored)
import ENV from '../../../env.json'; /* eslint-disable-line import/no-unresolved */
import type { ReduxState } from '../../types';

function StateTree(): Node {
  const store = useSelector((state: ReduxState) => state);

  const theme = {
    base00: colors.transparent, // BACKGROUND
    base01: '#303030', // ???
    base02: '#505050', // ???
    base03: colors.grayBlue, // KEY_NUMBER_OPEN
    base04: '#d0d0d0', // ???
    base05: '#e0e0e0', // ???
    base06: '#f5f5f5', // ???
    base07: colors.black, // ???
    base08: colors.red, // NULL
    base09: colors.orange, // NUMBERS & BOOLEAN
    base0A: colors.orange, // ???
    base0B: colors.orange, // STRING & KEY_NUMBER_CLOSED
    base0C: '#76c7b7', // ???
    base0D: colors.primary, // KEYS
    base0E: '#d381c3', // ???
    base0F: colors.orange, // ???
  };

  return (
    <SafeAreaView style={mainStyle.safe}>
      <Link to="/" style={mainStyle.exit} underlayColor={null}>
        <Exit fill={colors.primaryDark} />
      </Link>
      <ScrollView
        style={{
          backgroundColor: colors.whiteTransparent,
          borderRadius: 10,
          flex: 1,
          marginTop: utils.deviceInfo.isiPhone ? '18%' : '22%',
          overflow: 'hidden',
        }}
        contentContainerStyle={mainStyle.scrollDeviceContainer}
        showsVerticalScrollIndicator
      >
        <JSONTree
          data={{
            utils: {
              ...utils.deviceInfo,
              adminDevices: ENV.ADMIN_DEVICE_IDS,
              deviceHeight: utils.deviceHeight,
              deviceWidth: utils.deviceWidth,
            },
            redux: store,
          }}
          theme={theme}
          invertTheme={false}
          shouldExpandNode={(key) => includes(key, 'utils')}
          hideRoot
        />
      </ScrollView>
      <View style={mainStyle.adSpace} />
    </SafeAreaView>
  );
}

export default StateTree;
