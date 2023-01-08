// import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
    return (
        <div>
            <h1>[Home]</h1>
            <nav>
                <Link to="/customers">Customers</Link>
            </nav>
        </div>
    );
}