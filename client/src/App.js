import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import * as cookies from "./libs/cookies";

function App() {
    const apiCall = () => {
        axios
            .get(
                "http://localhost:8080/api/users/session/check?token=b88fa9e7823d780da2e6d69012e535e8a81be22c012dfa374704b936feb69b2a"
            )
            .then((data) => console.log(data))
            .catch((error) => console.error(error))
            .finally(console.log("API call complete"));
    };

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={apiCall}>Test API Call</button>
                <br />
                <button
                    onClick={() => console.log("Token:", cookies.getToken())}
                    style={{ backgroundColor: "darkcyan", color: "white" }}
                >
                    Get token
                </button>
                <button
                    onClick={() => {
                        cookies.clearCookies();
                        console.log("Cookies cleared.");
                    }}
                    style={{ backgroundColor: "darkred", color: "white" }}
                >
                    Delete cookies
                </button>
            </header>
        </div>
    );
}

export default App;
