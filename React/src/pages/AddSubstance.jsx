import { useState } from 'react';
import axios from "axios";
import Alert from "../components/Alert.jsx";
import Substance from "./Substance.jsx";

function AddSubstance() {
    const [alert, setAlert] = useState({
        message: "",
        type: ""
    });

    const handleSubmit = async (e, substance) => {
        e.preventDefault();
        await axios.post("/api/substances", substance)
        .then(() => {
            setAlert({message: "Látka byla přidána", type: "success"});
        })
        .catch(error => {
            setAlert({message: error.response.data.detail, type: "danger"});
        })
    };

    return (
        <div className="container mt-4">
            <Alert message={alert.message} type={alert.type}/>
            <Substance
                setAlert={setAlert}
                handleSubmit={handleSubmit}
                heading={"Přidat látku"}
            />
        </div>
    );
}

export default AddSubstance;
