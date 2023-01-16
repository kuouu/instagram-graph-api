import "./styles.css";
import { useEffect, useState } from "react";

export default function App() {
  const [token, setToken] = useState("");
  useEffect(() => {
    // SDK 載入完成時會立即呼叫 fbAsyncInit，在這個函式中對 Facebook SDK 進行初始化
    window.fbAsyncInit = function () {
      // 初始化 Facebook SDK
      window.FB.init({
        appId: process.env.REACT_APP_FB_APP_ID,
        version: process.env.REACT_APP_FB_APP_VERSION
      });

      // 取得使用者登入狀態
      window.FB.getLoginStatus(function (response) {
        console.log("[refreshLoginStatus]", response);
        if (response.status === "connected") {
          setToken(response.authResponse.accessToken);
        }
      });

      window.FB.AppEvents.logPageView();
    };
    //1. Load the JavaScript SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);
  useEffect(() => {
    if (token)
      window.FB.api(
        "/me/accounts",
        "GET",
        {
          fields:
            "instagram_business_account{id,name,username,profile_picture_url}"
        },
        function (response) {
          console.log(response);
        }
      );
  }, [token]);
  const handleFBLogin = () => {
    window.FB.login(
      function (response) {
        setToken(response.authResponse.accessToken);
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      {token}
      <div>
        <button onClick={handleFBLogin}>Facebook Login</button>
      </div>
    </div>
  );
}
