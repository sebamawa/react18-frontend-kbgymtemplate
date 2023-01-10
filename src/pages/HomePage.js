import bluegymImg from '../logo-bluefitness.png';

export function HomePage() {
    return (
        <div>
            <header className="App-header">
                <h1>[Home]</h1>
                {/* <nav>
                    <Link to="/customers">Customers</Link>
                </nav> */}
                <img src={bluegymImg} className="App-logo-long" alt="logo"/> 
            </header>
        </div>
    );
}