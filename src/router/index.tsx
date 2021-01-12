import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '@/page/home';
import Detail from '@/page/detail';
import Login from '@/page/login';

export default function PageRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/detail/:bookId" exact component={Detail} />
      </Switch>
    </BrowserRouter>
  );
}
