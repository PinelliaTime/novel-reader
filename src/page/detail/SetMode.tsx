import SvgMode from '@/component/SvgMode';
import React from 'react';

interface IProps {
  name: string;
  color: string;
  title: string;
  onClick: any;
}

function SetMode(props: IProps) {
  const { name, color, title, onClick } = props;

  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column' }}>
      <SvgMode width={16} height={16} name={name} color={color} />
      <span style={{ marginTop: '4px', fontSize: '10px', color: color }}>
        {title}
      </span>
    </div>
  );
}

export default SetMode;
