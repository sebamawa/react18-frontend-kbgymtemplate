import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import './CustomersPaginated.css';

import { Link } from "react-router-dom";

function DisplayItems({ currentItems }) {
  return (
    <>
        {/* <h3>Customers List</h3>  */}

        <table className='table table-dark table-striped'>
            <thead>
                <tr>
                    <th scope='col'>Fullname</th>
                    <th scope='col'>Image</th>
                    <th scope='col'>Phone</th>
                    <th scope='col'>Details</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((d)=> 
                    <tr key={d.cust_id}>
                        <td>{d.cust_fullname}</td>
                        <td><img src={d.cust_image} alt={"img"} width="60px" height="60px"/></td>
                        <td>{d.cust_phone}</td>
                        <td>
                          <Link 
                              to={`/customer-details/${d.cust_id}`} 
                              state={{customer: d}}
                          > 
                                <i className="bi bi-list-task"></i>
                          </Link>
                        
                        </td>
                    </tr>
                  
                )}
            </tbody>
        </table>
    </>
  );
}

function CustomersPaginated({ itemsPerPage }) {

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentCustomers, setCurrentCustomers] = useState([]); // from API
  const [totalPages, setTotalPages] = useState(0); // from API


  useEffect(() => {
    /**
     * Endpoint query string parameters:
     * cust_active: boolean
     * page_number: int // requested page number
     * page_size: int   // requested page size
     * 
     * Endpoint response:
     * {
     *  "SDTCustomers": [{
     *     "cust_id": int,
     *     "cust_fullname": string,
     *     "cust_phone": string,
     *     "cust_email": string,
     *     "cust_image": string (image url),
     *     "cust_active": boolean,
     *     "cust_serv_descrip": string, 
     *     "cust_has_debt": boolean,
     * }],
     *  "TotalPages": int
     * }
     */

    try {
      const fetchCustomers = async () => {
        setLoading(true);
        const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/List?cust_active=true&page_number=${currentPage}&page_size=${itemsPerPage}`);
        const json = await response.json();
        console.log(json);
        setCurrentCustomers(json.SDTCustomers); // toma tiempo
        // console.log(currentCustomers); // imprime [] la primera vez
        setTotalPages(json.TotalPages);
        setLoading(false);
      }
      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  }, [currentPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <>
    { loading ? <h1>{'Loading Customers'}</h1> :
        <>
            <DisplayItems currentItems={currentCustomers} /> 
        </>
    }
        <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            // pageCount={pageCount}
            pageCount={totalPages}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
        />     
    </>
  );
}

export default CustomersPaginated;