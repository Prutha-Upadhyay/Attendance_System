import { auth, provider } from "../firebaseConfig.js"; // Import Firebase config
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
    //   console.log(result.user.lat)
      
      // Redirect to Attendance Page after successful login
      navigate("/attendance");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
