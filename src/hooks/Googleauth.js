import { GoogleLogin } from "@react-oauth/google";
const clientId =
  "653368829553-b9vc2tqm2d9fr7vm1qinr15qv79j24jp.apps.googleusercontent.com";

const GoogleSignInButton = () => {
  const handleSuccess = (response) => {
    console.log("Login Success:", response);
    // Send the authorization code to your server for verification
    fetch("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ code: response.code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful authentication (e.g., store tokens, redirect to a different page)
        console.log("Successfully authenticated!", data);
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
      });
  };

  const handleFailure = (error) => {
    console.error("Login Failure:", error);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={"single_host_origin"} // Adjust cookie policy as needed
    />
  );
};
