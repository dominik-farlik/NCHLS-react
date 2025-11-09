import { useEffect, useState } from "react";
import axios from "axios";

function Records() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        axios.get("/api/records")
            .then(res => {
                setRecords(res.data);
            })
    }, []);

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
                            <td>{record.substance_id}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Records;
