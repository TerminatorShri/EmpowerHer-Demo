import React from "react";
import { Svg, Path } from "react-native-svg";
import { SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
}

const SecurityIcon: React.FC<IconProps> = ({
  color = "black",
  size = 24,
  strokeWidth = 1.5,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9 13C9 13 10 13 11 15C11 15 14.1765 10 17 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <Path
        d="M21 11.1833V8.28029C21 6.64029 21 5.82028 20.5959 5.28529C20.1918 4.75029 19.2781 4.49056 17.4507 3.9711C16.2022 3.6162 15.1016 3.18863 14.2223 2.79829C13.0234 2.2661 12.424 2 12 2C11.576 2 10.9766 2.2661 9.77771 2.79829C8.89839 3.18863 7.79784 3.61619 6.54933 3.9711C4.72193 4.49056 3.80822 4.75029 3.40411 5.28529C3 5.82028 3 6.64029 3 8.28029V11.1833C3 16.8085 8.06277 20.1835 10.594 21.5194C11.2011 21.8398 11.5046 22 12 22C12.4954 22 12.7989 21.8398 13.406 21.5194C15.9372 20.1835 21 16.8085 21 11.1833Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
    </Svg>
  );
};

export default SecurityIcon;