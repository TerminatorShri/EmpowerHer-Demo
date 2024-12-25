import { getDefaultConfig } from "expo/metro-config"; 

export default (async () => {
  const defaultConfig = getDefaultConfig();
  const { assetExts, sourceExts } = defaultConfig.resolver;

  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
    },
  };
})();
