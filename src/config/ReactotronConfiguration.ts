import Reactotron from 'reactotron-react-js';
import {reactotronRedux} from 'reactotron-redux';

declare global {
  interface Console {
    tron: (...args: any[]) => void;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
console.tron = Reactotron.log;

const reactotronInstance = Reactotron.configure({
  name: 'Waifu Asset Management',
})
  .use(reactotronRedux())
  .connect();

export default reactotronInstance;
