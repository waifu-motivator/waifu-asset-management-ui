import React, {FC} from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import PluginChan from "./PluginChanIcon";

interface Props {
  overlay?: boolean;
}

export const LoadingIndicator: FC<Props> = ({
                                              overlay,
                                            }) => (
  <div
    data-testid={'loading-indicator'}
    style={{
      opacity: 0.7,
      ...(overlay ? {
        opacity: 0.7,
        position: 'fixed',
        left: '50%',
        top: '50%',
        zIndex: 90000,
        transform: 'translate(-50%, -50%)',
      } : {}),
    }}>
    <Loader
      type={'Triangle'}
      color={"var(--accent-color)"}
      height={320}
      width={320}
    >
    </Loader>
    <div style={{
      ...(overlay ? {
        position: 'absolute',
        left: '25%',
        top: '40%',
      } : {
        margin: '-200px 0 0 75px'
      })
    }}>
      <PluginChan/>
    </div>
  </div>
)

export default LoadingIndicator;
