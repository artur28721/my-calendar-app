import * as React from "react";
import { StatusBar, StyleSheet, View } from "react-native";

const Frame = () => {
  return (
    <View style={styles.iphone1415Pro1Parent}>
      <StatusBar barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  iphone1415Pro1Parent: {
    width: 375,
    height: 812,
  },
});

export default Frame;
