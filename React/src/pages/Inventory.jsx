import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "../components/Table.jsx";
import THead from "../components/THead.jsx";
import Spinner from "../components/Spinner.jsx";

function Inventory() {
    const [records, setRecords] = useState([]);
    const { departmentName } = useParams();
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [substanceList, setSubstanceList] = useState([]);

    useEffect(() => {
        axios.get("/api/substances").then((res) => {
            setSubstanceList(res.data);
        });
    }, []);

    useEffect(() => {
        if (!departmentName) return;
        setLoading(true);
        axios
            .get("/api/records", {
                params: { department_name: departmentName },
            })
            .then((response) => {
                setRecords(response.data);

                const years = [...new Set(response.data.map((r) => r.year))];
                setYears(years);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [departmentName]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        setRecords((prev) => {
            const newRecords = [...prev];
            newRecords[index] = {
                ...newRecords[index],
                [name]: value,
            };
            return newRecords;
        });
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    return (
        <div className="container mt-4 d-flex justify-content-center">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center w-100">
                    <Spinner />
                </div>
            ) : (
                <div className="card shadow-sm p-2 shadow-sm mb-2">
                    <div className="card-body">
                        <div className="row mb-4 align-items-center">
                            <h1 className="col-auto flex-grow-1">
                                {departmentName}
                            </h1>
                            <div className="col-auto">
                                <select
                                    id="year"
                                    className="form-control"
                                    value={year}
                                    onChange={handleYearChange}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <Table>
                            <THead>
                                <th>Látka</th>
                                <th style={{ width: "28%" }}>Množství</th>
                                <th>Vlastnosti</th>
                            </THead>
                            <tbody>
                                {records.map((record, index) => (
                                    <tr key={record._id?.$oid}>
                                        <td style={{ fontWeight: "700" }}>
                                            {record.substance.name}
                                        </td>
                                        <td className="align-middle">
                                            <div className="input-group">
                                                <input
                                                    name="amount"
                                                    type="number"
                                                    className="form-control"
                                                    value={record.amount}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                                <span
                                                    className="input-group-text"
                                                    style={{ minWidth: "40px" }}
                                                >
                                                    {record.substance?.unit || "ks"}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {record.substance.properties.map((property, idx) => (
                                                    <div key={idx}>
                                                        {`${property.name} ${property.category} ${
                                                            property.exposure_route
                                                                ? `(${property.exposure_route})`
                                                                : ""
                                                        }`}
                                                    </div>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;
