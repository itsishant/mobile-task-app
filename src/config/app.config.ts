import Config from 'react-native-config';

interface AppConfig {
  DEV_URL: string | undefined;
}

const getConfig = (): AppConfig => {

  return {
    DEV_URL: Config.DEV_URL || 'http://10.0.2.2:3000/api/v1'
  };
};

const appConfig = getConfig();

export default appConfig;
export const {
  DEV_URL
} = appConfig;
