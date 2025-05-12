import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface TablerIconProps {
  xml: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const TablerIcon: React.FC<TablerIconProps> = ({ 
  xml, 
  width = 24, 
  height = 24, 
  strokeColor = '#000',
  fillColor = 'none',  // 初期値は透明
  strokeWidth,
  style 
}) => {
  // SVGの色を変更する（stroke と fill を個別に制御）
  let processedXml = xml
    .replace(/fill="[^"]*"/g, `fill="${fillColor}"`)
    .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`);
  
  // currentColor をstrokeColorに置き換え（Tabler IconsではcurrentColorがstrokeに使われていることが多い）
  processedXml = processedXml.replace(/currentColor/g, strokeColor);
  
  // stroke-widthの置換（指定されている場合のみ）
  if (strokeWidth !== undefined) {
    processedXml = processedXml.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
  }
  
  return <SvgXml xml={processedXml} width={width} height={height} style={style} />;
};

export default TablerIcon; 