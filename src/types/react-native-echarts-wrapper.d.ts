declare module 'react-native-echarts-wrapper' {
  import { Component } from 'react';
    import { ViewStyle } from 'react-native';

  interface EChartsProps {
    option: any;
    style?: ViewStyle;
    onLoadEnd?: () => void;
    onError?: (error: any) => void;
  }

  export default class ECharts extends Component<EChartsProps> {}
} 