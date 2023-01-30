import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sideBar";
import Login from "./pages/login";
import Modal from "./components/modal";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Rides from "./pages/rides";
import Events from "./pages/events";
import Create from "./pages/create";
import Users from "./pages/users";
import Suggestions from "./pages/suggestions";
import Requests from "./pages/requests";
import Payment from "./pages/payments";
import Loader from "./components/loader";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [header, setHeader] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [login, setLogin] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loader, setLoader] = useState(false); // loader
  useEffect(() => {
    // window.title("RideShare");
  }, []);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <>
            {loader && <Loader />}
            {header && <Header onForgotPassword={setForgotPassword} />}
            {!header && <Sidebar loader={setLoader} auth={setAuth} onHeader={setHeader} />}
            <main className={header ? "main_component" : "main"}>
              {auth && (
                <>
                  <Route path="/dashboard" exact>
                    <Dashboard />
                  </Route>
                  <Route path="/profile" exact>
                    <Profile />
                  </Route>
                  <Route path="/rides" exact>
                    <Rides />
                  </Route>
                  <Route path="/events" exact>
                    <Events />
                  </Route>
                  <Route path="/create" exact>
                    <Create />
                  </Route>
                  <Route path="/users" exact>
                    <Users />
                  </Route>
                  <Route path="/suggestions" exact>
                    <Suggestions />
                  </Route>
                  <Route path="/requests" exact>
                    <Requests />
                  </Route>
                  <Route path="/payments" exact>
                    <Payment />
                  </Route>
                </>
              )}
              <Route path="/login" exact>
                {!forgotPassword && (
                  <Login login={setLogin} auth={setAuth} onHeader={setHeader} onForgotPassword={setForgotPassword} />
                )}
                {forgotPassword && <Modal setForgotPassword={setForgotPassword} />}
              </Route>
              {!login && <Redirect to="/login" />}
              <Redirect to="/login" />
            </main>
          </>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
