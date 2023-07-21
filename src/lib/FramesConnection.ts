import { times } from 'lodash-es';
import { BrowserWindowMessageConnection } from '@aeternity/aepp-sdk';
import { executeAndSetInterval, handleUnknownError } from '../popup/utils';
import { AeSdkSupehero } from './AeSdkSupehero';

const POLLING_INTERVAL = 3000;

/**
 * Abstraction layer that allows to communicate between the wallet app running in an IFrame
 * and the parent dapps.
 */
export const FramesConnection = (() => {
  const connectedFrames = new Set();
  let initialized = false;
  let baseIntervalId: NodeJS.Timer;

  function getArrayOfAvailableFrames(): Window[] {
    return [
      window.parent,
      ...times(window.parent.frames.length, (i) => window.parent.frames[i]),
    ];
  }

  function init(aeSdk: AeSdkSupehero) {
    initialized = true;
    clearInterval(baseIntervalId);

    try {
      baseIntervalId = executeAndSetInterval(
        () => getArrayOfAvailableFrames()
          .filter((frame) => frame !== window)
          .forEach((target) => {
            if (connectedFrames.has(target)) {
              return;
            }

            connectedFrames.add(target);
            const connection = new BrowserWindowMessageConnection({ target });
            const originalConnect = connection.connect;
            let intervalId: NodeJS.Timer;

            connection.connect = function connect(onMessage: any) {
              originalConnect.call(this, (data: any, origin: any, source: any) => {
                if (source !== target) {
                  return;
                }
                clearInterval(intervalId);
                onMessage(data, origin, source);
              }, () => {});
            };

            const clientId = aeSdk.addRpcClient(connection);

            intervalId = executeAndSetInterval(() => {
              if (!getArrayOfAvailableFrames().includes(target)) {
                clearInterval(intervalId);
                return;
              }
              aeSdk.shareWalletInfo(clientId);
            }, 3000);
          }),
        POLLING_INTERVAL,
      );
    } catch (error: any) {
      handleUnknownError(error);
    }
  }

  return {
    initialized,
    init,
  };
})();
