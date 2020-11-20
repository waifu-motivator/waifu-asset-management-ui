import * as React from 'react';
import {FC} from 'react';
import PluginChanIcon from '../images/PluginChanIcon.svg';
import {ReactSVG} from 'react-svg'

export type SizeType = {
  width?: string | number;
  height?: string | number;
};

type Props = {
  size?: SizeType;
  styles?: any
};

const defaultSize: SizeType = {
  height: '150px',
  width: '150px',
};

const PluginChan: FC<Props> = (props: Props) => {
  const {size, styles} = props;
  const usableSize = size || defaultSize;
  return (
    <div style={styles}>
      <ReactSVG
        src={PluginChanIcon}
        beforeInjection={svg => {
          svg.setAttribute(
            'width',
            String(usableSize.width || defaultSize.width),
          );
          svg.setAttribute(
            'height',
            String(usableSize.height || defaultSize.height),
          );
        }}
      />
    </div>
  );
};

export default PluginChan;
