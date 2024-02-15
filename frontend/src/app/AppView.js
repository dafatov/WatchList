import {Route, Switch} from 'react-router-dom';
import {Animes} from '../pages/animes/Animes';
import {NotFound} from '../pages/notFound/NotFound';
import {memo} from 'react';

export const AppView = memo(() => {
  return (
    <Switch>
      <Route path="/" component={Animes} exact/>
      <Route path="/" component={NotFound}/>
    </Switch>
  );
});

AppView.displayName = 'AppView';
