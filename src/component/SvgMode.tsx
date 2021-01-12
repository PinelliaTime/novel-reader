import React from 'react';

interface IProps {
  width?: number;
  height?: number;
  name: string;
  color: string;
}

function SvgMode(props: IProps) {
  const { width = 16, height = 16, name, color } = props;

  return (
    <svg
      className="icon"
      aria-hidden="true"
      style={{ width: ` ${width}px`, height: `${height}`, fill: color }}
    >
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
}

export default SvgMode;
