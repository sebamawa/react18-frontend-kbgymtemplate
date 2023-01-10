import CustomersPaginated from '../components/CustomersPaginated';

export function CustomersPage({cust_id}) {
    return (
        <>
            <header className="App-header">
                <CustomersPaginated 
                    itemsPerPage={4} 
                    cust_id={cust_id}
                />
            </header>
        </>
    );
}