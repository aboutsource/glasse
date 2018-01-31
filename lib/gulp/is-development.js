const process = require('process');

const isDevelopment = () => {
  const envVarName = 'GLASSE_ENV',
        oldEnvVarName = 'WP_ENV';

  // @deprecated
  // @todo: remove in next major release
  if(process.env[oldEnvVarName]) {
    console.warn('The usage of "' + oldEnvVarName + '" is deprecated. Use "' + envVarName + '" instead.')

    if(process.env[envVarName]) {
      throw new Error('You cannot use "' + oldEnvVarName + '" and "' + envVarName + '" at the same time.');
    }

    return (!process.env[oldEnvVarName] ||
            process.env[oldEnvVarName] === 'development' ||
            process.env[oldEnvVarName] === '');
  }

  return  (!process.env[envVarName] ||
          process.env[envVarName] === 'development' ||
          process.env[envVarName] === '');
};

module.exports = isDevelopment;
