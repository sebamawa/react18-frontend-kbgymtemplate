import { useLocation } from "react-router-dom";

export function NotFoundPage() {
    const location = useLocation();

    return (
        <>
            <div className="App-header">
                <h1>Resoruce Not Found! at: {location.pathname}</h1>
            </div>
        </>
    );
}