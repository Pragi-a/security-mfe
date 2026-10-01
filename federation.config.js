import { shareAll, withNativeFederation } from '@angular-architects/native-federation-v4/config';

export default withNativeFederation({
  name: 'security-mfe',
  exposes: {
    './Component': './src/app/app.ts'
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto', build: 'package' })
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
});
