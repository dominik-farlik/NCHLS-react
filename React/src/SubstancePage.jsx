import React, { useEffect, useState } from "react";

function SubstancePage() {
    const [substances, setSubstances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPropertyList().catch(console.error);
    }, []);

    const fetchPropertyList = async () => {
        try {
            const response = await fetch('http://localhost:8000/substances');
            if (!response.ok) throw new Error('Chyba při načítání');
            const data = await response.json();
            setSubstances(data);
        } catch (error) {
            console.error(error);
            setSubstances([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e, substanceId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("safety_sheet", file);

        try {
            const response = await fetch(`http://localhost:8000/${substanceId}/add_safety_sheet`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Chyba při nahrávání: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("✅ Soubor nahrán:", result);

            setSubstances(prev =>
                prev.map(sub =>
                    sub._id.$oid === substanceId
                        ? { ...sub, safety_sheet: true }
                        : sub
                )
            );

        } catch (err) {
            console.error("❌ Nepodařilo se nahrát soubor:", err);
        }
    };

    return (
        <div className="container mt-4">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Načítám...</span>
                    </div>
                </div>
            ) : substances.length === 0 ? (
                <div className="alert alert-warning text-center">Žádná data k zobrazení.</div>
            ) : (
                <div className="d-flex flex-column">
                    <div className="d-flex bg-dark text-white fw-bold border-bottom">
                        <div className="p-2 flex-fill">Název</div>
                        <div className="p-2 flex-fill text-center">Látka/Směs</div>
                        <div className="p-2 flex-fill text-center">Fyzikální forma</div>
                        <div className="p-2 flex-fill text-center">IPLP</div>
                        <div className="p-2 flex-fill text-center">Dezinfekce</div>
                        <div className="p-2 flex-fill text-center">Vlastnosti</div>
                        <div className="p-2 flex-fill text-center">Bezpečnostní list</div>
                        <div className="p-2 flex-fill text-center">Max. sklad. v tunách</div>
                        <div className="p-2 flex-fill text-center">Kategorie nebezpečnosti</div>
                        <div className="p-2 flex-fill text-center">EC50</div>
                        <div className="p-2 flex-fill text-center">Jednotka</div>
                    </div>
                    {substances.map((substance, sIndex) => (
                        <div
                            key={substance._id.$oid || sIndex}
                            className={`d-flex align-items-center border-bottom ${sIndex % 2 ? "bg-light" : ""}`}
                        >
                            <div className="p-2 flex-fill fw-bold">{substance.name}</div>
                            <div className="p-2 flex-fill text-center">{substance.substance_mixture}</div>
                            <div className="p-2 flex-fill text-center">{substance.physical_form}</div>
                            <div className="p-2 flex-fill text-center">{substance.iplp ? "ano" : "ne"}</div>
                            <div className="p-2 flex-fill text-center">{substance.disinfection ? "ano" : "ne"}</div>
                            <div className="p-2 flex-fill text-center">
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Vlastnosti
                                    </button>
                                    <ul className="dropdown-menu">
                                        {substance.properties.map((property, pIndex) => (
                                            <li key={pIndex}>
                                                <a className="dropdown-item" href="#">
                                                    {Object.values(property).join(" ")}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="p-2 flex-fill text-center">
                                {substance.safety_sheet ? (
                                    <a
                                        href={`http://localhost:8000/safety_sheet/${substance._id.$oid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Otevřít bezpečnostní list"
                                        style={{
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        📄
                                    </a>
                                ) : (
                                    <label
                                        className="btn mb-0 p-0"
                                        title="Přidat bezpečnostní list"
                                        style={{
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        ➕
                                        <input
                                            type="file"
                                            name="safety_sheet"
                                            onChange={(e) => handleFileChange(e, substance._id.$oid)}
                                            style={{ display: "none" }}
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="p-2 flex-fill text-center">{substance.max_tons}</div>
                            <div className="p-2 flex-fill text-center">{substance.danger_category}</div>
                            <div className="p-2 flex-fill text-center">{substance.water_toxicity_EC50}</div>
                            <div className="p-2 flex-fill text-center">{substance.unit}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SubstancePage;
