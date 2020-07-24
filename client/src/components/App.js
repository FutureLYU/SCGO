import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import CartPage from "./views/CartPage/CartPage";
import HistoryPage from "./views/HistoryPage/HistoryPage";
import ChangePasswordPage from "./views/ChangePasswordPage/ChangePasswordPage";
import UserPage from "./views/UserPage/UserPage";
import VisitorPage from "./views/VisitorPage/VisitorPage";
import AdminPage from "./views/AdminPage/AdminPage";
import Exception403 from "./views/ExceptionPage/Exception403";
import Exception404 from "./views/ExceptionPage/Exception404";
import ContactUsPage from "./views/ContactUsPage/ContactUsPage";
import AdminProductPage from "./views/AdminPage/AdminProductPage/AdminProductPage";
import AdminUserPage from "./views/AdminPage/AdminUserPage/AdminUserPage";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "75px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/403" component={Auth(Exception403, null)} />
          <Route exact path="/404" component={Auth(Exception404, null)} />
          <Route exact path="/admin" component={Auth(AdminPage, true)} />
          <Route exact path="/admin/product" component={Auth(AdminProductPage, true)} />
          <Route exact path="/admin/user" component={Auth(AdminUserPage, true)} />
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/contactus" component={Auth(ContactUsPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/product/upload"
            component={Auth(UploadProductPage, true)}
          />
          <Route
            exact
            path="/product/:productId"
            component={Auth(DetailProductPage, null)}
          />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/user/item" component={Auth(UserPage, true)} />
          <Route
            exact
            path="/user/:userid"
            component={Auth(VisitorPage, null)}
          />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          <Route
            exact
            path="/change"
            component={Auth(ChangePasswordPage, null)}
          />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
