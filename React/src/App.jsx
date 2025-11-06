import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import RecordForm from "./RecordForm.jsx";
import AddSubstance from "./AddSubstance.jsx";
import Home from "./Home.jsx";
import Substances from "./Substances.jsx";
import Records from "./Records.jsx";


function App() {
    return (
        <Router>
            <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add-substance" element={<AddSubstance />} />
                    <Route path="/add-record" element={<RecordForm />} />
                    <Route path="/substances" element={<Substances />} />
                    <Route path="/records" element={<Records />} />
                </Routes>
        </Router>
    );
}

export default App;
