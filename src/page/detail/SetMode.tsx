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
      <SvgMode width={18} height={18} name={name} color={color} />
      <span style={{ marginTop: '5px', fontSize: '12px', color: color }}>
        {title}
      </span>
    </div>
  );
}

export default SetMode;
