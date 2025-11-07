import {useEffect, useState} from "react";
import axios from "axios";

function ListSelect({ endpoint, label, onChange, value, name }) {
    const [internalValue, setInternalValue] = useState(value || "");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        axios.get(`/api/${endpoint}`)
            .then(res => {
                setOptions(res.data);
            })
    }, []);

    const handleChange = (e) => {
        setInternalValue(e.target.value);
        if (onChange) onChange(e);
    };

    return(
        <div>
            <label className="form-label fw-bold">{label}</label>
            <select
                name={name}
                value={internalValue}
                onChange={handleChange}
                className="form-select"
            >
                <option value="" disabled>
                    -- Vyber --
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ListSelect;