import {memo} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Landing} from '../pages/landing/Landing';

export const AppView = memo(() => {
  return (
    <Switch>
      <Route path="/" component={Landing} exact/>
    </Switch>
  );
});

AppView.displayName = 'AppView';
