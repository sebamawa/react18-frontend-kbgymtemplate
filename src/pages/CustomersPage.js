import CustomersPaginated from '../components/CustomersPaginated';

export function CustomersPage({cust_id}) {
    return (
        <>
            <div>
                <CustomersPaginated 
                    itemsPerPage={5} 
                    cust_id={cust_id}
                />
            </div>
        </>
    );
}