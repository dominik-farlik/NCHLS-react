import { useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Substance from "./Substance.jsx";
import axios from "axios";

function EditSubstance() {
    const { substance_id } = useParams();
    const [alert, setAlert] = useState({
        message: "",
        type: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async (e, substance) => {
        e.preventDefault();
        await axios.put("/api/substances", substance)
            .then(() => {
                navigate("/substances");
            })
            .catch(error => {
                setAlert({message: error.response.data.detail, type: "danger"});
            })
    };

    return (
        <div className="container mt-4">
            <Alert message={alert.message} type={alert.type}/>
            <Substance
                substance_id={substance_id}
                setAlert={setAlert}
                handleSubmit={handleSubmit}
                heading={"Upravit látku"}
            />
        </div>
    );
}

export default EditSubstance;
