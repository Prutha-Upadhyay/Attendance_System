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
      
      // Navigate to Attendance Page after successful login
      navigate("/attendance");
    } catch (error) {
      alert("Failed to login! Please try again")
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div
    className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4"
    style={{
      backgroundImage: `url(/path/to/your/background-image.jpg)`, // Add your background image path
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="bg-gray-800/90 rounded-lg shadow-2xl p-8 max-w-md w-full text-center border border-gray-700 backdrop-blur-sm">
      <h1 className="text-3xl text-white mb-6">Welcome to Attendify</h1>
      <p className="text-gray-400 mb-8">
        Please log in to proceed further
      </p>

      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-full"
      >
        <svg
          className="w-6 h-6 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.8 3.2l5.7-5.7C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c12.2 0 22-9.8 22-22 0-1.3-.1-2.7-.4-3.9z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 12.6 19.1 10 24 10c3.1 0 5.8 1.2 7.8 3.2l5.7-5.7C34.6 4.1 29.6 2 24 2 16.3 2 9.7 6.6 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 46c6.6 0 12.2-2.1 16.2-5.7l-7.4-6.2c-2 1.4-4.5 2.2-7.1 2.2-5.2 0-9.6-3.3-11.3-8H6.3v7.6C9.7 41.4 16.3 46 24 46z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.1H42V20H24v8h11.3c-.6 1.7-1.5 3.2-2.7 4.5l7.4 6.2c2.2-2.1 3.6-5.1 3.6-8.7 0-1.3-.1-2.7-.4-3.9z"
          />
        </svg>
        Login with Google
      </button>
    </div>
  </div>
  );
};

export default Login;
