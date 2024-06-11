import React, { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentServices from '../services/document.services';
import PartServices from '../services/parts.services';
import { UserContext } from '../store/UserProvider';
import styles from '../style.module.css';
import DisplayAlert from '../utils/DisplayAlert';
import message from '../utils/message';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { openNewWindow, URL } from '.././utils/helper';
import CertificateServices from '../services/certificate.services';
import ComplianceServices from '../services/compliance.services';
import InvoiceServices from '../services/invoice.services';
const { getPart, deletePart } = new PartServices();
const { getAllDocuments, deleteDocument } = new DocumentServices();
const { getAllComplianceDocuments, deleteComplianceDocumentById } =
  new ComplianceServices();
const {
  getAllInvoiceDocuments,
  editInvoiceDocumentById,
  deleteInvoiceDocumentById,
} = new InvoiceServices();
const { getAllCertificateDocuments, deleteCertificateDocumentById } =
  new CertificateServices();

const PartTable = () => {
  const { choice, showAlert, setShowAlert } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchtext, setSearchText] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [id, setId] = useState();
  const [deleteid, setDeleteId] = useState();
  const [documentType, setDocumentType] = useState('');

  const [showDropdown, setShowDropdown] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedId(id);
  };

  const navigate = useNavigate();

  const { pathname } = useLocation();

  console.log('PATHNAME', pathname);

  const handleDeleteBtn = async () => {
    try {
      if (choice && pathname === '/') {
        await deletePart(id);
        const newData = await getPart();
        setData(newData.data);
      } else if (choice && documentType === 'Supplier Contract') {
        await deleteDocument(deleteid);
        const newData = await getAllDocuments();
        setData2(newData.data);
      } else if (choice && documentType === 'Complaince Certificate') {
        await deleteComplianceDocumentById(deleteid);
        const newData = await getAllComplianceDocuments();
        setComplianceData(newData.data);
      } else if (choice && documentType === 'Invoice') {
        await deleteInvoiceDocumentById(deleteid);
        const newData = await getAllInvoiceDocuments();
        setInvoiceData(newData.data);
      } else if (choice && documentType === 'Certification_of_Insurance') {
        await deleteCertificateDocumentById(deleteid);
        const newData = await getAllCertificateDocuments();
        setCertificateData(newData.data);
      }
    } catch (error) {
      console.log({ error });
      message('error', error?.response?.data);
    }
  };

  const handlePartEditBtn = async (e) => {
    if (pathname === '/') {
      openNewWindow(e, `${URL}/edit-part/${id}`);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else if (documentType == 'Supplier Contract')
      navigate(`/supplier-document-edit/${id}`);
    else if (documentType == 'Complaince Certificate')
      navigate(`/compliance-document-edit/${id}`);
    else if (documentType == 'Invoice')
      navigate(`/invoice-document-edit/${id}`);
  };

  useEffect(() => {
    handleDeleteBtn();
  }, [choice]);

  const handleAPI = async () => {
    const response = await getPart();
    const response2 = await getAllDocuments();
    const compliance_Response = await getAllComplianceDocuments();
    const invoice_Response = await getAllInvoiceDocuments();
    const certificate_Response = await getAllCertificateDocuments();

    let newPartsData;

    searchtext
      ? (newPartsData = response?.data?.filter((elem) =>
        elem.part_number.includes(searchtext)
      ))
      : (newPartsData = response?.data.map((elem) => {
        return {
          ...elem,
          parts: [elem?.parts?.sort((a, b) => b.id - a.id)?.[0]],
        };
      }));

    const newPartsData2 = response2?.data.map((elem) => {
      return {
        ...elem,
        supplier_contract: [
          elem?.supplier_contract?.sort((a, b) => b.id - a.id)?.[0],
        ],
      };
    });

    const complianceData = compliance_Response?.data.map((elem) => {
      return {
        ...elem,
        docs: [elem?.docs?.sort((a, b) => b.id - a.id)?.[0]],
      };
    });

    const InvoiceData = invoice_Response?.data.map((elem) => {
      return {
        ...elem,
        invoice_Doc: [elem?.invoice_Doc?.sort((a, b) => b.id - a.id)?.[0]],
      };
    });

    const CertificateData = certificate_Response?.data.map((elem) => {
      return {
        ...elem,
        docs: [elem?.docs?.sort((a, b) => b.id - a.id)?.[0]],
      };
    });

    setData(newPartsData?.reverse());
    setData2(newPartsData2?.reverse());
    setComplianceData(complianceData?.reverse());
    setInvoiceData(InvoiceData?.reverse());
    setCertificateData(CertificateData?.reverse());
    // console.log('PARTSDATA', newPartsData);
    // console.log('Parts', response.data);
    // console.log('DATAIS', data2);
    // console.log('Compliance', complianceData);
  };

  useEffect(() => {
    handleAPI();
  }, [searchtext]);

  const handlePartClick = () => {
    navigate('/');
  };

  const handlePartDetails = (id) => {
    navigate('/part-details/' + id);
  };

  console.log('DATA2', data2);

  return (
    <div className={styles.fontStyles}>
      <div className={styles.rightBar}>
        <div className={styles.rightBarLogo}>
          <div title='Parts'>
            <Dropdown
              style={{
                padding: '0px',
                margin: '0px',
                cursor: 'pointer',
              }}
            >
              <Dropdown.Toggle
                style={{
                  backgroundColor: 'transparent',
                  padding: '0px',
                  margin: '0px',
                  border: 'none',
                }}
              >
                <img
                  src='/images/parts.png'
                  width={35}
                  height={35}
                  alt='part'
                  id={styles.hoverButton}
                  className={
                    styles.deleteIcon && pathname === '/'
                      ? styles.activeBtn
                      : ''
                  }
                  onClick={() => {
                    handlePartClick();
                  }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ backgroundColor: 'white' }}>
                <Dropdown.Item
                  className={styles.hoverText}
                  onClick={() => navigate('/create-part')}
                >
                  Create Parts
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div title='Document'>
            <Dropdown
              style={{
                padding: '0px',
                margin: '0px',
                cursor: 'pointer',
              }}
            >
              <Dropdown.Toggle
                style={{
                  backgroundColor: 'transparent',
                  padding: '0px',
                  margin: '0px',
                  border: 'none',
                }}
              >
                <img
                  src='/images/document.png'
                  width={35}
                  height={35}
                  alt=''
                  className={
                    styles.deleteIcon && pathname != '/' ? styles.activeBtn : ''
                  }
                  onClick={() => {
                    navigate('/document-table');
                  }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ backgroundColor: 'white' }}>
                <Dropdown.Item
                  className={styles.hoverText}
                  onClick={() => navigate('/supplier-documents')}
                >
                  Create Document
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div title='Folder'>
            <img
              src='https://cdn-icons-png.freepik.com/512/5994/5994710.png'
              width={30}
              height={30}
              alt=''
              className={styles.deleteIcon}
            />
          </div>
          <div title='Delete'>
            <img
              src='https://cdn-icons-png.freepik.com/512/9740/9740598.png'
              width={30}
              height={30}
              alt=''
              className={styles.deleteIcon}
              onClick={() => {
                setShowAlert(true);
              }}
            />
          </div>

          <div title='Edit'>
            <img
              src='https://cdn-icons-png.freepik.com/512/3425/3425921.png'
              width={30}
              height={30}
              alt=''
              className={styles.deleteIcon}
              onClick={(e) => handlePartEditBtn(e)}
            />
          </div>

          <div title='Task'>
            <img
              src='https://img.freepik.com/free-vector/online-document-form-digital-agreement-electronic-contract-internet-questionnaire-list-note-voting-ballot-poll-flat-design-element_335657-2667.jpg'
              width={30}
              height={30}
              alt=''
              className={styles.deleteIcon}
              onClick={() => {
                navigate('/task')
              }}
            />
          </div>
        </div>



        <div className={styles.searchSection}>
          <input
            type='text'
            onChange={(e) => setSearchText(e.target.value)}
            name=''
            width={300}
            height={300}
            id=''
          />
          <FaSearch />
        </div>
      </div>
      {pathname === '/' ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Supplier Name</th>
              <th>Created By</th>
              <th>Part Name</th>
              <th>Part Number</th>
              <th>state</th>
              <th>Version</th>
              <th>Iteration</th>
              <th>Created Date</th>
              <th>Modified Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((elem, index) => (
              <tr key={elem.id}>
                <td>
                  <input
                    className={styles.icon_pointer}
                    checked={elem.id === selectedId}
                    onChange={() => handleCheckboxChange(elem.id)}
                    onClick={() => setId(elem.id)}
                    type='checkbox'
                  />
                </td>

                <td>
                  <img
                    src='/images/supplier.png'
                    alt='part'
                    className={styles.display_supplier_icon}
                  />
                  {elem?.parts[0]?.supplier_name}
                </td>

                <td>John</td>

                <td>
                  <img
                    src='/images/parts.png'
                    alt='part'
                    className={styles.display_icon}
                  />
                  {elem?.part_name}
                </td>
                <td>{elem?.part_number}</td>

                <td className={styles.open}>Open </td>

                <td>A</td>

                <td>{elem?.parts[0]?.iteration_info}</td>

                <td>{elem?.createdDate}</td>

                <td>{elem?.parts[0]?.modifiedDate}</td>

                <td>
                  <img
                    className={styles.icon_pointer}
                    src='https://cdn-icons-png.freepik.com/256/665/665049.png?semt=ais_hybrid'
                    width={20}
                    height={20}
                    onClick={() => {
                      handlePartDetails(elem.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Supplier Name</th>
              <th>Supplier Type</th>
              <th>Created By</th>
              <th> Name</th>
              <th> Number</th>
              <th>state</th>
              <th>Version</th>
              <th>Iteration</th>
              <th>Created Date</th>
              <th>Modified Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data2?.map((elem, index) => (
              <tr key={elem.id}>
                <td>
                  <input
                    onClick={() => {
                      setId(elem.id);
                      setDeleteId(elem.id);
                      setDocumentType(elem.documenttype);
                    }}
                    // checked={elem.id === selectedId}
                    // onChange={() => handleCheckboxChange(elem.id)}
                    type='checkbox'
                  />
                </td>

                <td>
                  <img
                    src='/images/supplier.png'
                    alt='part'
                    className={styles.display_supplier_icon}
                  />
                  {elem?.supplier_contract[0]?.supplier_name}
                </td>

                <td>{elem?.documenttype}</td>

                <td>John</td>

                <td>
                  <img
                    src='/images/document.png'
                    alt='part'
                    className={styles.display_icon}
                  />
                  {elem?.document_name}
                </td>
                <td>{elem?.document_number}</td>

                <td className={styles.open}>Open </td>

                <td>A</td>

                <td>{elem?.supplier_contract[0]?.iteration_info}</td>

                <td>{elem?.createdDate}</td>

                <td>{elem?.modifiedDate}</td>

                <td>
                  <img
                    src='https://cdn-icons-png.freepik.com/256/665/665049.png?semt=ais_hybrid'
                    width={20}
                    height={20}
                    className={styles.icon_pointer}
                    onClick={() => {
                      navigate(`/supplier-document-details/${elem.id}`);
                    }}
                  />
                </td>
              </tr>
            ))}

            {complianceData?.map((elem, index) => (
              <tr key={elem.id}>
                <td>
                  <input
                    onClick={() => {
                      setId(elem.id);
                      setDeleteId(elem.id);
                      setDocumentType(elem.documenttype);
                    }}
                    // checked={elem.id === selectedId}
                    // onChange={() => handleCheckboxChange(elem.id)}
                    type='checkbox'
                  />
                </td>

                <td>
                  <img
                    src='/images/supplier.png'
                    alt='part'
                    className={styles.display_supplier_icon}
                  />
                  {elem?.docs[0]?.supplier_name}
                </td>

                <td>{elem?.documenttype}</td>

                <td>John</td>

                <td>
                  <img
                    src='/images/document.png'
                    alt='part'
                    className={styles.display_icon}
                  />
                  {elem?.document_name}
                </td>
                <td>{elem?.document_number}</td>

                <td className={styles.open}>Open </td>

                <td>A</td>

                <td>{elem?.docs[0]?.iteration_info}</td>

                <td>{elem?.createdDate}</td>

                <td>{elem?.modifiedDate}</td>

                <td>
                  <img
                    src='https://cdn-icons-png.freepik.com/256/665/665049.png?semt=ais_hybrid'
                    width={20}
                    height={20}
                    className={styles.icon_pointer}
                    onClick={() => {
                      navigate(`/compliance-documents-details/${elem.id}`);
                    }}
                  />
                </td>
              </tr>
            ))}

            {invoiceData?.map((elem, index) => (
              <tr key={elem.id}>
                <td>
                  <input
                    onClick={() => {
                      setId(elem.id);
                      setDeleteId(elem.id);
                      setDocumentType(elem.documenttype);
                    }}
                    // checked={elem.id === selectedId}
                    // onChange={() => handleCheckboxChange(elem.id)}
                    type='checkbox'
                  />
                </td>

                <td>
                  <img
                    src='/images/supplier.png'
                    alt='part'
                    className={styles.display_supplier_icon}
                  />
                  {elem?.invoice_Doc[0]?.supplier_name}
                </td>

                <td>{elem?.documenttype}</td>

                <td>John</td>

                <td>
                  <img
                    src='/images/document.png'
                    alt='part'
                    className={styles.display_icon}
                  />
                  {elem?.invoice_name}
                </td>
                <td>{elem?.invoice_number}</td>

                <td className={styles.open}>Open </td>

                <td>A</td>

                <td>{elem?.invoice_Doc[0]?.iteration_info}</td>

                <td>{elem?.createdDate}</td>

                <td>{elem?.modifiedDate}</td>

                <td>
                  <img
                    src='https://cdn-icons-png.freepik.com/256/665/665049.png?semt=ais_hybrid'
                    width={20}
                    height={20}
                    className={styles.icon_pointer}
                    onClick={() => {
                      navigate(`/invoice-documents-details/${elem.id}`);
                    }}
                  />
                </td>
              </tr>
            ))}

            {certificateData?.map((elem, index) => (
              <tr key={elem.id}>
                <td>
                  <input
                    onClick={() => {
                      setId(elem.id);
                      setDeleteId(elem.id);
                      setDocumentType(elem.documenttype);
                    }}
                    // checked={elem.id === selectedId}
                    // onChange={() => handleCheckboxChange(elem.id)}
                    type='checkbox'
                  />
                </td>

                <td>
                  <img
                    src='/images/supplier.png'
                    alt='part'
                    className={styles.display_supplier_icon}
                  />
                  {elem?.docs[0]?.supplier_name}
                </td>

                <td>{elem?.documenttype}</td>

                <td>John</td>

                <td>
                  <img
                    src='/images/document.png'
                    alt='part'
                    className={styles.display_icon}
                  />
                  {elem?.document_name}
                </td>
                <td>{elem?.document_number}</td>

                <td className={styles.open}>Open </td>

                <td>A</td>

                <td>{elem?.docs[0]?.iteration_info}</td>

                <td>{elem?.createdDate}</td>

                <td>{elem?.modifiedDate}</td>

                <td>
                  <img
                    src='https://cdn-icons-png.freepik.com/256/665/665049.png?semt=ais_hybrid'
                    width={20}
                    height={20}
                    className={styles.icon_pointer}
                    onClick={() => {
                      navigate(`/certificate-documents-details/${elem.id}`);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAlert && <DisplayAlert />}
    </div>
  );
};

export default PartTable;
