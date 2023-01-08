import CustomersPaginatedItems from '../components/CustomersPaginatedItems';

export function CustomersPage() {
    return (
        <>
            <header className="App-header">
                <CustomersPaginatedItems 
                    itemsPerPage={4} 
                />
            </header>
        </>
    );
}