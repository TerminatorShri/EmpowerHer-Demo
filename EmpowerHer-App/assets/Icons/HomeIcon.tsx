import React from "react";
import { Svg, Path } from "react-native-svg";
import { SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
  strokeLinejoin?: "round" | "miter" | "bevel";
}

const HomeIcon: React.FC<IconProps> = ({
  color = "black",
  size = 24,
  strokeWidth = 1.5,
  strokeLinejoin = "round",
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7.08848 4.76364L6.08847 5.54453C4.57182 6.72887 3.81348 7.32105 3.40617 8.15601C3 8.99097 3 9.95552 3 11.8846V13.9767C3 17.763 3 19.6562 4.17157 20.8325C5.11466 21.7793 6.52043 21.964 9 22V18.0057C9 17.0738 9 16.6078 9.15224 16.2403C9.35523 15.7502 9.74458 15.3609 10.2346 15.1579C10.6022 15.0057 11.0681 15.0057 12 15.0057C12.9319 15.0057 13.3978 15.0057 13.7654 15.1579C14.2554 15.3609 14.6448 15.7502 14.8478 16.2403C15 16.6078 15 17.0738 15 18.0057V22C17.4796 21.964 18.8853 21.7793 19.8284 20.8325C21 19.6562 21 17.763 21 13.9767V11.8846C21 9.95552 21 8.99097 20.5933 8.15601C20.1865 7.32105 19.4282 6.72887 17.9115 5.54453L16.9115 4.76364C14.5521 2.92121 13.3724 2 12 2C10.6276 2 9.44787 2.92121 7.08848 4.76364Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin={strokeLinejoin}
      />
    </Svg>
  );
};

export default HomeIcon;
