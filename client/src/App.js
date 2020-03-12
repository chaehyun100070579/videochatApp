import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import TextChatRoom from './components/views/TextChatRoom/TextChatRoom';
import VideoChatRoom from './components/views/VideoChatRoom/VideoChatRoom';


function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/TextChatRoom" component={TextChatRoom} />
          <Route exact path="/VideoChatRoom" component={VideoChatRoom} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;