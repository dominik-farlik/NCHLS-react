function Alert({ message, type = "danger" }) {
    if (!message) return null;

    return (
        <div role="alert" className={`alert alert-${type}`}>
            {message}
        </div>
    );
}

export default Alert;