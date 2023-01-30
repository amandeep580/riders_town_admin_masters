import React from "react";
import User from "./user";
import Dashboard from "./dashboard";
import BackIcon from "./backIcon";
import Profile from "./profile";
import Users from "./users";
import Rides from "./rides";
import Logout from "./logout";
import Payment from "./payments";
import Events from "./events";
import Create from "./create";
import Suggestions from "./suggestions";
import Requests from "./requests";
import Notification from "./notification";
import Logo from "./logo";
const icons = ({ name, ...rest }) => {
  switch (name) {
    case "user":
      return <User {...rest} />;
    case "users":
      return <Users {...rest} />;
    case "dashboard":
      return <Dashboard {...rest} />;
    case "profile":
      return <Profile {...rest} />;
    case "rides":
      return <Rides {...rest} />;
    case "logout":
      return <Logout {...rest} />;
    case "payments":
      return <Payment {...rest} />;
    case "events":
      return <Events {...rest} />;
    case "create":
      return <Create {...rest} />;
    case "suggestions":
      return <Suggestions {...rest} />;
    case "requests":
      return <Requests {...rest} />;
    case "notifications":
      return <Notification {...rest} />;
    case "backIcon":
      return <BackIcon {...rest} />;
    case "logo":
      return <Logo {...rest} />;
    default:
      return null;
  }
};

export default icons;
