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
            {records.length === 0 ? (
                <div className="alert alert-warning text-center">Žádné záznamy k zobrazení.</div>
            ) : (
                <table className="table table-hover align-middle table-striped table-borderless">
                    <thead className="table-dark">
                        <tr>
                            <th>Místo uložení</th>
                            <th className="text-center">Rok</th>
                            <th className="text-center">Látka</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={record._id?.$oid || index}>
                                <td>{record.location_name}</td>
                                <td className="text-center">{record.year}</td>
                                <td className="text-center">{record.substance_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Records;
