// En archivo config.js
// export const Config = {
//   server: '190.6.81.46/app/back/imp',
//   dirImg: '190.6.81.46/uploads/',
//   // server: '127.0.0.1:5000',
//   // dirImg: 'localhost/uploads/',
//   puerto: '5000',
// };

import Constants from 'expo-constants';
// console.log('Config object:', config);
export default {
  server: Constants.expoConfig?.extra?.server,
  dirImg: Constants.expoConfig?.extra?.dirImg
};