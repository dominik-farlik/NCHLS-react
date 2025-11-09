import { useEffect, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

function Records() {
    const [records, setRecords] = useState([]);
    const { departmentName } = useParams();

    useEffect(() => {
        axios.get("/api/records", { params: { department_name: departmentName } })
            .then(response => {
                setRecords(response.data);
            })
    }, [departmentName]);

    return (
        <div className="container mt-4">
            <div className="table-responsive" style={{ maxHeight: "79vh", overflowY: "auto" }}>
                <table className="table table-hover align-middle table-bordered" style={{ position: "relative" }}>
                    <thead
                        className="table-light"
                        style={{
                            position: "sticky",
                            top: 0,
                        }}>
                    <tr className="border" style={{ position: "sticky", top: "0" }}>
                        <th>Rok</th>
                        <th>Místo uložení</th>
                        <th>Látka</th>
                        <th>Množství</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((record) => (
                        <tr key={record._id?.$oid}>
                            <td>{record.year}</td>
                            <td>{record.location_name}</td>
                            <td>{record.substance.name}</td>
                            <td>{record.amount} {record.substance.unit || "ks"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Records;
