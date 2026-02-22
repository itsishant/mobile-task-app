import Config from 'react-native-config';

interface AppConfig {
  DEV_URL: string | undefined;
}

const getConfig = (): AppConfig => {
//https://loopify-fcbl.onrender.com/api/v1

  return {
    DEV_URL: 'https://loopify-fcbl.onrender.com/api/v1'
  };
};

const appConfig = getConfig();

export default appConfig;
export const {
  DEV_URL
} = appConfig;
