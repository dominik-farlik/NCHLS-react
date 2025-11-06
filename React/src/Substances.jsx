import React, { useEffect, useState, useCallback } from "react";

function Substances() {
    const [substances, setSubstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchPropertyList = useCallback(async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const response = await fetch("http://localhost:8000/substances");
            if (!response.ok) throw new Error("Chyba při načítání");
            const data = await response.json();
            setSubstances(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setErrorMsg("Nepodařilo se načíst data.");
            setSubstances([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPropertyList().catch(console.error);
    }, [fetchPropertyList]);

    const asYesNo = (v) => (v ? "ano" : "ne");

    return (
        <div className="mt-4">
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "200px" }}
                >
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Načítám...</span>
                    </div>
                </div>
            ) : substances.length === 0 ? (
                <div className="text-center">
                    {errorMsg ? (
                        <div className="alert alert-danger mb-3">{errorMsg}</div>
                    ) : (
                        <div className="alert alert-warning mb-3">
                            Žádná data k zobrazení.
                        </div>
                    )}
                    <button className="btn btn-outline-primary" onClick={fetchPropertyList}>
                        Zkusit znovu
                    </button>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Název</th>
                            <th>Látka/Směs</th>
                            <th>Fyzikální forma</th>
                            <th>IPLP</th>
                            <th>Dezinfekce</th>
                            <th>Vlastnosti</th>
                            <th>Bezpečnostní list</th>
                            <th>Max. sklad. v tunách</th>
                            <th>Kategorie nebezpečnosti</th>
                            <th>EC50</th>
                            <th>Jednotka</th>
                        </tr>
                        </thead>
                        <tbody>
                        {substances.map((substance, index) => {
                            return (
                                <tr key={substance._id}>
                                    <td>{substance.name ?? ""}</td>
                                    <td>{substance.substance_mixture ?? ""}</td>
                                    <td>{substance.physical_form ?? ""}</td>
                                    <td>{asYesNo(substance.iplp)}</td>
                                    <td>{asYesNo(substance.disinfection)}</td>
                                    <td>{substance.properties.map((property, index) => (
                                        <div key={index}>{property.name} {property.category}</div>))}
                                    </td>
                                    <td>{asYesNo(substance.safety_sheet)}</td>
                                    <td>{substance.max_tons ?? ""}</td>
                                    <td>{substance.danger_category ?? ""}</td>
                                    <td style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "120px" }}
                                        title={substance.water_toxicity_EC50}>
                                        {substance.water_toxicity_EC50 ?? ""}
                                    </td>
                                    <td>{substance.unit ?? ""}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Substances;
